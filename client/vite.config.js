import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        // changeOrigin: true,
        // rewrite: (path) => {
        //   console.log('Proxy request: ', path)
        //   return path
        // }
      }
    }
  },
  plugins: [react()],
})