# RULES — Contrato de Trabalho com IA

Este arquivo define regras obrigatórias para qualquer IA (Codex, Cursor, etc.)
que atue neste repositório.

Se qualquer regra abaixo não for seguida, a resposta é considerada INVÁLIDA.

---

## 1. Fonte de Verdade (Obrigatório)

Antes de QUALQUER análise, sugestão ou alteração, a IA DEVE:

1. Ler TODO.md
2. Ler este arquivo (RULES.md)
3. Confirmar explicitamente que leu ambos

Nenhuma decisão pode contradizer TODO.md ou RULES.md.

---

## 2. Ordem de Trabalho (Não Negociável)

A IA deve sempre seguir esta ordem:

1. Ler TODO.md
2. Identificar o objetivo atual
3. Escolher UM item do TODO para trabalhar
4. Propor a abordagem
5. Somente implementar se autorizado
6. Atualizar TODO.md ao final

Pular etapas é proibido.

---

## 3. Prioridades

- Itens P0 SEMPRE têm precedência sobre P1 e P2
- É proibido trabalhar em P1/P2 enquanto existir P0 aberto
- Se surgir novo P0, ele deve ser registrado no TODO.md

---

## 4. Regra de Proposição

A IA NÃO pode:
- refatorar
- alterar layout
- modificar código
- ajustar UX/UI

sem antes:
- explicar o problema
- justificar a mudança
- descrever o impacto

Implementação sem proposta prévia é proibida.

---

## 5. Regra de Escopo (Muito Importante)

A IA DEVE respeitar o escopo definido pelo usuário.

Exemplos:
- Se a tarefa for “ajustar mobile”, o desktop NÃO pode ser alterado
- Se a tarefa for “layout”, lógica de negócio NÃO pode ser tocada
- Se algo fugir do escopo, a IA deve PARAR e avisar

---

## 6. Regra de Clareza (Portfólio)

Este projeto é um PORTFÓLIO profissional.

Portanto:
- Clareza > estética
- Simples > complexo
- Legibilidade > efeitos
- Decisões devem favorecer recrutadores e tech leads

Overengineering é proibido.

---

## 7. Atualização Obrigatória do TODO.md

Ao final de QUALQUER tarefa, a IA DEVE atualizar o TODO.md com:

- Itens concluídos
- Novos itens identificados
- Próxima ação recomendada
- Data da atualização

Não atualizar o TODO.md = tarefa incompleta.

---

## 8. Autochecagem (À Prova de Esquecimento)

Ao FINAL de cada resposta, a IA DEVE responder explicitamente:

- Li TODO.md? (sim/não)
- Li RULES.md? (sim/não)
- Trabalhei apenas no escopo solicitado? (sim/não)
- Atualizei ou sugeri atualização do TODO.md? (sim/não)

Se alguma resposta for “não”, a IA deve explicar o motivo.

---

## 9. Regra de Parada

A IA deve PARAR quando:
- o escopo estiver concluído
- faltar informação para continuar
- a próxima ação exigir decisão do usuário

Continuar sem critério claro é proibido.
