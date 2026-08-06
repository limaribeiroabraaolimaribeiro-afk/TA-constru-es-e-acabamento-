import { describe, it, expect } from 'vitest';
import { formatCurrencyDisplay, parseCurrencyInputToNumber } from './currency';

describe('currency utils', () => {
  it('converte dígitos digitados em número de reais (últimos 2 dígitos = centavos)', () => {
    expect(parseCurrencyInputToNumber('150000')).toBe(1500);
    expect(parseCurrencyInputToNumber('R$ 1.500,00')).toBe(1500);
    expect(parseCurrencyInputToNumber('')).toBe(0);
  });

  it('formata um número como moeda brasileira', () => {
    const formatted = formatCurrencyDisplay(1500);
    expect(formatted).toContain('R$');
    expect(formatted).toContain('1.500,00');
  });
});
