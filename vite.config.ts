import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { sheetsWebhookApi } from './vite.sheetsPlugin.ts'

export default defineConfig(({ mode }) => ({
  plugins: [react(), sheetsWebhookApi(mode, process.cwd())],
}))
