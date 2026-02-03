-- Remove legacy projects.technologies columns after N:N pivot adoption.
ALTER TABLE public.projects
  DROP COLUMN IF EXISTS technologies,
  DROP COLUMN IF EXISTS technologies_pt,
  DROP COLUMN IF EXISTS technologies_en,
  DROP COLUMN IF EXISTS technologies_fr;
