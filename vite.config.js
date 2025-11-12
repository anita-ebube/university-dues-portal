import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Fix 404 errors on page reload for client-side routing
    historyApiFallback: true,
  },
  preview: {
    // Also apply to production preview
    historyApiFallback: true,
  }
})