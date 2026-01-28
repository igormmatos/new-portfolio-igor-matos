import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  publicDir: 'public', // ESTAVA '.' (raiz) - ERRADO!

  build: {
    outDir: 'dist', // Adicione isso
    emptyOutDir: true,

    rollupOptions: {
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
        // REMOVA 'globals' - não faz sentido com format: 'es'
      }
    }
  }
})
