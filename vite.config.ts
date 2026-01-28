import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  publicDir: '.', // Garante que arquivos na raiz (como load-importmap.js) sejam servidos
  build: {
    rollupOptions: {
      // Externaliza as dependências para usar o Import Map carregado via script
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@supabase/supabase-js',
        '@hello-pangea/dnd'
      ],
      output: {
        format: 'es',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router-dom': 'ReactRouterDOM',
          '@supabase/supabase-js': 'supabase',
          '@hello-pangea/dnd': 'HelloPangeaDnd'
        }
      }
    }
  }
})