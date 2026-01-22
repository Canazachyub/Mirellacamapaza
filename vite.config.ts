import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://script.google.com/macros/s/AKfycbzKLcr0Ig6zpMBdplm5_zGidxzxy5fAEuC4l9teM2dTlYbbjVODh3GhhoOAEsG7vIpkfA/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})
