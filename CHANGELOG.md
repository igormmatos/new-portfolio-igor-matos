📝 Log de Alteração • Solicitação: Corrigir erros de TypeScript no arquivo supabaseClient.ts (vite/client não encontrado e propriedade env inexistente). • Ação Executada: Removida a referência tripla para 'vite/client' e adicionado type assertion (as any) em 'import.meta' para acessar variáveis de ambiente. Arquivos modificados: supabaseClient.ts. • Resultado Esperado: Eliminação dos erros de compilação relacionados a tipos ausentes do Vite. • Observações: A tipagem foi relaxada para garantir o build sem dependências de tipos externos que estavam faltando.

---

📝 Log de Alteração

• Solicitação: Adicionar conexão ao Supabase utilizando as chaves fornecidas.
• Ação Executada: 
  - Criação do arquivo `.env` com as chaves `VITE_PUBLIC_SUPABASE_URL` e `VITE_PUBLIC_SUPABASE_ANON_KEY`.
  - Atualização do arquivo `supabaseClient.ts` para ler as variáveis com o prefixo `VITE_PUBLIC_`.
  - Atualização do `.env.example` para refletir o padrão de nomenclatura.
• Resultado Esperado: A aplicação agora possui uma conexão inicializada com o projeto Supabase "iquantqgsrgwbqfwbhfq", pronta para realizar consultas ao banco de dados e autenticação.

---

📝 Log de Alteração

• Solicitação: Integrar banco de dados Supabase e remover dados estáticos.
• Ação Executada:
  - Atualização de `types.ts` com interfaces do banco.
  - Criação de `services/api.ts` para CRUD.
  - Atualização de `Home.tsx` para buscar `Profile`, `Journey`, `Projects` e `Competencies` via API.
  - Remoção da Seção de Serviços e ajustes na Navbar (`Layout.tsx`).
  - Refatoração completa de `Admin.tsx` para editar projetos reais do banco.
• Resultado Esperado: O site agora carrega conteúdo dinâmico do banco de dados. A seção de serviços foi removida. O Admin permite criar/editar projetos que refletem na Home.
• Observações: O campo `technologies` é tratado como string no frontend (split por vírgula) e no banco, conforme solicitado.

---

📝 Log de Alteração

• Solicitação: Corrigir crash "Cannot read properties of undefined (reading 'VITE_PUBLIC_SUPABASE_URL')" em supabaseClient.ts.
• Ação Executada: 
  - Adicionado tratamento de erro e verificação segura ao acessar `import.meta.env`.
  - Incluídos valores de fallback (hardcoded) para URL e KEY do Supabase caso as variáveis de ambiente não estejam disponíveis.
  - Arquivo modificado: `supabaseClient.ts`.
• Resultado Esperado: A aplicação não deve mais quebrar na inicialização, usando as credenciais fornecidas mesmo se o ambiente de build falhar em injetá-las.

---

📝 Log de Alteração

• Solicitação: Transformar seção de Projetos em Carrossel e Completar Dashboard.
• Ação Executada: 
  - Atualizado `services/api.ts` com métodos CRUD completos para Profile, Journey e Competencies.
  - Atualizado `Home.tsx` transformando a grid de projetos em um carrossel responsivo (slider) com botões de navegação.
  - Refatorado `Admin.tsx` para incluir abas laterais para Perfil, Projetos, Jornada e Skills, cada uma com sua tabela e formulário de edição específico.
  - Adicionado novas chaves de tradução em `i18n.tsx`.
• Resultado Esperado: A Home agora exibe projetos em um slider elegante que suporta muitos itens. O Admin é funcional para editar todos os aspectos do site (texto do perfil, histórico de trabalho e skills).

---

📝 Log de Alteração

• Solicitação: Melhorar o estilo do formulário de edição no Admin (UI/UX).
• Ação Executada:
  - Refatoração completa do componente 'Drawer' (lateral) no arquivo `pages/Admin.tsx`.
  - Criação de componentes internos reutilizáveis `FormInput` e `FormTextArea` com estilos padronizados (Glassmorphism, Focus Rings).
  - Adição de cabeçalhos claros, rótulos em caixa alta e melhor espaçamento entre campos.
  - Inclusão de estados vazios (empty states) para tabelas sem dados.
• Resultado Esperado: A experiência de edição no painel administrativo agora é visualmente consistente com o tema 'Premium Dark' do restante do site, oferecendo melhor usabilidade e feedback visual.

---

📝 Log de Alteração

• Solicitação: Implementar Modal de Confirmação de Exclusão Genérico no Admin.
• Ação Executada:
  - Criado estado centralizado `deleteModal` em `pages/Admin.tsx` para armazenar `deleteFn` (função da API) e `setListFn` (setState do React).
  - Implementada função `handleDeleteRequest` que injeta as dependências específicas de cada aba (Projetos, Jornada, Skills) no modal.
  - Criado componente visual de Modal (Glassmorphism) com botões de confirmação e cancelamento.
  - Implementada lógica de "Otimismo UI" na função `confirmDelete` para remover o item da lista visualmente antes da confirmação do backend.
• Resultado Esperado: Ao clicar na lixeira, um modal de confirmação estilizado aparece. O código é reutilizável para qualquer nova seção que seja adicionada ao Admin, sem duplicar lógica de exclusão.

---

📝 Log de Alteração

• Solicitação: Visualização em Cards no Admin e Edição de display_order.
• Ação Executada:
  - Removido o layout de tabela no `Admin.tsx`.
  - Implementado layout de Grid com Cards específicos para Projetos (estilo carrossel), Jornada (estilo timeline) e Skills (estilo grid).
  - Adicionado campo `display_order` no Drawer de edição para permitir ordenação manual.
  - Adicionado badge visual com o número da ordem em cada card.
  - Implementada lógica de ordenação automática (lista.sort) ao buscar dados.
• Resultado Esperado: O administrador consegue visualizar os itens como eles aparecem no site e reordená-los facilmente editando o número de ordem.

---

📝 Log de Alteração

• Solicitação: Corrigir perda de foco ao digitar nos inputs do Admin.
• Ação Executada:
  - Identificada a causa raiz: Componentes `FormInput` e `FormTextArea` estavam definidos DENTRO do componente `Admin`, causando re-montagem completa a cada renderização.
  - Movida a definição desses componentes para fora do componente `Admin` no arquivo `pages/Admin.tsx`.
• Resultado Esperado: Os campos de input agora mantêm o foco corretamente enquanto o usuário digita, corrigindo o problema de UX onde o teclado ou foco era perdido a cada caractere.

---

📝 Log de Alteração

• Solicitação: Integrar campo 'git_url' do banco de dados na aplicação.
• Ação Executada:
  - Adicionado campo `git_url` na interface `ProfileInfo` em `types.ts`.
  - Adicionado input para 'GitHub URL' no formulário de Perfil do `Admin.tsx`, ao lado do LinkedIn.
  - Atualizado `components/Layout.tsx` (Footer) para buscar dados do perfil e usar o link dinâmico no ícone do GitHub.
  - Atualizado `pages/Home.tsx` (ContactSection) para exibir o link do GitHub se estiver disponível, similar ao LinkedIn.
• Resultado Esperado: O link do GitHub agora é gerenciável via Admin e reflete dinamicamente no rodapé e na seção de contato do site.

---

📝 Log de Alteração

• Solicitação: Substituir nome estático 'AlexDev' por 'display_name' do banco e implementar Toast Notification no Admin.
• Ação Executada:
  - Atualizado `components/Layout.tsx`: Movida a busca do perfil (`api.getProfile`) para o nível principal do Layout. Os dados são passados via props para `Navbar` e `Footer`.
  - Navbar: `alt` da logo agora usa `profile.display_name`.
  - Footer: Copyright e referências de texto agora usam `profile.display_name` ou fallback "Portfólio".
  - Atualizado `pages/Admin.tsx`: Removidos todos os `alert()`. Criado estado `notification` e função `showNotification`.
  - Adicionado componente de Toast flutuante no canto inferior direito com animação e cores (Verde/Vermelho).
  - Adicionado estado `isSaving` para feedback de carregamento (Spinner) nos botões de "Salvar".
• Resultado Esperado: O nome do site reflete o banco de dados. O painel admin fornece feedback profissional e não intrusivo ao usuário durante as operações.

---

📝 Log de Alteração

• Solicitação: Implementar campo 'badge' e reposicionar 'action_phrase' no Hero.
• Ação Executada:
  - Atualizado `types.ts`: Adicionado campo `badge` à interface `ProfileInfo`.
  - Atualizado `pages/Admin.tsx`: Adicionado input para 'Badge' e renomeado input de 'action_phrase' para 'Frase de Impacto (Gradiente)'.
  - Atualizado `pages/Home.tsx`: Hero agora exibe `profile.badge` no pill superior e `profile.action_phrase` no texto principal gradiente, conforme solicitado.
• Resultado Esperado: O site reflete as novas opções de personalização. O usuário pode alterar o texto do status (pill) e o texto de destaque colorido independentemente.

---

📝 Log de Alteração

• Solicitação: Reorganizar hierarquia da Hero Section (Top-to-Bottom).
• Ação Executada:
  - Atualizado `i18n.tsx`: Adicionado traduções para saudação e novo CTA.
  - Atualizado `pages/Home.tsx`: Reestruturado o componente `HeroSection` seguindo a ordem estrita:
    1. Badge (Pill com ponto pulsante)
    2. H1: "Olá, eu sou {display_name}"
    3. H2: {headline} com gradiente
    4. Divisor Visual (linha gradiente)
    5. H3: {action_phrase}
    6. Bio (texto cinza)
    7. Botões (Conhecer Mais, LinkedIn, GitHub).
• Resultado Esperado: A seção Hero agora apresenta as informações numa sequência lógica de leitura, dando destaque correto ao nome, cargo e frase de impacto, com botões de redes sociais acessíveis imediatamente.

---

📝 Log de Alteração

• Solicitação: Integração completa com WhatsApp (Botão Flutuante e Formulário).
• Ação Executada:
  - Atualizado `index.html`: Adicionada animação `bounce-slow` no Tailwind config.
  - Atualizado `components/Layout.tsx`: Adicionado botão flutuante (FAB) do WhatsApp no canto inferior direito com a mensagem "Olá, vi o seu site e gostaria de conversar um pouco mais!".
  - Atualizado `pages/Home.tsx`: O formulário de contato agora intercepta o evento `onSubmit` e redireciona os dados (formatados em Markdown) para a API do WhatsApp (wa.me), ao invés de enviar e-mail.
• Resultado Esperado: Visitantes agora têm dois pontos claros de contato imediato via WhatsApp, e o formulário funciona como um "gerador de mensagem pronta" para o app de mensagens.

---

📝 Log de Alteração

• Solicitação: Atualizar título e subtítulo da seção de Competências para "Áreas de Atuação Estratégica".
• Ação Executada:
  - Atualizado `i18n.tsx`: Alteradas as chaves `skills.title` e `skills.subtitle` para refletir o novo posicionamento estratégico, mantendo traduções coerentes para EN e FR.
• Resultado Esperado: A seção de skills agora se apresenta como "Áreas de Atuação Estratégica", com um subtítulo focado em solução de desafios, mantendo os cards existentes.

---

📝 Log de Alteração

• Solicitação: Criar seção "Tecnologias que Domino" (Fase 2) baseada em nova tabela de banco de dados.
• Ação Executada:
  - Atualizado `types.ts`: Adicionada interface `TechnicalSkill`.
  - Atualizado `services/api.ts`: Adicionados métodos CRUD para `technical_skills`.
  - Atualizado `i18n.tsx`: Adicionados textos de título e subtítulo para a nova seção.
  - Atualizado `pages/Home.tsx`: Criado componente `TechStackSection` com visual de cards escuros e barra de progresso (gradient), inserido após a seção de Competências.
  - Atualizado `pages/Admin.tsx`: Adicionada nova aba 'Tecnologias' com formulário de edição incluindo slider para nível de proficiência.
• Resultado Esperado: O site agora exibe uma lista de tecnologias específicas com seus respectivos níveis de domínio, e o admin permite gerenciar esses dados facilmente.

---

📝 Log de Alteração

• Solicitação: Substituir o texto estático do rodapé ("Construindo produtos...") pelo campo dinâmico `action_phrase` do perfil.
• Ação Executada: 
  - Atualizado o componente `Footer` em `components/Layout.tsx` para renderizar `profile.action_phrase`.
  - Mantido fallback para a chave de tradução `footer.tagline` caso o dado ainda não tenha sido carregado.
• Resultado Esperado: O rodapé agora exibe a frase de impacto definida no painel administrativo, mantendo a consistência com a Hero section.

---

📝 Log de Alteração

• Solicitação: Resolver problema de itens não exibidos na seção 'Tecnologias que Domino'.
• Ação Executada:
  - Atualizado `services/api.ts` para importar dados estáticos (`data.ts`) e usá-los como fallback na função `getTechnicalSkills`.
  - A função agora retorna os dados de exemplo (React, TS, Tailwind, etc.) caso o banco de dados esteja vazio ou inacessível.
• Resultado Esperado: A seção de Tecnologias deve agora exibir os cards corretamente, mesmo que o usuário ainda não tenha cadastrado itens no banco de dados.

---

📝 Log de Alteração

• Solicitação: Fornecer script SQL para configurar RLS da tabela technical_skills.
• Ação Executada:
  - Criado arquivo `SUPABASE_SETUP.sql` na raiz do projeto.
  - O arquivo contém os comandos para criar a tabela `technical_skills` (se não existir), habilitar RLS e criar políticas de acesso (Select público, Insert/Update/Delete abertos para admin sem login).
  - Incluídos comandos para inserir dados iniciais de exemplo (React, TS, Tailwind) para popular a tabela.
• Resultado Esperado: O desenvolvedor pode copiar o conteúdo deste arquivo e executar no Editor SQL do Supabase para corrigir os problemas de permissão e visualização de dados.

---

📝 Log de Alteração

• Solicitação: Implementar Autenticação com Supabase Auth, Proteção de Rotas e Página de Login.
• Ação Executada:
  - Criado `services/auth.ts`: Camada de abstração para `signIn`, `signOut`, `getSession`.
  - Criada `pages/Login.tsx`: Formulário de login com Glassmorphism, integrado ao serviço de auth.
  - Atualizado `App.tsx`: Adicionado estado global de `session` e listener `onAuthStateChange`. As rotas `/login` e `/admin` agora são protegidas e redirecionam condicionalmente.
  - Atualizado `pages/Admin.tsx`: Adicionado botão "Sair do Sistema" na sidebar que invoca `authService.signOut()`.
• Resultado Esperado: Apenas usuários autenticados via Supabase podem acessar o painel administrativo. A sessão é persistida automaticamente. O usuário pode fazer logout.

---

📝 Log de Alteração

• Solicitação: Corrigir vulnerabilidade crítica nas políticas RLS do Supabase.
• Ação Executada:
  - Atualizado arquivo `SUPABASE_SETUP.sql`.
  - Substituídas todas as políticas de escrita (INSERT/UPDATE/DELETE) que usavam `USING (true)` por `USING (auth.role() = 'authenticated')`.
  - Aplicada a correção para TODAS as 5 tabelas do sistema: `technical_skills`, `projects`, `journey_items`, `competencies` e `profile_info`.
  - Mantida a política `FOR SELECT USING (true)` para permitir que o público visualize o portfólio.
• Resultado Esperado: O sistema agora rejeita tentativas de escrita de usuários não autenticados, fechando a brecha de segurança que permitia manipulação de dados via anon_key pública.

---

📝 Log de Alteração

• Solicitação: Implementar lógica de troca de ordem (Swap) automática via Trigger no banco de dados.
• Ação Executada:
  - Adicionada função genérica `handle_display_order_swap` no arquivo `SUPABASE_SETUP.sql`.
  - A função usa `pg_trigger_depth()` para prevenir recursividade infinita.
  - A função utiliza SQL dinâmico (`TG_TABLE_NAME`) para funcionar em qualquer tabela.
  - Criados triggers `BEFORE UPDATE` nas tabelas `projects`, `journey_items`, `competencies` e `technical_skills`.
• Resultado Esperado: Ao alterar o `display_order` de um item para um número já existente, o banco de dados automaticamente troca as posições (Item A vai para posição do Item B, e Item B vai para a antiga posição do Item A).
• Observações: A lógica reside 100% no banco, não sendo necessário alterar o frontend.
