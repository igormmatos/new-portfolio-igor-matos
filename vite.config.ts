import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',

    rollupOptions: {
      // Externaliza APENAS as dependências do CDN
      external: (id) => {
        const externals = [
          'react',
          'react-dom',
          'react-dom/client',
          'react-router-dom',
          '@supabase/supabase-js',
          '@hello-pangea/dnd'
        ];

        // Externaliza apenas se for exatamente uma das dependências
        // NÃO externaliza arquivos do projeto (src/*)
        return externals.includes(id);
      },

      output: {
        format: 'es',
        // Preserva os imports das dependências externas
        paths: (id) => {
          const pathMap: Record<string, string> = {
            'react': 'react',
            'react-dom': 'react-dom',
            'react-dom/client': 'react-dom/client',
            'react-router-dom': 'react-router-dom',
            '@supabase/supabase-js': '@supabase/supabase-js',
            '@hello-pangea/dnd': '@hello-pangea/dnd'
          };
          return pathMap[id] || id;
        }
      }
    }
  }
})
