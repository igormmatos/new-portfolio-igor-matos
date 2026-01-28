import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Externaliza as dependências para que o Vite não tente empacotá-las.
      // O navegador resolverá esses imports usando o <script type="importmap"> no index.html.
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@supabase/supabase-js',
        '@hello-pangea/dnd'
      ],
      output: {
        // Formato ES Module para compatibilidade com navegadores modernos
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