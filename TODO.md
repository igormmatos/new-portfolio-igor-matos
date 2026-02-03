# TODO.md

## Objetivo atual do projeto
Manter e evoluir o portfólio profissional de Igor Matos (site público + admin), garantindo clareza da proposta, prova de competência e experiência, com conteúdo dinâmico via Supabase.

## Backlog priorizado
### P0 (crítico)
- Garantir que navegação e ancoragem de seções funcionem consistentemente em desktop e mobile. (mobile ajustado com scroll offset)
- Manter o conteúdo principal (hero + projetos) acima da dobra com foco no posicionamento. (mobile ajustado)
- Padronizar botões circulares de navegação (carousel/timeline) com mesmo estilo e tamanho. (pages/Home.tsx, components/VerticalJourney.tsx)
- Padronizar títulos de seção (label + H2 + subtitle) para todas as seções. (pages/Home.tsx, components/VerticalJourney.tsx)

### P1 (importante)
- Consolidar escala tipográfica e espaçamento em todas as seções (H1/H2/H3/body/caption). (mobile ajustado)
- Padronizar cards de projetos e experiência para leitura comparativa rápida. (mobile ajustado)
- Normalizar espaçamentos entre seções com escala única (ex: py-24 desktop / py-16 mobile). (pages/Home.tsx, components/VerticalJourney.tsx)
- Uniformizar estilo base dos cards (raio/padding/borda) entre seções equivalentes. (pages/Home.tsx, components/VerticalJourney.tsx)

### P2 (refino)
- Reduzir efeitos decorativos que competem com o conteúdo principal. (mobile ajustado)
- Ajustar microinterações para serem discretas e profissionais. (mobile ajustado)
- Simplificar variações de cores de texto para títulos e body (1 cor para títulos, 1 para body). (pages/Home.tsx)

## Decisões já tomadas
- A ordem das seções prioriza Projetos antes de Competências e Tech.
- O CTA principal do hero é único, com links sociais como secundários.
- O menu segue a mesma ordem das seções da página.
- O admin mobile usa tabs horizontais para trocar de seção.
- O admin destaca o ícone de arraste para facilitar reordenação.

## Perguntas em aberto
- Quais métricas ou provas rápidas (ex: anos de experiência, projetos entregues) devem aparecer no topo?
- O hero deve priorizar headline de “Estratégia/Gestão” ou “Arquitetura/Engenharia”?
- Quais projetos devem ser destacados como “top 3” para recrutadores?

## Próxima ação concreta
Validar swipe/touch nos carrosseis de Projetos e Jornada no mobile.

## Backlog de padronização (UX/UI)
### P0 — percepção profissional
- Botões circulares unificados (borda/hover/tamanho) em carousel e timeline.
- Títulos de seção padronizados (label + H2 + subtitle + espaçamento fixo).

### P1 — leitura e fluidez
- Escala única de espaçamento entre seções e blocos internos.
- Cards com raio/padding/borda consistentes em seções equivalentes.

### P2 — polimento visual
- Unificar cores de texto (títulos vs body) e reduzir variações decorativas.

## Checklist final de qualidade (UX/UI)
- [x] Todas as seções parecem do mesmo sistema
- [x] Tipografia segue hierarquia consistente em todo o site
- [x] Botões principais seguem 3 padrões definidos
- [x] Cards têm mesmo raio, padding e estrutura base
- [x] Espaçamentos seguem uma escala única
- [x] Mobile mantém a mesma identidade visual do desktop
- [x] Não existem estilos “excepcionais” sem função clara
- [x] Site transmite solidez técnica e estética

## Pendências de BD
- [x] Criar o novo BD com colunas localizadas (pt-BR/en/fr).
- [x] Excluir o BD antigo.
- [x] Atualizar os inserts para os 3 idiomas.
- [x] insert/update apenas em ingles, falta frances
- [x] Realizar testes automatizados no CRUD.

## Última atualização
2026-02-03
