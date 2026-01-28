import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// Plugin customizado para injetar o importmap.json inline no HTML
const injectImportmap = () => {
  return {
    name: 'inject-importmap',
    transformIndexHtml(html: string) {
      try {
        const importMapContent = fs.readFileSync('./importmap.json', 'utf-8');
        // Substitui o placeholder pelo script inline
        return html.replace(
          '<!-- IMPORT MAP PLACEHOLDER -->',
          `<script type="importmap">${importMapContent}</script>`
        );
      } catch (error) {
        console.error('Erro ao injetar importmap:', error);
        return html;
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    injectImportmap()
  ],
  build: {
    rollupOptions: {
      // Externaliza as dependências para usar o Import Map
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