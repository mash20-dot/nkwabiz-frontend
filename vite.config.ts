import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5173,
    host: "0.0.0.0",
    allowedHosts: [
      "nkwabiz-frontend.onrender.com",
      "nkwabiz-frontend-1.onrender.com",
      "nkwabiz.com"
    ]
  }
})
