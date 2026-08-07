/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaManifest } from './src/pwa/manifest.ts'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages publica em https://<usuario>.github.io/<repositório>/ — o
  // base precisa bater com o nome do repositório para todos os assets
  // (JS, CSS, ícones, service worker) resolverem corretamente no subdiretório.
  base: '/TA-constru-es-e-acabamento-/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'prompt': o novo service worker fica esperando até o usuário tocar em
      // "Atualizar" (src/components/pwa/UpdatePrompt.tsx) — nunca atualiza
      // sozinho enquanto a pessoa está preenchendo um orçamento.
      registerType: 'prompt',
      includeAssets: ['favicon-32.png', 'favicon-48.png', 'apple-touch-icon.png', 'logo-ta.png'],
      manifest: pwaManifest,
      workbox: {
        // Inclui fontes (woff/woff2), imagens (logo/ícones) e os chunks de
        // html2canvas/jsPDF no precache, para a geração de PDF funcionar offline.
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg,ico}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
