-- Project ↔ Technical Skills (N:N) migration
-- Safe to run multiple times.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Projects: add slug/status/updated_at without breaking existing data
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE public.projects
SET status = COALESCE(status, 'published')
WHERE status IS NULL;

UPDATE public.projects
SET slug = COALESCE(
  NULLIF(slug, ''),
  lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8)
)
WHERE slug IS NULL OR slug = '';

ALTER TABLE public.projects
  ALTER COLUMN slug SET NOT NULL,
  ALTER COLUMN status SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_projects_slug_unique ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_projects_updated_at'
  ) THEN
    CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Technical skills: add catalog fields while keeping existing rows
ALTER TABLE public.technical_skills
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS icon_key text,
  ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE public.technical_skills
SET
  icon_key = COALESCE(icon_key, icon),
  category = COALESCE(NULLIF(category, ''), 'other'),
  slug = COALESCE(
    NULLIF(slug, ''),
    lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || left(id::text, 8)
  ),
  is_active = COALESCE(is_active, true);

ALTER TABLE public.technical_skills
  ALTER COLUMN slug SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN is_active SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_technical_skills_slug_unique ON public.technical_skills(slug);
CREATE INDEX IF NOT EXISTS idx_technical_skills_category ON public.technical_skills(category);
CREATE INDEX IF NOT EXISTS idx_technical_skills_is_active ON public.technical_skills(is_active);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_technical_skills_updated_at'
  ) THEN
    CREATE TRIGGER set_technical_skills_updated_at
    BEFORE UPDATE ON public.technical_skills
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Pivot table
CREATE TABLE IF NOT EXISTS public.project_technical_skills (
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  technical_skill_id uuid NOT NULL REFERENCES public.technical_skills(id) ON DELETE RESTRICT,
  context text NULL,
  sort_order integer NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT project_technical_skills_pkey PRIMARY KEY (project_id, technical_skill_id)
);

ALTER TABLE public.project_technical_skills ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_project_technical_skills_project_id
  ON public.project_technical_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_technical_skills_skill_id
  ON public.project_technical_skills(technical_skill_id);

-- Views
CREATE OR REPLACE VIEW public.v_projects_with_skills AS
SELECT
  p.*,
  COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', skill_rows.id,
        'slug', skill_rows.slug,
        'name', skill_rows.name,
        'category', skill_rows.category,
        'icon_key', skill_rows.icon_key
      )
      ORDER BY COALESCE(skill_rows.sort_order, 9999), skill_rows.name
    ) FILTER (WHERE skill_rows.id IS NOT NULL),
    '[]'::jsonb
  ) AS skills
FROM public.projects p
LEFT JOIN LATERAL (
  SELECT DISTINCT ON (ts.id)
    ts.id,
    ts.slug,
    ts.name,
    ts.category,
    ts.icon_key,
    pts.sort_order
  FROM public.project_technical_skills pts
  JOIN public.technical_skills ts
    ON ts.id = pts.technical_skill_id AND ts.is_active = true
  WHERE pts.project_id = p.id
  ORDER BY ts.id, COALESCE(pts.sort_order, 9999), ts.name
) AS skill_rows ON true
WHERE p.status = 'published'
GROUP BY p.id;

CREATE OR REPLACE VIEW public.v_skills_with_projects AS
SELECT
  ts.*,
  COALESCE(project_rows.projects_count, 0) AS projects_count,
  COALESCE(project_rows.projects, '[]'::jsonb) AS projects
FROM public.technical_skills ts
LEFT JOIN LATERAL (
  SELECT
    COUNT(*) AS projects_count,
    jsonb_agg(
      jsonb_build_object(
        'id', p2.id,
        'slug', p2.slug,
        'title', p2.title,
        'role', p2.role,
        'image_url', p2.image_url,
        'display_order', p2.display_order
      )
      ORDER BY p2.display_order
    ) AS projects
  FROM (
    SELECT DISTINCT ON (p.id)
      p.id,
      p.slug,
      p.title,
      p.role,
      p.image_url,
      p.display_order
    FROM public.project_technical_skills pts
    JOIN public.projects p ON p.id = pts.project_id AND p.status = 'published'
    WHERE pts.technical_skill_id = ts.id
    ORDER BY p.id, p.display_order
  ) AS p2
) AS project_rows ON true
WHERE ts.is_active = true
AND COALESCE(project_rows.projects_count, 0) > 0;

-- RLS Policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read projects' AND tablename = 'projects') THEN
    DROP POLICY "Public read projects" ON public.projects;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read technical_skills' AND tablename = 'technical_skills') THEN
    DROP POLICY "Public read technical_skills" ON public.technical_skills;
  END IF;
END $$;

CREATE POLICY "Public read published projects"
ON public.projects FOR SELECT
USING (status = 'published');

CREATE POLICY "Public read active technical_skills"
ON public.technical_skills FOR SELECT
USING (is_active = true);

CREATE POLICY "Public read project_technical_skills"
ON public.project_technical_skills FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_id AND p.status = 'published'
  )
  AND EXISTS (
    SELECT 1 FROM public.technical_skills ts
    WHERE ts.id = technical_skill_id AND ts.is_active = true
  )
);

CREATE POLICY "Auth write project_technical_skills"
ON public.project_technical_skills FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update project_technical_skills"
ON public.project_technical_skills FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete project_technical_skills"
ON public.project_technical_skills FOR DELETE
TO authenticated
USING (true);

-- RPC for syncing project skills
CREATE OR REPLACE FUNCTION public.sync_project_skills(
  p_project_id uuid,
  p_skill_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.project_technical_skills
  WHERE project_id = p_project_id
    AND technical_skill_id <> ALL (COALESCE(p_skill_ids, ARRAY[]::uuid[]));

  INSERT INTO public.project_technical_skills (project_id, technical_skill_id)
  SELECT p_project_id, skill_id
  FROM unnest(COALESCE(p_skill_ids, ARRAY[]::uuid[])) AS skill_id
  ON CONFLICT DO NOTHING;
END;
$$;
