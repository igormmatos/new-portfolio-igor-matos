# Changelog do Projeto

## 📝 Log de Alteração
**Solicitação:** Melhorar o visual da imagem na Hero Section, tornando-a mais equilibrada e bonita.

**Ação Executada:** Reestruturação completa do contêiner da imagem em `Home.tsx` adicionando camadas de fundo geométricas, gradiente de fade na parte inferior da imagem, e um badge flutuante "Experience" com animação customizada. Adição de keyframes `float` no `index.html`.

**Resultado Esperado:** A imagem agora se integra suavemente ao fundo escuro, possui profundidade visual com as camadas traseiras e apresenta dinamismo com o elemento flutuante, eliminando a sensação de "recorte quadrado".

---

## 📝 Log de Alteração
**Solicitação:** Preparar o projeto para subir para a Vercel.

**Ação Executada:** 
- Criação de `package.json`, `vite.config.ts`, `tsconfig.json` para configurar o build com Vite.
- Criação de `vercel.json` para gerenciamento de rotas SPA.
- Atualização do `index.html` para remover `importmap` e adicionar o entry point `<script type="module" src="/index.tsx">`.

**Resultado Esperado:** O projeto agora possui a estrutura padrão de uma aplicação React+Vite, pronta para ser detectada automaticamente pela Vercel ao importar o repositório git, permitindo deploy contínuo com build automático.