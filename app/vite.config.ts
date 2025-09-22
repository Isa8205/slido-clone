import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      host: "slido.local", // browser origin (goes through Nginx)
      protocol: "wss",     // since Nginx is serving HTTPS
      port: 443            // but this is NOT Vite listening here
    },
    allowedHosts: [
      'slido.local',
      'localhost'
    ]
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})
