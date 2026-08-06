/** Formata o número sequencial do orçamento com 4 dígitos (ex.: 1 -> "0001"). */
export function formatBudgetNumber(budgetNumber: number): string {
  return String(Math.max(0, budgetNumber)).padStart(4, '0');
}
