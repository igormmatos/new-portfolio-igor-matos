<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## Rodar localmente

### Pré-requisitos

- **Node.js** (recomendado: versão LTS)
- **npm** (vem junto com o Node)

### Passo a passo

1. **Instalar dependências**

```bash
npm install
```

2. **Configurar variáveis de ambiente (Supabase)**

O projeto usa Vite, então as variáveis precisam começar com `VITE_`.
Já existe um arquivo `.env` na raiz com:

- `VITE_PUBLIC_SUPABASE_URL`
- `VITE_PUBLIC_SUPABASE_ANON_KEY`

Se você trocar de projeto/instância do Supabase, atualize esses valores.

3. **Subir o servidor de desenvolvimento**

```bash
npm run dev
```

Depois, abra o endereço que o Vite mostrar no terminal (geralmente `http://localhost:5173`).


4. **ODJU - Outros Dados Julgados Úteis**

Aplicação React com suporte a múltiplos idiomas (pt-BR/en/fr), incluindo conteúdo dinâmico do banco, fallback inteligente e CRUD testado offline.
