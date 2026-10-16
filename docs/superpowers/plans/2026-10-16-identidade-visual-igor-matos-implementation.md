# Identidade Visual Igor Matos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a especificação aprovada de marca em um sistema visual final, verificável e reutilizável, com símbolo, logotipo, tokens, grafismos, aplicações e manual, sem alterar o site nesta fase.

**Architecture:** A execução será dividida em núcleo de marca, validação visual, sistema gráfico e documentação. Os ativos finais serão versionados no repositório em formatos vetoriais e de referência; o site atual permanece intacto até uma etapa posterior de integração. A exploração criativa será controlada por critérios objetivos da especificação e cada direção visual passará por uma revisão explícita antes de ser tratada como final.

**Tech Stack:** SVG, Markdown, JSON/CSS para tokens de marca, React/Vite/Vitest apenas para validações estáticas dos ativos; image generation e/ou ferramenta vetorial para exploração visual; fontes Space Grotesk e Inter conforme especificação.

**Spec:** `docs/superpowers/specs/2026-10-16-identidade-visual-igor-matos-design.md`

## Global Constraints

- Marca principal: `Igor Matos`.
- Assinatura estratégica: `Estratégia · Tecnologia · Execução`.
- Conceito central: `Direção Inteligente`.
- Personalidade visual: `Comando Contemporâneo`.
- Público híbrido com prioridade comercial.
- Preservar autoridade, disciplina, precisão, estratégia, tecnologia, movimento e execução.
- Não usar símbolos militares literais ou clichês táticos.
- Cores-base: `#020617`, `#0F172A`, `#4F46E5`, `#818CF8`, `#3B82F6`, `#22C55E`, `#F8FAFC`, `#94A3B8`.
- Indigo é a cor proprietária; azul é expansão; verde é funcional e não protagonista.
- Tipografia: Space Grotesk para títulos/wordmark; Inter para corpo/interface.
- Símbolo deve evoluir o atual, preservando inteligência + conexão + sistema e adicionando direção + progresso + execução.
- Símbolo compacto e sólido, com aproximadamente 6 nós, conexões geométricas e eixo dominante inferior-esquerda → superior-direita.
- O símbolo deve funcionar em outline, solid e monocromático.
- Se perder leitura entre 16 px e 32 px, deve ser simplificado.
- Sistema gráfico: nós, conexões, vetores, trajetórias, grids técnicos, módulos sólidos, labels e numeração.
- Efeitos digitais são acento; estrutura sólida domina.
- Fotografia institucional: P&B; contexto: dessaturado/frio; projetos: coloridos dentro de moldura proprietária.
- Tom de voz: direto, técnico e humano.
- Nenhum elemento decorativo sem função de hierarquia, ritmo, direção ou organização.
- Nesta fase, não alterar `pages/Home.tsx`, `components/Layout.tsx`, `index.html`, CSS de produção ou banco de dados.

## Review Focus

- Redução real do símbolo em 16, 24 e 32 px: manter leitura e não virar emaranhado.
- Monocromia em fundos claro e escuro: preservar forma e hierarquia sem depender de gradiente.
- Distância de clichês: não parecer brasão militar, cérebro genérico de IA, ícone de startup ou logo de desenvolvedor.
- Assinatura longa em pequenas larguras: a versão reduzida deve funcionar sem `Estratégia · Tecnologia · Execução`.
- Contraste e legibilidade: combinações de Navy/Indigo/Blue/Green precisam manter leitura em aplicações digitais e institucionais.

---

## File Structure

### Criar

- `public/brand/brand-tokens.json` — fonte canônica de cores, tipografia, raios, espessuras e usos semânticos.
- `public/brand/logo-mark.svg` — símbolo isolado final.
- `public/brand/logo-mark-outline.svg` — versão outline.
- `public/brand/logo-mark-mono.svg` — versão monocromática neutra.
- `public/brand/logo-horizontal.svg` — símbolo + `IGOR MATOS`.
- `public/brand/logo-horizontal-tagline.svg` — símbolo + nome + assinatura estratégica.
- `public/brand/logo-stacked.svg` — composição vertical.
- `public/brand/monogram-im.svg` — monograma auxiliar, não principal.
- `public/brand/pattern-network.svg` — grafismo de nós/conexões derivado do símbolo.
- `public/brand/pattern-direction.svg` — grafismo direcional derivado do eixo ascendente.
- `public/brand/frame-project.svg` — moldura proprietária de projeto/produto.
- `docs/brand/exploracoes-simbolo.md` — registro das três explorações controladas e rationale.
- `docs/brand/manual-identidade-visual.md` — manual-fonte da IDV.
- `docs/brand/checklist-validacao.md` — matriz de validação técnica e visual.
- `__tests__/brandAssets.test.ts` — validação estática dos tokens e ativos SVG.

### Modificar ao final da fase

- `TODO.md` — registrar item concluído, novas pendências, próxima ação e data.
- `README.md` — somente por meio de `npm run readme:gen` se a atualização do TODO gerar conteúdo autogerado esperado.

### Não modificar nesta fase

- `pages/Home.tsx`
- `components/Layout.tsx`
- `index.html`
- `public/base.css`
- `public/custom-animations.css`

---

### Task 1: Fundação canônica da marca

**Files:**
- Create: `public/brand/brand-tokens.json`
- Create: `__tests__/brandAssets.test.ts`

**Interfaces:**
- Consumes: valores aprovados na especificação.
- Produces: `brand-tokens.json` como fonte canônica para todos os ativos subsequentes.

- [ ] **Step 1: Write the failing test**

Criar testes que afirmem exatamente:
- `colors.navy950 === "#020617"`
- `colors.navy900 === "#0F172A"`
- `colors.indigo600 === "#4F46E5"`
- `colors.indigo400 === "#818CF8"`
- `colors.blue500 === "#3B82F6"`
- `colors.green500 === "#22C55E"`
- `colors.offWhite === "#F8FAFC"`
- `colors.slate400 === "#94A3B8"`
- `typography.heading.family === "Space Grotesk"`
- `typography.body.family === "Inter"`
- verde esteja marcado como `functional`, não `primary`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- brandAssets.test.ts`

Expected: FAIL porque `public/brand/brand-tokens.json` ainda não existe.

- [ ] **Step 3: Create `public/brand/brand-tokens.json`**

Estruturar `colors`, `typography`, `geometry`, `stroke`, `radius`, `usage` e `gradient`, usando somente valores aprovados ou valores derivados explicitamente documentados.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- brandAssets.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/brand/brand-tokens.json __tests__/brandAssets.test.ts
git commit -m "feat: define canonical brand tokens"
```

---

### Task 2: Exploração controlada do símbolo

**Files:**
- Create: `docs/brand/exploracoes-simbolo.md`
- Create working previews under `docs/brand/previews/` only if needed for review.

**Interfaces:**
- Consumes: conceito `Direção Inteligente`, 6 nós aproximados, eixo ascendente, compactação e critérios de redução.
- Produces: três alternativas de símbolo suficientemente diferentes para decisão humana, todas dentro do mesmo conceito aprovado.

- [ ] **Step 1: Define the three controlled directions**

Registrar três explorações:
1. **Vetor Integrado** — rede compacta com trajetória ascendente embutida; recomendada.
2. **Núcleo Direcional** — massa mais sólida com poucos vazios e vetor implícito.
3. **Rede Modular** — nós mais aparentes e estrutura ligeiramente mais aberta.

Nenhuma opção pode introduzir cérebro literal, lâmpada literal, seta óbvia, brasão ou monograma como marca principal.

- [ ] **Step 2: Generate visual studies**

Criar uma prancha comparativa com as três opções em:
- positivo sobre Navy 950;
- negativo/monocromático;
- 64 px;
- simulação de 24 px.

- [ ] **Step 3: Record rationale and failure risks**

Em `docs/brand/exploracoes-simbolo.md`, registrar para cada opção:
- o que preserva do logo atual;
- como expressa direção;
- risco de clichê;
- desempenho esperado em redução;
- recomendação.

- [ ] **Step 4: Human review gate**

Apresentar as três alternativas e parar. Não converter nenhuma em logotipo final antes da escolha explícita do usuário.

- [ ] **Step 5: Commit exploration record**

```bash
git add docs/brand/exploracoes-simbolo.md docs/brand/previews/
git commit -m "design: explore direction-intelligence symbol concepts"
```

---

### Task 3: Refinamento do símbolo e sistema de logotipo

**Files:**
- Create: `public/brand/logo-mark.svg`
- Create: `public/brand/logo-mark-outline.svg`
- Create: `public/brand/logo-mark-mono.svg`
- Create: `public/brand/logo-horizontal.svg`
- Create: `public/brand/logo-horizontal-tagline.svg`
- Create: `public/brand/logo-stacked.svg`
- Create: `public/brand/monogram-im.svg`
- Modify: `__tests__/brandAssets.test.ts`

**Interfaces:**
- Consumes: alternativa escolhida na Task 2 + `brand-tokens.json`.
- Produces: conjunto oficial de assinaturas vetoriais.

- [ ] **Step 1: Write failing asset-contract tests**

Testar que cada arquivo SVG oficial:
- existe;
- contém `viewBox`;
- não contém raster embutido (`<image`);
- não contém cores fora da paleta canônica quando houver cor explícita;
- possui `<title>` e `<desc>` nas versões institucionais;
- `logo-horizontal-tagline.svg` contém `Estratégia`, `Tecnologia` e `Execução`.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- brandAssets.test.ts`

Expected: FAIL por ausência dos SVGs.

- [ ] **Step 3: Build the final mark SVG**

Construir o símbolo escolhido com geometria enxuta, eixo inferior-esquerda → superior-direita e quantidade mínima de nós necessária para manter o conceito.

- [ ] **Step 4: Build logo variants**

Criar versões horizontal, horizontal com assinatura, vertical, outline, monocromática e monograma auxiliar.

- [ ] **Step 5: Run automated tests**

Run: `npm test -- brandAssets.test.ts`

Expected: PASS.

- [ ] **Step 6: Run visual reduction checks**

Validar visualmente o símbolo a 16, 24, 32, 64 e 128 px em fundos claro e escuro. Se 16–32 px perder leitura, simplificar antes de prosseguir.

- [ ] **Step 7: Commit**

```bash
git add public/brand __tests__/brandAssets.test.ts
git commit -m "design: finalize Igor Matos logo system"
```

---

### Task 4: Sistema gráfico derivado da marca

**Files:**
- Create: `public/brand/pattern-network.svg`
- Create: `public/brand/pattern-direction.svg`
- Create: `public/brand/frame-project.svg`
- Modify: `__tests__/brandAssets.test.ts`

**Interfaces:**
- Consumes: geometria final do símbolo e tokens canônicos.
- Produces: repertório gráfico reconhecível sem dependência do logo.

- [ ] **Step 1: Add failing tests**

Testar existência, `viewBox`, ausência de raster e uso restrito à paleta em todos os três grafismos.

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- brandAssets.test.ts`

Expected: FAIL.

- [ ] **Step 3: Create pattern-network.svg**

Derivar nós e conexões do símbolo, sem repetir o logotipo inteiro como padrão.

- [ ] **Step 4: Create pattern-direction.svg**

Derivar trajetória diagonal ascendente e microelementos de direção, sem seta literal dominante.

- [ ] **Step 5: Create frame-project.svg**

Criar moldura para screenshots/projetos com Navy, label/número opcional e ponto/vetor periférico.

- [ ] **Step 6: Run tests**

Run: `npm test -- brandAssets.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add public/brand __tests__/brandAssets.test.ts
git commit -m "design: add visual identity graphic system"
```

---

### Task 5: Aplicações de prova

**Files:**
- Create: `docs/brand/previews/aplicacao-instagram.*`
- Create: `docs/brand/previews/aplicacao-linkedin.*`
- Create: `docs/brand/previews/aplicacao-proposta.*`
- Create: `docs/brand/previews/aplicacao-projeto.*`
- Create: `docs/brand/checklist-validacao.md`

**Interfaces:**
- Consumes: logo, tokens e grafismos finais.
- Produces: quatro aplicações de prova para validar consistência antes do manual.

- [ ] **Step 1: Define validation matrix**

Criar checklist com critérios:
- reconhecimento sem logo;
- autoridade sem rigidez excessiva;
- prioridade comercial;
- legibilidade;
- uso correto do verde;
- fotografia coerente;
- ausência de clichê militar/IA/startup;
- adaptação a claro/escuro.

- [ ] **Step 2: Produce Instagram proof**

Criar peça 1080×1350 baseada em título forte, label, grid/nós e fotografia ou bloco editorial.

- [ ] **Step 3: Produce LinkedIn proof**

Criar aplicação mais analítica e profissional, com menor carga gráfica.

- [ ] **Step 4: Produce proposal proof**

Criar capa de proposta comercial com logo principal, assinatura e sistema gráfico sóbrio.

- [ ] **Step 5: Produce project/product proof**

Aplicar `frame-project.svg` a screenshot/mockup para validar a linguagem de portfólio.

- [ ] **Step 6: Review all four against checklist**

Nenhuma aplicação avança se exigir cor, tipografia ou grafismo fora do sistema para “funcionar”.

- [ ] **Step 7: Commit**

```bash
git add docs/brand/previews docs/brand/checklist-validacao.md
git commit -m "design: validate brand across key applications"
```

---

### Task 6: Manual de Identidade Visual

**Files:**
- Create: `docs/brand/manual-identidade-visual.md`
- Modify: `__tests__/brandAssets.test.ts` if manual references require asset integrity checks.

**Interfaces:**
- Consumes: sistema final validado nas Tasks 1–5.
- Produces: documentação canônica da identidade.

- [ ] **Step 1: Draft manual structure**

Cobrir no mínimo:
- essência e posicionamento;
- conceito `Direção Inteligente`;
- personalidade `Comando Contemporâneo`;
- logotipo e versões;
- construção e redução;
- área de respiro;
- usos incorretos;
- paleta e hierarquia cromática;
- tipografia;
- sistema gráfico;
- fotografia;
- iconografia;
- aplicações;
- tom de voz;
- vocabulário prioritário;
- regras por canal;
- checklist de consistência.

- [ ] **Step 2: Add exact asset references**

Cada versão do logotipo e grafismo deve apontar para o arquivo oficial em `public/brand/`.

- [ ] **Step 3: Validate manual against the approved spec**

Confirmar que nenhuma decisão nova contradiz a especificação. Qualquer ajuste necessário deve ser identificado como refinamento, não alteração silenciosa.

- [ ] **Step 4: Run full automated suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add docs/brand/manual-identidade-visual.md __tests__/brandAssets.test.ts
git commit -m "docs: add Igor Matos visual identity manual"
```

---

### Task 7: Fechamento da fase e handoff para integração

**Files:**
- Modify: `TODO.md`
- Regenerate: `README.md` only through `npm run readme:gen` if required by repository contract.

**Interfaces:**
- Consumes: manual e ativos finais.
- Produces: repositório atualizado e uma próxima ação clara para integração posterior do site.

- [ ] **Step 1: Update TODO.md**

Registrar:
- IDV consolidada como concluída;
- eventuais pendências encontradas;
- próxima ação recomendada: abrir uma fase separada de integração da IDV ao site.
- data da atualização.

- [ ] **Step 2: Run README generator after TODO change**

Run: `npm run readme:gen`

Expected: comando concluído sem erro; revisar diff do README e manter apenas alterações geradas pelo fluxo existente.

- [ ] **Step 3: Run repository verification**

Run:
```bash
npm test
npm run build
```

Expected: ambos PASS.

- [ ] **Step 4: Confirm no production UI files changed**

Verificar diff e confirmar ausência de alterações em:
- `pages/Home.tsx`
- `components/Layout.tsx`
- `index.html`
- `public/base.css`
- `public/custom-animations.css`

- [ ] **Step 5: Commit**

```bash
git add TODO.md README.md
git commit -m "docs: close visual identity design phase"
```

---

## Self-Review

### Spec coverage

Coberto no plano:
- posicionamento e conceito;
- personalidade visual;
- paleta;
- tipografia;
- evolução do símbolo;
- arquitetura completa de logo;
- redução/monocromia;
- sistema gráfico;
- fotografia via aplicações de prova;
- tom de voz e vocabulário no manual;
- aplicações-chave;
- manual final;
- critérios de sucesso.

Deliberadamente fora desta execução:
- alteração do site;
- redesign do portfólio;
- banco de dados;
- campanhas;
- produção impressa final;
- registro de marca.

Esses itens já estão fora do escopo da especificação e a integração do site deve receber plano próprio depois que a identidade estiver consolidada.

### Type/interface consistency

`brand-tokens.json` é a fonte canônica consumida por todos os ativos; o logo selecionado na Task 2 é pré-requisito da Task 3; os grafismos da Task 4 derivam da geometria final; as aplicações da Task 5 validam o sistema antes do manual; o manual referencia apenas ativos finalizados.

### Proportion

O plano detalha decisões e gates, mas não pré-desenha o símbolo nem escreve os SVGs. A geometria final continua sendo resultado da exploração visual e da escolha humana obrigatória na Task 2.
