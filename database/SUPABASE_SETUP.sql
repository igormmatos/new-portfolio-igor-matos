-- Habilitar extensão UUID (execute antes de criar as tabelas)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: competencies
CREATE TABLE public.competencies (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  title_pt text,
  title_en text,
  title_fr text,
  subtitle text,
  subtitle_pt text,
  subtitle_en text,
  subtitle_fr text,
  icon text,
  items text[] DEFAULT '{}',
  items_pt text[],
  items_en text[],
  items_fr text[],
  color_theme text DEFAULT 'indigo',
  display_order integer DEFAULT 0,
  CONSTRAINT competencies_pkey PRIMARY KEY (id)
);
ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;

-- Table: display_order_audit_logs
CREATE TABLE public.display_order_audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  moved_item_id uuid,
  displaced_item_id uuid,
  new_position integer,
  happened_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT display_order_audit_logs_pkey PRIMARY KEY (id)
);
ALTER TABLE public.display_order_audit_logs ENABLE ROW LEVEL SECURITY;

-- Table: journey_items
CREATE TABLE public.journey_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  title_pt text,
  title_en text,
  title_fr text,
  company text,
  company_pt text,
  company_en text,
  company_fr text,
  period text,
  period_pt text,
  period_en text,
  period_fr text,
  description text NOT NULL,
  description_pt text,
  description_en text,
  description_fr text,
  type text DEFAULT 'work',
  display_order integer DEFAULT 0,
  CONSTRAINT journey_items_pkey PRIMARY KEY (id)
);
ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;

-- Table: profile_info
CREATE TABLE public.profile_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  display_name text NOT NULL,
  display_name_pt text,
  display_name_en text,
  display_name_fr text,
  headline text NOT NULL,
  headline_pt text,
  headline_en text,
  headline_fr text,
  bio text NOT NULL,
  bio_pt text,
  bio_en text,
  bio_fr text,
  whatsapp text NOT NULL,
  linkedin_url text,
  email_contact text,
  action_phrase text,
  action_phrase_pt text,
  action_phrase_en text,
  action_phrase_fr text,
  git_url text,
  badge text,
  badge_pt text,
  badge_en text,
  badge_fr text,
  CONSTRAINT profile_info_pkey PRIMARY KEY (id)
);
ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;

-- Table: projects
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  title_pt text,
  title_en text,
  title_fr text,
  role text,
  role_pt text,
  role_en text,
  role_fr text,
  description text,
  description_pt text,
  description_en text,
  description_fr text,
  github_url text,
  live_url text,
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Table: services
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  title text NOT NULL,
  title_pt text,
  title_en text,
  title_fr text,
  description text NOT NULL,
  description_pt text,
  description_en text,
  description_fr text,
  icon text NOT NULL,
  display_order integer DEFAULT 0,
  CONSTRAINT services_pkey PRIMARY KEY (id)
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Table: submissions
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  is_whatsapp boolean DEFAULT true,
  status text DEFAULT 'Não Iniciado',
  answers jsonb DEFAULT '{}',
  CONSTRAINT submissions_pkey PRIMARY KEY (id)
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Table: technical_skills
CREATE TABLE public.technical_skills (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  name_pt text,
  name_en text,
  name_fr text,
  icon text,
  level integer CHECK (level >= 0 AND level <= 100),
  display_order integer DEFAULT 0,
  CONSTRAINT technical_skills_pkey PRIMARY KEY (id)
);
ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;

-- Policies (RLS)
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

CREATE POLICY "Public read services"
ON public.services FOR SELECT
USING (true);

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

CREATE POLICY "Auth write display_order_audit_logs"
ON public.display_order_audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Auth read display_order_audit_logs"
ON public.display_order_audit_logs FOR SELECT
TO authenticated
USING (true);

-- Data validation (NOT VALID to avoid blocking existing data; validate later)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_journey_items_display_order ON public.journey_items(display_order);
CREATE INDEX IF NOT EXISTS idx_competencies_display_order ON public.competencies(display_order);
CREATE INDEX IF NOT EXISTS idx_technical_skills_display_order ON public.technical_skills(display_order);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);


INSERT INTO "public"."competencies" (
  "id", 
  "created_at", 
  "title", 
  "title_pt", 
  "title_en", 
  "title_fr",
  "subtitle", 
  "subtitle_pt", 
  "subtitle_en", 
  "subtitle_fr",
  "icon", 
  "items", 
  "items_pt", 
  "items_en", 
  "items_fr",
  "color_theme", 
  "display_order"
) VALUES 
(
  'a1c1e9f0-0001-4b01-9e00-000000000001', 
  '2026-01-28 21:35:57.26971+00', 
  'Consultoria & Estratégia',
  'Consultoria & Estratégia',
  'Consulting & Strategy',
  'Conseil & Stratégie',
  'Análise, planejamento e direcionamento tecnológico.',
  'Análise, planejamento e direcionamento tecnológico.',
  'Analysis, planning and technological direction.',
  'Analyse, planification et orientation technologique.',
  'fa-solid fa-handshake', 
  ARRAY['Consultoria em TI e Estratégia','Roadmap tecnológico personalizado','Otimização de processos e governança','Recomendações estratégicas sob medida'],
  ARRAY['Consultoria em TI e Estratégia','Roadmap tecnológico personalizado','Otimização de processos e governança','Recomendações estratégicas sob medida'],
  ARRAY['IT and Strategy Consulting','Customized technology roadmap','Process optimization and governance','Tailored strategic recommendations'],
  ARRAY['Conseil en TI et Stratégie','Feuille de route technologique personnalisée','Optimisation des processus et gouvernance','Recommandations stratégiques sur mesure'],
  'purple', 
  1
),
(
  'a1c1e9f0-0002-4b01-9e00-000000000002', 
  '2026-01-28 21:35:57.26971+00', 
  'Gestão & Liderança',
  'Gestão & Liderança',
  'Management & Leadership',
  'Gestion & Leadership',
  'Condução de projetos e equipes com foco em resultados.',
  'Condução de projetos e equipes com foco em resultados.',
  'Leading projects and teams with a focus on results.',
  'Conduite de projets et d''équipes axée sur les résultats.',
  'fa-solid fa-users-gear', 
  ARRAY['Gestão Estratégica de Projetos','Metodologias Ágeis e Tradicionais','Liderança de equipes e gestão de conflitos','Ambiente produtivo e colaborativo'],
  ARRAY['Gestão Estratégica de Projetos','Metodologias Ágeis e Tradicionais','Liderança de equipes e gestão de conflitos','Ambiente produtivo e colaborativo'],
  ARRAY['Strategic Project Management','Agile and Traditional Methodologies','Team leadership and conflict management','Productive and collaborative environment'],
  ARRAY['Gestion Stratégique de Projets','Méthodologies Agiles et Traditionnelles','Leadership d''équipe et gestion des conflits','Environnement productif et collaboratif'],
  'green', 
  2
),
(
  'a1c1e9f0-0003-4b01-9e00-000000000003', 
  '2026-01-28 21:35:57.26971+00', 
  'Desenvolvimento de Sistemas',
  'Desenvolvimento de Sistemas',
  'Systems Development',
  'Développement de Systèmes',
  'Soluções sob medida para web e mobile.',
  'Soluções sob medida para web e mobile.',
  'Customized solutions for web and mobile.',
  'Solutions sur mesure pour web et mobile.',
  'fa-solid fa-laptop-code', 
  ARRAY['Sistemas Web e Mobile sob medida','Planejamento, desenvolvimento e entrega','Tecnologias: Python, PHP, JavaScript, MySQL','Soluções escaláveis e robustas'],
  ARRAY['Sistemas Web e Mobile sob medida','Planejamento, desenvolvimento e entrega','Tecnologias: Python, PHP, JavaScript, MySQL','Soluções escaláveis e robustas'],
  ARRAY['Custom Web and Mobile Systems','Planning, development and delivery','Technologies: Python, PHP, JavaScript, MySQL','Scalable and robust solutions'],
  ARRAY['Systèmes Web et Mobile sur mesure','Planification, développement et livraison','Technologies: Python, PHP, JavaScript, MySQL','Solutions évolutives et robustes'],
  'indigo', 
  3
),
(
  'a1c1e9f0-0004-4b01-9e00-000000000004', 
  '2026-01-28 21:35:57.26971+00', 
  'Arquitetura & Operações',
  'Arquitetura & Operações',
  'Architecture & Operations',
  'Architecture & Opérations',
  'Soluções robustas, seguras e eficientes para escalar seu negócio.',
  'Soluções robustas, seguras e eficientes para escalar seu negócio.',
  'Robust, secure and efficient solutions to scale your business.',
  'Solutions robustes, sécurisées et efficaces pour faire évoluer votre entreprise.',
  'fa-solid fa-sitemap', 
  ARRAY['Design de sistemas complexos','Governança de TI e Cloud (AWS, Azure)','Gestão de Riscos e Continuidade Operacional','Otimização de Processos e Redução de Gargalos'],
  ARRAY['Design de sistemas complexos','Governança de TI e Cloud (AWS, Azure)','Gestão de Riscos e Continuidade Operacional','Otimização de Processos e Redução de Gargalos'],
  ARRAY['Complex systems design','IT Governance and Cloud (AWS, Azure)','Risk Management and Operational Continuity','Process Optimization and Bottleneck Reduction'],
  ARRAY['Conception de systèmes complexes','Gouvernance TI et Cloud (AWS, Azure)','Gestion des Risques et Continuité Opérationnelle','Optimisation des Processus et Réduction des Goulets'],
  'gray', 
  4
);
INSERT INTO "public"."journey_items" (
  "id", "created_at",
  "title", "title_pt", "title_en", "title_fr",
  "company", "company_pt", "company_en", "company_fr",
  "period", "period_pt", "period_en", "period_fr",
  "description", "description_pt", "description_en", "description_fr",
  "type", "display_order"
) VALUES
(
  '0e86885d-a897-4c6f-8016-8a3d523a466b',
  '2026-01-20 22:58:00.45945+00',
  'Estagiário',
  'Estagiário',
  'Intern',
  'Stagiaire',
  'COTEMIG',
  'COTEMIG',
  'COTEMIG',
  'COTEMIG',
  'Mai de 2017 – Dez de 2017',
  'Mai de 2017 – Dez de 2017',
  'May 2017 – Dec 2017',
  'Mai 2017 – Déc 2017',
  'Atuei como monitor e suporte técnico, auxiliando alunos com dúvidas em diversas linguagens de programação (HTML, JavaScript/jQuery, MySQL, C#, ASP.Net e PHP), redes e arquitetura, contribuindo para o aprendizado e desenvolvimento técnico.',
  'Atuei como monitor e suporte técnico, auxiliando alunos com dúvidas em diversas linguagens de programação (HTML, JavaScript/jQuery, MySQL, C#, ASP.Net e PHP), redes e arquitetura, contribuindo para o aprendizado e desenvolvimento técnico.',
  'Worked as a lab monitor and technical support, helping students with questions in several programming languages (HTML, JavaScript/jQuery, MySQL, C#, ASP.Net and PHP), networks and architecture, contributing to their learning and technical development.',
  'J''ai travaillé comme moniteur et support technique, aidant les étudiants avec des questions sur plusieurs langages de programmation (HTML, JavaScript/jQuery, MySQL, C#, ASP.Net et PHP), réseaux et architecture, contribuant à leur apprentissage et développement technique.',
  'experience',
  5
),
(
  '2390a1f9-5b1a-4643-b109-006614f3ba18',
  '2026-01-20 22:58:00.45945+00',
  'Oficial do Exército Brasileiro (1º Tenente e Subcomandante)',
  'Oficial do Exército Brasileiro (1º Tenente e Subcomandante)',
  'Brazilian Army Officer (First Lieutenant and Deputy Commander)',
  'Officier de l''Armée Brésilienne (Lieutenant de première classe et Sous-commandant)',
  'Exército Brasileiro',
  'Exército Brasileiro',
  'Brazilian Army',
  'Armée Brésilienne',
  'Set de 2023 – Atual (7 anos de experiência militar)',
  'Set de 2023 – Atual (7 anos de experiência militar)',
  'Sep 2023 – Present (7 years of military experience)',
  'Sept 2023 – Présent (7 ans d''expérience militaire)',
  'Líder com 7 anos de experiência em comando, gestão estratégica, logística, operações e governança. Atuo como Subcomandante, principal líder e assessor direto do Comandante, responsável pela liderança institucional, gestão operacional e de pessoas, e assessoramento estratégico para tomada de decisão em ambientes de alta pressão. Experiência em gestão de riscos, licitações e contratos, e planejamento de missões de apoio à sociedade.',
  'Líder com 7 anos de experiência em comando, gestão estratégica, logística, operações e governança. Atuo como Subcomandante, principal líder e assessor direto do Comandante, responsável pela liderança institucional, gestão operacional e de pessoas, e assessoramento estratégico para tomada de decisão em ambientes de alta pressão. Experiência em gestão de riscos, licitações e contratos, e planejamento de missões de apoio à sociedade.',
  'Leader with 7 years of experience in command, strategic management, logistics, operations and governance. I serve as Deputy Commander, the main leader and direct adviser to the Commander, responsible for institutional leadership, operational and people management, and strategic advisory for decision-making in high-pressure environments. Experience in risk management, public tenders and contracts, and planning missions to support society.',
  'Leader avec 7 ans d''expérience en commandement, gestion stratégique, logistique, opérations et gouvernance. J''agis comme Sous-commandant, principal leader et conseiller direct du Commandant, responsable du leadership institutionnel, de la gestion opérationnelle et des personnes, ainsi que du conseil stratégique pour la prise de décision dans des environnements à forte pression. Expérience en gestion des risques, appels d''offres et contrats, et planification de missions de soutien à la société.',
  'experience',
  0
),
(
  '33bceecc-27d1-439d-a27c-7e372a038deb',
  '2026-01-20 22:58:00.45945+00',
  'Gerente de Projetos',
  'Gerente de Projetos',
  'Project Manager',
  'Chef de Projet',
  '2C SISTEMAS',
  '2C SISTEMAS',
  '2C SISTEMAS',
  '2C SISTEMAS',
  'Fev de 2017 – Mai de 2020',
  'Fev de 2017 – Mai de 2020',
  'Feb 2017 – May 2020',
  'Fév 2017 – Mai 2020',
  'Liderei o desenvolvimento de um sistema de gerenciamento de tarefas para a Embrapa Gado de Leite, arquitetando o sistema do zero, levantando requisitos, modelando banco de dados e desenvolvendo o backend (jQuery, MySQL, AJAX, JavaScript e PHP). Fui responsável pela gestão completa do projeto e implantação da infraestrutura.',
  'Liderei o desenvolvimento de um sistema de gerenciamento de tarefas para a Embrapa Gado de Leite, arquitetando o sistema do zero, levantando requisitos, modelando banco de dados e desenvolvendo o backend (jQuery, MySQL, AJAX, JavaScript e PHP). Fui responsável pela gestão completa do projeto e implantação da infraestrutura.',
  'Led the development of a task management system for Embrapa Gado de Leite, architecting the system from scratch, gathering requirements, modeling the database and developing the backend (jQuery, MySQL, AJAX, JavaScript and PHP). Was responsible for full project management and infrastructure deployment.',
  'J''ai dirigé le développement d''un système de gestion de tâches pour Embrapa Gado de Leite, en architecturant le système depuis zéro, en levantant les exigences, en modélisant la base de données et en développant le backend (jQuery, MySQL, AJAX, JavaScript et PHP). J''ai été responsable de la gestion complète du projet et du déploiement de l''infrastructure.',
  'experience',
  2
),
(
  '6464a78a-a4a5-40cb-9edd-8e9b2ace445f',
  '2026-01-20 22:58:00.45945+00',
  'Técnico em Informática',
  'Técnico em Informática',
  'IT Technician',
  'Technicien en Informatique',
  'Colégio COTEMIG',
  'Colégio COTEMIG',
  'COTEMIG High School',
  'Lycée COTEMIG',
  '2016 – 2017',
  '2016 – 2017',
  '2016 – 2017',
  '2016 – 2017',
  'Ensino médio integrado ao curso técnico, proporcionando aprofundamento em TI e experiência prática. Participei como expositor na FINIT (Feira Internacional de Negócios, Inovação e Tecnologia) em 2017.',
  'Ensino médio integrado ao curso técnico, proporcionando aprofundamento em TI e experiência prática. Participei como expositor na FINIT (Feira Internacional de Negócios, Inovação e Tecnologia) em 2017.',
  'High school integrated with a technical IT course, providing deeper knowledge in IT and hands-on experience. Participated as an exhibitor at FINIT (International Fair of Business, Innovation and Technology) in 2017.',
  'Lycée intégré à une formation technique en informatique, offrant un approfondissement en TI et une expérience pratique. J''ai participé comme exposant à la FINIT (Foire Internationale des Affaires, de l''Innovation et de la Technologie) en 2017.',
  'education',
  6
),
(
  '9882e315-3707-4f57-9057-4fa346a47083',
  '2026-01-20 22:58:00.45945+00',
  'Desenvolvedor Júnior',
  'Desenvolvedor Júnior',
  'Junior Developer',
  'Développeur Junior',
  'Brasiltrack Monitoramento Via Satélite',
  'Brasiltrack Monitoramento Via Satélite',
  'Brasiltrack Satellite Monitoring',
  'Brasiltrack Surveillance par Satellite',
  'Jan de 2018 – Fev de 2019',
  'Jan de 2018 – Fev de 2019',
  'Jan 2018 – Feb 2019',
  'Jan 2018 – Fév 2019',
  'Atuei na análise, desenvolvimento e manutenção de sistemas de monitoramento logístico (jQuery, MySQL, AJAX, JavaScript e PHP). Desenvolvi e mantive Gateways para comunicação com rastreadores e APIs em Python para integração entre sistemas.',
  'Atuei na análise, desenvolvimento e manutenção de sistemas de monitoramento logístico (jQuery, MySQL, AJAX, JavaScript e PHP). Desenvolvi e mantive Gateways para comunicação com rastreadores e APIs em Python para integração entre sistemas.',
  'Worked on analysis, development and maintenance of logistics monitoring systems (jQuery, MySQL, AJAX, JavaScript and PHP). Developed and maintained gateways for communication with trackers and Python APIs for system integration.',
  'J''ai travaillé sur l''analyse, le développement et la maintenance de systèmes de suivi logistique (jQuery, MySQL, AJAX, JavaScript et PHP). J''ai développé et maintenu des passerelles pour la communication avec les traceurs et des API en Python pour l''intégration entre systèmes.',
  'experience',
  4
),
(
  '997a6fcd-e7e5-4ac9-8f63-dfd5335722a2',
  '2026-01-20 22:58:00.45945+00',
  'MBA em Inteligência Artificial e Gestão de Negócios',
  'MBA em Inteligência Artificial e Gestão de Negócios',
  'MBA in Artificial Intelligence and Business Management',
  'MBA en Intelligence Artificielle et Gestion des Affaires',
  'Gran Faculdade',
  'Gran Faculdade',
  'Gran College',
  'Gran Faculté',
  'Nov de 2025 – Mai de 2027 (Em Conclusão)',
  'Nov de 2025 – Mai de 2027 (Em Conclusão)',
  'Nov 2025 – May 2027 (In Progress)',
  'Nov 2025 – Mai 2027 (En Cours)',
  'Foco em aliar gestão estratégica e inovação com as mais recentes tecnologias em IA, capacitando para liderança da transformação digital e geração de valor competitivo.',
  'Foco em aliar gestão estratégica e inovação com as mais recentes tecnologias em IA, capacitando para liderança da transformação digital e geração de valor competitivo.',
  'Focus on combining strategic management and innovation with the latest AI technologies, enabling leadership of digital transformation and generation of competitive value.',
  'Accent sur la combinaison de la gestion stratégique et de l''innovation avec les technologies d''IA les plus récentes, permettant de conduire la transformation digitale et de générer de la valeur compétitive.',
  'education',
  1
),
(
  'cbdb98c4-42ee-49a3-9513-b02f08492541',
  '2026-01-20 22:58:00.45945+00',
  'Graduação em Análise e Desenvolvimento de Sistemas',
  'Graduação em Análise e Desenvolvimento de Sistemas',
  'Bachelor in Systems Analysis and Development',
  'Licence en Analyse et Développement de Systèmes',
  'Estácio',
  'Estácio',
  'Estácio',
  'Estácio',
  'Jan de 2022 – Abr de 2024',
  'Jan de 2022 – Abr de 2024',
  'Jan 2022 – Apr 2024',
  'Jan 2022 – Avr 2024',
  'Formação sólida em desenvolvimento de software, gestão de projetos, banco de dados, programação orientada a objetos (POO) e análise de requisitos.',
  'Formação sólida em desenvolvimento de software, gestão de projetos, banco de dados, programação orientada a objetos (POO) e análise de requisitos.',
  'Solid background in software development, project management, databases, object-oriented programming (OOP) and requirements analysis.',
  'Formation solide en développement logiciel, gestion de projets, bases de données, programmation orientée objet (POO) et analyse des exigences.',
  'education',
  3
);


INSERT INTO "public"."profile_info" (
  "id", 
  "created_at",
  "display_name", "display_name_pt", "display_name_en", "display_name_fr",
  "headline", "headline_pt", "headline_en", "headline_fr",
  "bio", "bio_pt", "bio_en", "bio_fr",
  "whatsapp", 
  "linkedin_url", 
  "email_contact",
  "action_phrase", "action_phrase_pt", "action_phrase_en", "action_phrase_fr",
  "git_url",
  "badge", "badge_pt", "badge_en", "badge_fr"
) VALUES (
  '5fc5cf69-a145-4347-b14c-c0d29989e806',
  '2026-01-22 16:31:45.629+00',
  'Igor Matos',
  'Igor Matos',
  'Igor Matos',
  'Igor Matos',
  'Estrategista Tecnológico & Gestor de Soluções',
  'Estrategista Tecnológico & Gestor de Soluções',
  'Technology Strategist & Solutions Manager',
  'Stratège Technologique & Gestionnaire de Solutions',
  'Com sólida experiência em Análise e Desenvolvimento de Sistemas, gestão de projetos e liderança estratégica, atuo na arquitetura e entrega de soluções tecnológicas robustas. Minha trajetória combina expertise técnica com visão de negócios e gestão de equipes, forjada em ambientes de alta performance.',
  'Com sólida experiência em Análise e Desenvolvimento de Sistemas, gestão de projetos e liderança estratégica, atuo na arquitetura e entrega de soluções tecnológicas robustas. Minha trajetória combina expertise técnica com visão de negócios e gestão de equipes, forjada em ambientes de alta performance.',
  'With solid experience in Systems Analysis and Development, project management and strategic leadership, I work on the architecture and delivery of robust technological solutions. My trajectory combines technical expertise with business vision and team management, forged in high-performance environments.',
  'Avec une solide expérience en Analyse et Développement de Systèmes, gestion de projets et leadership stratégique, je travaille sur l''architecture et la livraison de solutions technologiques robustes. Mon parcours combine expertise technique, vision d''affaires et gestion d''équipes, forgé dans des environnements de haute performance.',
  '+5595991353797',
  'https://www.linkedin.com/in/igor-mmatos/',
  'igorantonio50@gmail.com',
  'Transformando desafios em resultados com tecnologia e liderança.',
  'Transformando desafios em resultados com tecnologia e liderança.',
  'Transforming challenges into results with technology and leadership.',
  'Transformer les défis en résultats avec technologie et leadership.',
  'https://github.com/igormmatos',
  'Disponível para novos projetos',
  'Disponível para novos projetos',
  'Available for new projects',
  'Disponible pour de nouveaux projets'
);

INSERT INTO "public"."projects" (
  "id", "created_at",
  "title", "title_pt", "title_en", "title_fr",
  "role", "role_pt", "role_en", "role_fr",
  "description", "description_pt", "description_en", "description_fr",
  "github_url", "live_url", "image_url", "display_order"
) VALUES
(
  '4a0b53ed-c1a2-4e4f-bb38-27d8d25e6e0f',
  '2026-01-20 20:04:02.003325+00',
  'Marçal Treinos',
  'Marçal Treinos',
  'Marçal Training',
  'Marçal Entraînement',
  'Fullstack Developer',
  'Desenvolvedor Fullstack',
  'Fullstack Developer',
  'Développeur Fullstack',
  'Sistema completo de gestão de fichas de alunos (Web/Mobile). Features: Login Google, Acesso individual, Progressão de treino e Integração MercadoPago.',
  'Sistema completo de gestão de fichas de alunos (Web/Mobile). Features: Login Google, Acesso individual, Progressão de treino e Integração MercadoPago.',
  'Complete student sheet management system (Web/Mobile). Features: Google Login, individual access, training progression and MercadoPago integration.',
  'Système complet de gestion de fiches d''étudiants (Web/Mobile). Fonctionnalités : Connexion Google, accès individuel, progression d''entraînement et intégration MercadoPago.',
  'https://github.com/igormatos',
  '#',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop',
  2
),
(
  '94ab1975-1200-4929-b06c-59d02d075f45',
  '2026-01-20 20:04:02.003325+00',
  'Sistema de Gestão para a Embrapa Gado de Leite',
  'Sistema de Gestão para a Embrapa Gado de Leite',
  'Management System for Embrapa Dairy Cattle',
  'Système de Gestion pour Embrapa Bovins Laitiers',
  'Frontend Lead',
  'Líder de Frontend',
  'Frontend Lead',
  'Responsable Frontend',
  'Sistema de gestão de tarefas otimizado para o setor lácteo, desenvolvido em parceria com o Colégio Cotemig.',
  'Sistema de gestão de tarefas otimizado para o setor lácteo, desenvolvido em parceria com o Colégio Cotemig.',
  'Task management system optimized for the dairy sector, developed in partnership with Colégio Cotemig.',
  'Système de gestion de tâches optimisé pour le secteur laitier, développé en partenariat avec le Colégio Cotemig.',
  'https://github.com/igormmatos',
  '#',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1474&auto=format&fit=crop',
  0
),
(
  'e2cf4875-35fb-4345-a693-7b9c2a1465fd',
  '2026-01-20 20:04:02.003325+00',
  'Arquitetura 2C Sistemas',
  'Arquitetura 2C Sistemas',
  '2C Systems Architecture',
  'Architecture 2C Systèmes',
  'Solutions Architect',
  'Arquiteto de Soluções',
  'Solutions Architect',
  'Architecte de Solutions',
  'Atuação como PM e Arquiteto na reestruturação de sistemas legados e implementação de novos processos de CI/CD.',
  'Atuação como PM e Arquiteto na reestruturação de sistemas legados e implementação de novos processos de CI/CD.',
  'Worked as PM and Architect in the restructuring of legacy systems and implementation of new CI/CD processes.',
  'Travail en tant que PM et Architecte dans la restructuration de systèmes hérités et la mise en œuvre de nouveaux processus CI/CD.',
  '',
  '#',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop',
  1
);



INSERT INTO "public"."services" (
  "id", "created_at",
  "title", "title_pt", "title_en", "title_fr",
  "description", "description_pt", "description_en", "description_fr",
  "icon", "display_order"
) VALUES
(
  '48c54a17-a7df-4141-8f26-0916431a0fe3',
  '2026-01-20 22:52:28.162601+00',
  'Consultoria em TI e Estratégia',
  'Consultoria em TI e Estratégia',
  'IT and Strategy Consulting',
  'Conseil en TI et Stratégie',
  'Transformo desafios tecnológicos em soluções estratégicas. Ofereço análise aprofundada, roadmap tecnológico e recomendações personalizadas para otimizar processos, impulsionar o crescimento e garantir a governança do seu negócio.',
  'Transformo desafios tecnológicos em soluções estratégicas. Ofereço análise aprofundada, roadmap tecnológico e recomendações personalizadas para otimizar processos, impulsionar o crescimento e garantir a governança do seu negócio.',
  'I transform technological challenges into strategic solutions. I offer in-depth analysis, technology roadmap and personalized recommendations to optimize processes, drive growth and ensure governance of your business.',
  'Je transforme les défis technologiques en solutions stratégiques. J''offre une analyse approfondie, une feuille de route technologique et des recommandations personnalisées pour optimiser les processus, stimuler la croissance et assurer la gouvernance de votre entreprise.',
  'fa-solid fa-handshake',
  2
),
(
  '6e6cdaee-8b91-4b40-9dde-25eaae7c87d3',
  '2026-01-20 22:52:28.162601+00',
  'Gestão Estratégica de Projetos',
  'Gestão Estratégica de Projetos',
  'Strategic Project Management',
  'Gestion Stratégique de Projets',
  'Ofereço assessoria especializada na gestão de projetos de TI, do planejamento à entrega. Garanto o cumprimento de prazos, a qualidade das entregas e o alinhamento estratégico com os objetivos do seu negócio, aplicando metodologias ágeis e tradicionais.',
  'Ofereço assessoria especializada na gestão de projetos de TI, do planejamento à entrega. Garanto o cumprimento de prazos, a qualidade das entregas e o alinhamento estratégico com os objetivos do seu negócio, aplicando metodologias ágeis e tradicionais.',
  'I offer specialized advisory in IT project management, from planning to delivery. I ensure compliance with deadlines, quality of deliverables and strategic alignment with your business objectives, applying agile and traditional methodologies.',
  'J''offre des conseils spécialisés en gestion de projets TI, de la planification à la livraison. Je garantis le respect des délais, la qualité des livrables et l''alignement stratégique avec les objectifs de votre entreprise, en appliquant des méthodologies agiles et traditionnelles.',
  'fa-solid fa-chart-line',
  3
),
(
  'b615d6d8-bd87-485d-a1b9-760a51d9aec7',
  '2026-01-20 22:52:28.162601+00',
  'Liderança e Desenvolvimento de Equipes',
  'Liderança e Desenvolvimento de Equipes',
  'Leadership and Team Development',
  'Leadership et Développement d''Équipes',
  'Com 7 anos de experiência, lidero e motivo equipes multidisciplinares para o alcance de objetivos em ambientes de alta pressão. Foco no desenvolvimento de talentos, gestão de conflitos e promoção de um ambiente colaborativo e produtivo.',
  'Com 7 anos de experiência, lidero e motivo equipes multidisciplinares para o alcance de objetivos em ambientes de alta pressão. Foco no desenvolvimento de talentos, gestão de conflitos e promoção de um ambiente colaborativo e produtivo.',
  'With 7 years of experience, I lead and motivate multidisciplinary teams to achieve objectives in high-pressure environments. I focus on talent development, conflict management and promoting a collaborative and productive environment.',
  'Avec 7 ans d''expérience, je dirige et motive des équipes multidisciplinaires pour atteindre des objectifs dans des environnements à forte pression. Je me concentre sur le développement des talents, la gestion des conflits et la promotion d''un environnement collaboratif et productif.',
  'fa-solid fa-people-group',
  5
),
(
  'bcadfaf1-ba3b-48f2-af59-2fb76ee7f982',
  '2026-01-20 22:52:28.162601+00',
  'Gestão de Riscos e Otimização de Processos',
  'Gestão de Riscos e Otimização de Processos',
  'Risk Management and Process Optimization',
  'Gestion des Risques et Optimisation des Processus',
  'Estruturo e aprimoro planos de gestão de riscos, minimizando vulnerabilidades e garantindo a continuidade das operações. Identifico gargalos e proponho soluções para otimizar processos, aumentando a eficiência e reduzindo custos.',
  'Estruturo e aprimoro planos de gestão de riscos, minimizando vulnerabilidades e garantindo a continuidade das operações. Identifico gargalos e proponho soluções para otimizar processos, aumentando a eficiência e reduzindo custos.',
  'I structure and improve risk management plans, minimizing vulnerabilities and ensuring operational continuity. I identify bottlenecks and propose solutions to optimize processes, increasing efficiency and reducing costs.',
  'Je structure et améliore les plans de gestion des risques, en minimisant les vulnérabilités et en assurant la continuité opérationnelle. J''identifie les goulets d''étranglement et propose des solutions pour optimiser les processus, en augmentant l''efficacité et en réduisant les coûts.',
  'fa-solid fa-arrows-rotate',
  4
),
(
  'bd98a370-5131-44a8-8bfe-55abb14c44c6',
  '2026-01-20 22:52:28.162601+00',
  'Desenvolvimento de Sistemas Personalizados',
  'Desenvolvimento de Sistemas Personalizados',
  'Custom Systems Development',
  'Développement de Systèmes Personnalisés',
  'Desenvolvo sistemas web e mobile sob medida, do planejamento à entrega. Transformo suas ideias em soluções robustas, escaláveis e eficientes, utilizando tecnologias como Python, PHP, JavaScript e MySQL.',
  'Desenvolvo sistemas web e mobile sob medida, do planejamento à entrega. Transformo suas ideias em soluções robustas, escaláveis e eficientes, utilizando tecnologias como Python, PHP, JavaScript e MySQL.',
  'I develop custom web and mobile systems, from planning to delivery. I transform your ideas into robust, scalable and efficient solutions, using technologies such as Python, PHP, JavaScript and MySQL.',
  'Je développe des systèmes web et mobile sur mesure, de la planification à la livraison. Je transforme vos idées en solutions robustes, évolutives et efficaces, en utilisant des technologies telles que Python, PHP, JavaScript et MySQL.',
  'fa-solid fa-laptop-code',
  3
),
(
  'ed5c8df0-e29a-4a10-9f81-5e5d5b53aabe',
  '2026-01-20 22:52:28.162601+00',
  'Arquitetura e Governança de Soluções',
  'Arquitetura e Governança de Soluções',
  'Solutions Architecture and Governance',
  'Architecture et Gouvernance de Solutions',
  'Crio o design e a estrutura de sistemas complexos, garantindo soluções robustas, escaláveis e seguras. Alinho as melhores práticas de mercado e governança de TI às necessidades específicas do seu projeto, incluindo Cloud (AWS/Azure).',
  'Crio o design e a estrutura de sistemas complexos, garantindo soluções robustas, escaláveis e seguras. Alinho as melhores práticas de mercado e governança de TI às necessidades específicas do seu projeto, incluindo Cloud (AWS/Azure).',
  'I create the design and structure of complex systems, ensuring robust, scalable and secure solutions. I align market best practices and IT governance to the specific needs of your project, including Cloud (AWS/Azure).',
  'Je crée la conception et la structure de systèmes complexes, garantissant des solutions robustes, évolutives et sécurisées. J''aligne les meilleures pratiques du marché et la gouvernance TI aux besoins spécifiques de votre projet, y compris le Cloud (AWS/Azure).',
  'fa-solid fa-sitemap',
  2
);
