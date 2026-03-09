-- Ensure public views execute with caller permissions/RLS context.
-- Safe to run multiple times.

BEGIN;

ALTER VIEW public.v_projects_with_skills SET (security_invoker = true);
ALTER VIEW public.v_skills_with_projects SET (security_invoker = true);

COMMIT;
