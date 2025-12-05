import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

 

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.0.141:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
   plugins: [react()]
});
