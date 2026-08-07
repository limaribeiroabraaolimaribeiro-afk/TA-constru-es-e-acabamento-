import type { BudgetData } from '../types/budget';
import { formatBudgetNumber } from './budgetNumber';

// Faixa Unicode dos sinais diacríticos combinantes (U+0300-U+036F), isolados
// pelo normalize('NFD') abaixo — ex.: "á" vira "a" + acento combinante.
const DIACRITICS_REGEX = /[̀-ͯ]/g;

/** Remove acentos, caracteres inválidos para nome de arquivo, e troca espaços por hífen. */
export function normalizeForFileName(text: string): string {
  return text
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Ex.: "Orcamento-TA-0001-Maria-Souza.pdf" (sem nome de cliente: "Orcamento-TA-0001.pdf"). */
export function buildPdfFileName(budget: Pick<BudgetData, 'budgetNumber' | 'clientName'>): string {
  const number = formatBudgetNumber(budget.budgetNumber);
  const clientPart = budget.clientName.trim() ? normalizeForFileName(budget.clientName) : '';
  const parts = ['Orcamento-TA', number, clientPart].filter(Boolean);
  return `${parts.join('-')}.pdf`;
}
