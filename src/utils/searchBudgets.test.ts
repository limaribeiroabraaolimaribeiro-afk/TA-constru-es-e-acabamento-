import { describe, it, expect } from 'vitest';
import { searchAndSortBudgets } from './searchBudgets';
import type { BudgetData } from '../types/budget';

function makeBudget(overrides: Partial<BudgetData> = {}): BudgetData {
  const now = new Date().toISOString();
  return {
    id: overrides.id ?? crypto.randomUUID(),
    budgetNumber: 1,
    clientName: '',
    clientPhone: '',
    workAddress: '',
    showClientData: false,
    descriptionType: 'labor_material',
    description: '',
    totalValue: 0,
    date: '2026-08-06',
    validity: 7,
    observation: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('searchAndSortBudgets', () => {
  const maria = makeBudget({
    id: 'a',
    budgetNumber: 1,
    clientName: 'Maria Souza',
    updatedAt: '2026-08-01T10:00:00.000Z',
  });
  const joao = makeBudget({
    id: 'b',
    budgetNumber: 12,
    clientName: 'João Pereira',
    updatedAt: '2026-08-05T10:00:00.000Z',
  });
  const ana = makeBudget({
    id: 'c',
    budgetNumber: 3,
    clientName: 'Ana Maria Costa',
    updatedAt: '2026-08-03T10:00:00.000Z',
  });
  const history = [maria, joao, ana];

  it('busca por parte do nome do cliente, sem diferenciar maiúsculas/minúsculas', () => {
    const result = searchAndSortBudgets(history, 'maria');
    expect(result.map((b) => b.id).sort()).toEqual(['a', 'c']);

    const upper = searchAndSortBudgets(history, 'MARIA');
    expect(upper.map((b) => b.id).sort()).toEqual(['a', 'c']);
  });

  it('busca pelo número do orçamento (formatado ou não)', () => {
    expect(searchAndSortBudgets(history, '0012').map((b) => b.id)).toEqual(['b']);
    expect(searchAndSortBudgets(history, '12').map((b) => b.id)).toEqual(['b']);
  });

  it('ordena do mais recentemente editado para o mais antigo', () => {
    const result = searchAndSortBudgets(history, '');
    expect(result.map((b) => b.id)).toEqual(['b', 'c', 'a']);
  });

  it('retorna lista vazia quando nada corresponde à busca', () => {
    expect(searchAndSortBudgets(history, 'inexistente')).toEqual([]);
  });

  it('não modifica o array original', () => {
    const original = [...history];
    searchAndSortBudgets(history, '');
    expect(history).toEqual(original);
  });
});
