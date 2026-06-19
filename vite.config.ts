import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { apiDevPlugin } from './plugins/vite-api-dev'

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
})
