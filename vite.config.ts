import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',

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
        format: 'es'
      }
    }
  },

  optimizeDeps: {
    exclude: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@hello-pangea/dnd'
    ]
  }
})
