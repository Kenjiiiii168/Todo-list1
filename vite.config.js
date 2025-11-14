import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    }
  },
  preview: {
    port: 3000,
    host: true,
    // Allow Render preview/hosted domain if using preview in prod
    allowedHosts: ['todo-list1-hxzj.onrender.com']
  }
})
