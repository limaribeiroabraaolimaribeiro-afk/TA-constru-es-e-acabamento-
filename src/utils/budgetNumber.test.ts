import { describe, it, expect } from 'vitest';
import { formatBudgetNumber } from './budgetNumber';

describe('formatBudgetNumber', () => {
  it('preenche com zeros à esquerda até 4 dígitos', () => {
    expect(formatBudgetNumber(1)).toBe('0001');
    expect(formatBudgetNumber(42)).toBe('0042');
    expect(formatBudgetNumber(1234)).toBe('1234');
  });

  it('não gera números negativos', () => {
    expect(formatBudgetNumber(-5)).toBe('0000');
  });

  it('mantém números com mais de 4 dígitos sem truncar', () => {
    expect(formatBudgetNumber(12345)).toBe('12345');
  });
});
