-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.competencies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  subtitle text,
  icon text,
  items ARRAY DEFAULT '{}'::text[],
  color_theme text DEFAULT 'indigo'::text,
  display_order integer DEFAULT 0,
  CONSTRAINT competencies_pkey PRIMARY KEY (id)
);
CREATE TABLE public.display_order_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  moved_item_id uuid,
  displaced_item_id uuid,
  new_position integer,
  happened_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT display_order_audit_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.journey_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  company text,
  period text,
  description text NOT NULL,
  type text DEFAULT 'work'::text,
  display_order integer DEFAULT 0,
  CONSTRAINT journey_items_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profile_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  display_name text NOT NULL,
  headline text NOT NULL,
  bio text NOT NULL,
  whatsapp text NOT NULL,
  linkedin_url text,
  email_contact text,
  action_phrase text,
  git_url text,
  badge text,
  CONSTRAINT profile_info_pkey PRIMARY KEY (id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  role text,
  description text,
  technologies text,
  github_url text,
  live_url text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  display_order integer DEFAULT 0,
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  is_whatsapp boolean DEFAULT true,
  status text DEFAULT 'Não Iniciado'::text,
  answers jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT submissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.technical_skills (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  icon text,
  level integer CHECK (level >= 0 AND level <= 100),
  display_order integer DEFAULT 0,
  CONSTRAINT technical_skills_pkey PRIMARY KEY (id)
);