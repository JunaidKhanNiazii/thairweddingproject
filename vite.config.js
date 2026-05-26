import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/facepp-api': {
        target: 'https://api-us.faceplusplus.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/facepp-api/, '/facepp/v3'),
      }
    }
  }
})
