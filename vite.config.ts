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
      // 'autoUpdate': assim que um novo service worker termina de instalar,
      // ele assume o controle sozinho (skipWaiting/clientsClaim, habilitados
      // automaticamente pelo plugin para este modo) e a página recarrega —
      // sem depender do usuário tocar em "Atualizar". Necessário para que
      // mudanças como SYSTEM_BLOCKED cheguem a aparelhos com uma versão
      // antiga em cache sem intervenção manual.
      registerType: 'autoUpdate',
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
