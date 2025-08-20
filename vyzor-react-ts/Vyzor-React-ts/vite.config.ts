import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '',
  build: {
    chunkSizeWarningLimit: 50000,
  },
  define: {
    global: 'window',
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
