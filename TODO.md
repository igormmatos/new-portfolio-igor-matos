# TODO.md

## Objetivo atual do projeto
Manter e evoluir o portfólio profissional de Igor Matos (site público + admin), garantindo clareza da proposta, prova de competência e experiência, com conteúdo dinâmico via Supabase.

## Backlog priorizado
### P0 (crítico)
- Garantir que navegação e ancoragem de seções funcionem consistentemente em desktop e mobile. (mobile ajustado com scroll offset)
- Manter o conteúdo principal (hero + projetos) acima da dobra com foco no posicionamento. (mobile ajustado)

### P1 (importante)
- Consolidar escala tipográfica e espaçamento em todas as seções (H1/H2/H3/body/caption). (mobile ajustado)
- Padronizar cards de projetos e experiência para leitura comparativa rápida. (mobile ajustado)

### P2 (refino)
- Reduzir efeitos decorativos que competem com o conteúdo principal. (mobile ajustado)
- Ajustar microinterações para serem discretas e profissionais. (mobile ajustado)

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

## Pendências de BD
- [x] Criar o novo BD com colunas localizadas (pt-BR/en/fr).
- [x] Excluir o BD antigo.
- [x] Atualizar os inserts para os 3 idiomas.
- Atualizar o CRUD para inserir os 3 idiomas.
- Realizar testes automatizados no CRUD.

## Última atualização
2026-02-02
