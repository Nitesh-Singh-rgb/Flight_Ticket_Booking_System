import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Deploy to root
  server: {
    port: 3001 // Different from CRA's 3000
  }
})
