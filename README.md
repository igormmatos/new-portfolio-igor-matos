# Igor Matos Portfolio

---

# EN

## Project Overview
A professional portfolio built with React + Vite, featuring a public site and an admin panel for CRUD content management backed by Supabase.

## Key Features
- Public portfolio with sections for Projects, Journey, Skills, Tech Stack, and Contact.
- Admin panel with CRUD for profile, projects, journey, competencies, and technical skills.
- Drag-and-drop ordering for list-based content in the admin.
- i18n support (pt-BR / en / fr) with UI strings and database-backed localized fields.
- Fallbacks for missing content (e.g., technical skills) when the database is empty or unavailable.

## Tech Stack
- React 18 + Vite
- TypeScript
- Supabase (Auth + DB + Edge Function)
- DeepL (translations via Edge Function)
- @hello-pangea/dnd (drag-and-drop)
- Vitest (tests)

## Getting Started
1) Install dependencies
```bash
npm install
```

2) Configure environment variables (Supabase)
The project uses Vite, so variables must start with `VITE_`.
Required:
- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

3) Run the dev server
```bash
npm run dev
```

## Testing
```bash
npm run test
```

## Project Structure
- `pages/` — main pages (Home, Admin, Login)
- `components/` — layout and reusable UI blocks
- `services/` — API and auth logic (Supabase)
- `supabase/functions/` — Edge Functions (translation)
- `__tests__/` — Vitest test suite
- `database/` — SQL setup and seed data

## i18n (pt-BR / en / fr)
Language switching is handled by the i18n context (`i18n.tsx`). UI strings live in the translation map, while content fetched from Supabase uses localized fields (e.g., `title_pt`, `title_en`, `title_fr`).

## Database Content Localization
The app stores localized fields per entity (e.g., `title_pt`, `title_en`, `title_fr`). The UI selects the best available value based on language, with fallback to pt-BR when missing. Translation for CRUD writes is handled via an Edge Function integrated with DeepL (`supabase/functions/translate`).

## Observability Roadmap
Analytics and SEO enhancements are planned but not implemented yet.

## Workflow
See `TODO.md` for priorities and `RULES.md` for the workflow contract.

## Auto-generated Section
<!-- AUTO-GENERATED:START -->
### EN
**Status**
- Project: portfolio-igor-matos v1.0.0
- Objective: Maintain and evolve Igor Matos' professional portfolio (public site + admin), ensuring clarity of the value proposition, proof of competence and experience, with dynamic content via Supabase.

**Commands**
- Dev: `npm run dev`
- Build: `npm run build`
- Test: `npm run test`
- README: `npm run readme:gen`

**Roadmap snapshot**
**P0**
- Garantir que navegação e ancoragem de seções funcionem consistentemente em desktop e mobile. (mobile ajustado com scroll offset)
- Manter o conteúdo principal (hero + projetos) acima da dobra com foco no posicionamento. (mobile ajustado)
- Padronizar botões circulares de navegação (carousel/timeline) com mesmo estilo e tamanho. (pages/Home.tsx, components/VerticalJourney.tsx)
- Padronizar títulos de seção (label + H2 + subtitle) para todas as seções. (pages/Home.tsx, components/VerticalJourney.tsx)

**P1**
- Consolidar escala tipográfica e espaçamento em todas as seções (H1/H2/H3/body/caption). (mobile ajustado)
- Padronizar cards de projetos e experiência para leitura comparativa rápida. (mobile ajustado)
- Normalizar espaçamentos entre seções com escala única (ex: py-24 desktop / py-16 mobile). (pages/Home.tsx, components/VerticalJourney.tsx)
- Uniformizar estilo base dos cards (raio/padding/borda) entre seções equivalentes. (pages/Home.tsx, components/VerticalJourney.tsx)
- Documentação: README bilíngue + bloco autogerado via script. (concluído)

**P2**
- Reduzir efeitos decorativos que competem com o conteúdo principal. (mobile ajustado)
- Ajustar microinterações para serem discretas e profissionais. (mobile ajustado)
- Simplificar variações de cores de texto para títulos e body (1 cor para títulos, 1 para body). (pages/Home.tsx)

### PT
**Status**
- Projeto: portfolio-igor-matos v1.0.0
- Objetivo: Manter e evoluir o portfólio profissional de Igor Matos (site público + admin), garantindo clareza da proposta, prova de competência e experiência, com conteúdo dinâmico via Supabase.

**Comandos**
- Dev: `npm run dev`
- Build: `npm run build`
- Teste: `npm run test`
- README: `npm run readme:gen`

**Snapshot do roadmap**
**P0**
- Garantir que navegação e ancoragem de seções funcionem consistentemente em desktop e mobile. (mobile ajustado com scroll offset)
- Manter o conteúdo principal (hero + projetos) acima da dobra com foco no posicionamento. (mobile ajustado)
- Padronizar botões circulares de navegação (carousel/timeline) com mesmo estilo e tamanho. (pages/Home.tsx, components/VerticalJourney.tsx)
- Padronizar títulos de seção (label + H2 + subtitle) para todas as seções. (pages/Home.tsx, components/VerticalJourney.tsx)

**P1**
- Consolidar escala tipográfica e espaçamento em todas as seções (H1/H2/H3/body/caption). (mobile ajustado)
- Padronizar cards de projetos e experiência para leitura comparativa rápida. (mobile ajustado)
- Normalizar espaçamentos entre seções com escala única (ex: py-24 desktop / py-16 mobile). (pages/Home.tsx, components/VerticalJourney.tsx)
- Uniformizar estilo base dos cards (raio/padding/borda) entre seções equivalentes. (pages/Home.tsx, components/VerticalJourney.tsx)
- Documentação: README bilíngue + bloco autogerado via script. (concluído)

**P2**
- Reduzir efeitos decorativos que competem com o conteúdo principal. (mobile ajustado)
- Ajustar microinterações para serem discretas e profissionais. (mobile ajustado)
- Simplificar variações de cores de texto para títulos e body (1 cor para títulos, 1 para body). (pages/Home.tsx)
<!-- AUTO-GENERATED:END -->

---

# PT

## Visão Geral do Projeto
Portfólio profissional em React + Vite, com site público e painel admin para gestão de conteúdo via CRUD no Supabase.

## Principais Funcionalidades
- Site público com seções de Projetos, Jornada, Habilidades, Tecnologias e Contato.
- Painel admin com CRUD para perfil, projetos, jornada, competências e tecnologias.
- Reordenação com drag-and-drop no admin.
- i18n (pt-BR / en / fr) com textos de UI e campos localizados do banco.
- Fallbacks quando o conteúdo do banco não está disponível (ex.: tecnologias).

## Stack
- React 18 + Vite
- TypeScript
- Supabase (Auth + DB + Edge Function)
- DeepL (traduções via Edge Function)
- @hello-pangea/dnd (drag-and-drop)
- Vitest (testes)

## Como Rodar
1) Instalar dependências
```bash
npm install
```

2) Configurar variáveis de ambiente (Supabase)
O projeto usa Vite, então as variáveis precisam começar com `VITE_`.
Obrigatórias:
- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

3) Subir o servidor de desenvolvimento
```bash
npm run dev
```

## Testes
```bash
npm run test
```

## Estrutura do Projeto
- `pages/` — páginas principais (Home, Admin, Login)
- `components/` — layout e componentes de UI
- `services/` — lógica de API e auth (Supabase)
- `supabase/functions/` — Edge Functions (tradução)
- `__tests__/` — suíte de testes (Vitest)
- `database/` — SQL de setup e seeds

## i18n (pt-BR / en / fr)
O switch de idioma é feito pelo contexto de i18n (`i18n.tsx`). Strings da UI ficam no mapa de traduções e o conteúdo do Supabase usa campos localizados (`title_pt`, `title_en`, `title_fr`).

## Localização de Conteúdo do BD
Os registros possuem campos localizados por idioma (ex.: `title_pt`, `title_en`, `title_fr`). A UI escolhe o melhor valor disponível com fallback para pt-BR quando faltar. As traduções de escrita no CRUD usam a Edge Function integrada ao DeepL (`supabase/functions/translate`).

## Roadmap de Observabilidade
Analytics e SEO estão planejados, mas ainda não implementados.

## Workflow
Veja `TODO.md` para prioridades e `RULES.md` para o contrato de trabalho.

## Seção Autogerada
<!-- AUTO-GENERATED:START -->
<!-- AUTO-GENERATED:END -->
