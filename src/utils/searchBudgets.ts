import type { BudgetData } from '../types/budget';
import { formatBudgetNumber } from './budgetNumber';

/**
 * Filtra por nome do cliente (parcial, sem diferenciar maiúsculas/minúsculas)
 * ou por número do orçamento (formatado "0001" ou dígitos avulsos), e ordena
 * do mais recentemente editado para o mais antigo.
 */
export function searchAndSortBudgets(history: BudgetData[], query: string): BudgetData[] {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? history.filter((budget) => {
        const nameMatch = budget.clientName.toLowerCase().includes(normalizedQuery);
        const numberMatch =
          formatBudgetNumber(budget.budgetNumber).toLowerCase().includes(normalizedQuery) ||
          String(budget.budgetNumber).includes(normalizedQuery);
        return nameMatch || numberMatch;
      })
    : history;

  return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
