import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/pretty-toasts/redux/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
