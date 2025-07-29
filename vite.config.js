import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.jsx',
      refresh: true,
    }),
    react(),
    AutoImport({
      imports: ['react'],
      dirs: [
        'resources/js/components/ui/**',
        'resources/js/components/magicui/**',
      ],
    }),
  ],
})
