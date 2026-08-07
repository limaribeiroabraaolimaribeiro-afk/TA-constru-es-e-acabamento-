import type { ManifestOptions } from 'vite-plugin-pwa';

/**
 * Configuração do manifesto do PWA, isolada em módulo próprio para poder ser
 * testada diretamente (ver manifest.test.ts) sem depender do build do Vite.
 */
export const pwaManifest: Partial<ManifestOptions> = {
  name: 'TA Orçamentos',
  short_name: 'TA Orçamentos',
  description: 'Geração de orçamentos da TA Construções e Acabamento — funciona offline, direto do celular.',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: '#f7f5f0',
  theme_color: '#141210',
  lang: 'pt-BR',
  icons: [
    {
      src: 'pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: 'pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
};
