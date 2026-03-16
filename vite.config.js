import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/setlistapi': {
        target: 'https://api.setlist.fm',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/setlistapi/, '/rest')
      }
    }
  }
})

// Running into a CORS policy issue 
