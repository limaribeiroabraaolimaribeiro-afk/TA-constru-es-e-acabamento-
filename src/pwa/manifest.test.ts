import { describe, it, expect } from 'vitest';
import { pwaManifest } from './manifest';

describe('pwaManifest', () => {
  it('tem nome e short_name "TA Orçamentos"', () => {
    expect(pwaManifest.name).toBe('TA Orçamentos');
    expect(pwaManifest.short_name).toBe('TA Orçamentos');
  });

  it('roda em modo standalone (instalável, sem chrome do navegador)', () => {
    expect(pwaManifest.display).toBe('standalone');
  });

  it('define theme_color e background_color com as cores da marca', () => {
    expect(pwaManifest.theme_color).toBe('#141210');
    expect(pwaManifest.background_color).toBe('#f7f5f0');
  });

  it('inclui ícones 192x192, 512x512 e uma variante maskable', () => {
    const icons = pwaManifest.icons ?? [];
    expect(icons.some((icon) => icon.sizes === '192x192')).toBe(true);
    expect(icons.some((icon) => icon.sizes === '512x512' && icon.purpose !== 'maskable')).toBe(true);
    expect(icons.some((icon) => icon.purpose === 'maskable')).toBe(true);
    for (const icon of icons) {
      expect(icon.type).toBe('image/png');
    }
  });

  it('tem start_url e scope definidos para a raiz do app', () => {
    expect(pwaManifest.start_url).toBe('/');
    expect(pwaManifest.scope).toBe('/');
  });
});
