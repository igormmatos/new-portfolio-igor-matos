
-- ==============================================================================
-- SETUP DE SEGURANÇA E TABELAS (RLS HARDENING)
-- Execute este script no Editor SQL do Supabase para corrigir vulnerabilidades.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA: TECHNICAL_SKILLS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.technical_skills (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    icon text,
    level integer CHECK (level >= 0 AND level <= 100),
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;

-- Remove políticas inseguras antigas
DROP POLICY IF EXISTS "Enable read access for all users" ON public.technical_skills;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.technical_skills;
DROP POLICY IF EXISTS "Enable update for all users" ON public.technical_skills;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.technical_skills;

-- Novas Políticas Seguras
CREATE POLICY "Public Read technical_skills" ON public.technical_skills FOR SELECT USING (true);
CREATE POLICY "Auth Insert technical_skills" ON public.technical_skills FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update technical_skills" ON public.technical_skills FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete technical_skills" ON public.technical_skills FOR DELETE USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 2. TABELA: PROJECTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    role text,
    description text,
    technologies text,
    github_url text,
    live_url text,
    image_url text,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read projects" ON public.projects;
DROP POLICY IF EXISTS "Auth Write projects" ON public.projects; -- Caso exista agrupada
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable update for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.projects;

CREATE POLICY "Public Read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Auth Insert projects" ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update projects" ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete projects" ON public.projects FOR DELETE USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 3. TABELA: JOURNEY_ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journey_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    company text,
    period text,
    description text,
    type text CHECK (type IN ('work', 'education')),
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journey_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.journey_items;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.journey_items;
DROP POLICY IF EXISTS "Enable update for all users" ON public.journey_items;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.journey_items;

CREATE POLICY "Public Read journey" ON public.journey_items FOR SELECT USING (true);
CREATE POLICY "Auth Insert journey" ON public.journey_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update journey" ON public.journey_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete journey" ON public.journey_items FOR DELETE USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 4. TABELA: COMPETENCIES (Skills/Strategic Areas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.competencies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    subtitle text,
    icon text,
    items text[], -- Array de strings
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.competencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.competencies;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.competencies;
DROP POLICY IF EXISTS "Enable update for all users" ON public.competencies;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.competencies;

CREATE POLICY "Public Read competencies" ON public.competencies FOR SELECT USING (true);
CREATE POLICY "Auth Insert competencies" ON public.competencies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update competencies" ON public.competencies FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete competencies" ON public.competencies FOR DELETE USING (auth.role() = 'authenticated');


-- ------------------------------------------------------------------------------
-- 5. TABELA: PROFILE_INFO
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_info (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    display_name text,
    headline text,
    bio text,
    badge text,
    action_phrase text,
    whatsapp text,
    linkedin_url text,
    git_url text,
    email_contact text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profile_info ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.profile_info;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.profile_info;
DROP POLICY IF EXISTS "Enable update for all users" ON public.profile_info;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.profile_info;

CREATE POLICY "Public Read profile" ON public.profile_info FOR SELECT USING (true);
-- Perfil geralmente não deletamos ou inserimos novos frequentemente via front, mas permitimos update
CREATE POLICY "Auth Insert profile" ON public.profile_info FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth Update profile" ON public.profile_info FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth Delete profile" ON public.profile_info FOR DELETE USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- DADOS INICIAIS (SEED) PARA TECHNICAL SKILLS (Apenas se vazio)
-- ------------------------------------------------------------------------------
INSERT INTO public.technical_skills (name, icon, level, display_order)
SELECT 'React', 'fa-brands fa-react', 95, 1
WHERE NOT EXISTS (SELECT 1 FROM public.technical_skills WHERE name = 'React');

INSERT INTO public.technical_skills (name, icon, level, display_order)
SELECT 'TypeScript', 'fa-brands fa-js', 90, 2
WHERE NOT EXISTS (SELECT 1 FROM public.technical_skills WHERE name = 'TypeScript');

INSERT INTO public.technical_skills (name, icon, level, display_order)
SELECT 'Tailwind CSS', 'fa-solid fa-wind', 98, 3
WHERE NOT EXISTS (SELECT 1 FROM public.technical_skills WHERE name = 'Tailwind CSS');


-- ==============================================================================
-- 6. AUTOMAÇÃO DE ORDENAÇÃO (TRIGGER SWAP)
-- ==============================================================================

-- Função Genérica para trocar a ordem de itens
CREATE OR REPLACE FUNCTION public.handle_display_order_swap()
RETURNS TRIGGER AS $$
DECLARE
    conflicting_id uuid;
BEGIN
    -- 1. Prevenção de Recursividade: Se a trigger já estiver rodando (profundidade > 1), pare.
    -- Isso evita que o UPDATE feito abaixo dispare a trigger novamente em loop infinito.
    IF pg_trigger_depth() > 1 THEN
        RETURN NEW;
    END IF;

    -- 2. Só executa se o display_order foi alterado
    IF OLD.display_order = NEW.display_order THEN
        RETURN NEW;
    END IF;

    -- 3. Verifica se existe colisão na tabela correta (TG_TABLE_NAME)
    -- Busca o ID do item que já está ocupando a "nova" posição desejada
    EXECUTE format('SELECT id FROM public.%I WHERE display_order = $1 AND id != $2', TG_TABLE_NAME)
    INTO conflicting_id
    USING NEW.display_order, NEW.id;

    -- 4. Se houver conflito, faz a troca (Swap)
    -- O item conflitante assume a posição antiga do item que está sendo movido (OLD.display_order)
    IF conflicting_id IS NOT NULL THEN
        EXECUTE format('UPDATE public.%I SET display_order = $1 WHERE id = $2', TG_TABLE_NAME)
        USING OLD.display_order, conflicting_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remoção de triggers antigos (caso existam) para recriação limpa
DROP TRIGGER IF EXISTS trg_swap_order_projects ON public.projects;
DROP TRIGGER IF EXISTS trg_swap_order_journey ON public.journey_items;
DROP TRIGGER IF EXISTS trg_swap_order_competencies ON public.competencies;
DROP TRIGGER IF EXISTS trg_swap_order_technical_skills ON public.technical_skills;

-- Aplicação da Trigger nas tabelas
CREATE TRIGGER trg_swap_order_projects
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_display_order_swap();

CREATE TRIGGER trg_swap_order_journey
BEFORE UPDATE ON public.journey_items
FOR EACH ROW EXECUTE FUNCTION public.handle_display_order_swap();

CREATE TRIGGER trg_swap_order_competencies
BEFORE UPDATE ON public.competencies
FOR EACH ROW EXECUTE FUNCTION public.handle_display_order_swap();

CREATE TRIGGER trg_swap_order_technical_skills
BEFORE UPDATE ON public.technical_skills
FOR EACH ROW EXECUTE FUNCTION public.handle_display_order_swap();
