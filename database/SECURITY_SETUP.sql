-- Security hardening for Supabase (run separately after schema)
-- Assumes UUID extension already enabled and tables exist.

-- 1) Enable RLS
ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technical_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.display_order_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2) Read policies (public content)
CREATE POLICY "Public read profile_info"
ON public.profile_info FOR SELECT
USING (true);

CREATE POLICY "Public read published projects"
ON public.projects FOR SELECT
USING (status = 'published');

CREATE POLICY "Public read journey_items"
ON public.journey_items FOR SELECT
USING (true);

CREATE POLICY "Public read competencies"
ON public.competencies FOR SELECT
USING (true);

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

CREATE POLICY "Public read services"
ON public.services FOR SELECT
USING (true);

-- 3) Write policies (authenticated only)
CREATE POLICY "Auth write profile_info"
ON public.profile_info FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update profile_info"
ON public.profile_info FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete profile_info"
ON public.profile_info FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Auth write projects"
ON public.projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update projects"
ON public.projects FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete projects"
ON public.projects FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Auth write journey_items"
ON public.journey_items FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update journey_items"
ON public.journey_items FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete journey_items"
ON public.journey_items FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Auth write competencies"
ON public.competencies FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update competencies"
ON public.competencies FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete competencies"
ON public.competencies FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Auth write technical_skills"
ON public.technical_skills FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update technical_skills"
ON public.technical_skills FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete technical_skills"
ON public.technical_skills FOR DELETE
TO authenticated
USING (true);

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

CREATE POLICY "Auth write services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth update services"
ON public.services FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete services"
ON public.services FOR DELETE
TO authenticated
USING (true);

-- 4) Submissions: public insert, admin read/update/delete
CREATE POLICY "Public create submissions"
ON public.submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Auth read submissions"
ON public.submissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Auth update submissions"
ON public.submissions FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Auth delete submissions"
ON public.submissions FOR DELETE
TO authenticated
USING (true);

-- 5) Audit logs: admin only
CREATE POLICY "Auth write display_order_audit_logs"
ON public.display_order_audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth read display_order_audit_logs"
ON public.display_order_audit_logs FOR SELECT
TO authenticated
USING (true);

-- 6) Basic data validation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profile_info_email_contact_format'
  ) THEN
    ALTER TABLE public.profile_info DROP CONSTRAINT profile_info_email_contact_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profile_info_linkedin_url_format'
  ) THEN
    ALTER TABLE public.profile_info DROP CONSTRAINT profile_info_linkedin_url_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profile_info_git_url_format'
  ) THEN
    ALTER TABLE public.profile_info DROP CONSTRAINT profile_info_git_url_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profile_info_whatsapp_format'
  ) THEN
    ALTER TABLE public.profile_info DROP CONSTRAINT profile_info_whatsapp_format;
  END IF;
END $$;

ALTER TABLE public.profile_info
  ADD CONSTRAINT profile_info_email_contact_format
  CHECK (
    email_contact IS NULL
    OR (
      btrim(
        translate(
          email_contact,
          chr(8203) || chr(8204) || chr(8205) || chr(65279) || chr(9) || chr(10) || chr(13) || chr(32),
          ''
        )
      ) NOT LIKE '%@%@%'
      AND position('@' in btrim(
        translate(
          email_contact,
          chr(8203) || chr(8204) || chr(8205) || chr(65279) || chr(9) || chr(10) || chr(13) || chr(32),
          ''
        )
      )) > 1
      AND split_part(
        btrim(
          translate(
            email_contact,
            chr(8203) || chr(8204) || chr(8205) || chr(65279) || chr(9) || chr(10) || chr(13) || chr(32),
            ''
          )
        ),
        '@',
        2
      ) LIKE '%.%'
      AND position('.' in split_part(
        btrim(
          translate(
            email_contact,
            chr(8203) || chr(8204) || chr(8205) || chr(65279) || chr(9) || chr(10) || chr(13) || chr(32),
            ''
          )
        ),
        '@',
        2
      )) > 1
    )
  ) NOT VALID,
  ADD CONSTRAINT profile_info_linkedin_url_format
  CHECK (linkedin_url IS NULL OR linkedin_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT profile_info_git_url_format
  CHECK (git_url IS NULL OR git_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT profile_info_whatsapp_format
  CHECK (whatsapp ~ '^[0-9+() -]+$') NOT VALID;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'submissions_user_email_format'
  ) THEN
    ALTER TABLE public.submissions DROP CONSTRAINT submissions_user_email_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'submissions_user_phone_format'
  ) THEN
    ALTER TABLE public.submissions DROP CONSTRAINT submissions_user_phone_format;
  END IF;
END $$;

ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_user_email_format
  CHECK (user_email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$') NOT VALID,
  ADD CONSTRAINT submissions_user_phone_format
  CHECK (user_phone ~ '^[0-9+\\-()\\s]+$') NOT VALID;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_github_url_format'
  ) THEN
    ALTER TABLE public.projects DROP CONSTRAINT projects_github_url_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_live_url_format'
  ) THEN
    ALTER TABLE public.projects DROP CONSTRAINT projects_live_url_format;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'projects_image_url_format'
  ) THEN
    ALTER TABLE public.projects DROP CONSTRAINT projects_image_url_format;
  END IF;
END $$;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_github_url_format
  CHECK (github_url IS NULL OR github_url = '' OR github_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT projects_live_url_format
  CHECK (live_url IS NULL OR live_url = '' OR live_url ~* '^https?://') NOT VALID,
  ADD CONSTRAINT projects_image_url_format
  CHECK (image_url IS NULL OR image_url = '' OR image_url ~* '^https?://') NOT VALID;

-- 7) Useful indexes
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_journey_items_display_order ON public.journey_items(display_order);
CREATE INDEX IF NOT EXISTS idx_competencies_display_order ON public.competencies(display_order);
CREATE INDEX IF NOT EXISTS idx_technical_skills_display_order ON public.technical_skills(display_order);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);
