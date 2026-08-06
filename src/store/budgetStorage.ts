import type { BudgetData } from '../types/budget';

/**
 * Persistência em localStorage com chaves separadas por natureza do dado —
 * rascunho atual, histórico de orçamentos salvos e contador sequencial —
 * em vez de um único blob de estado. Isso permite evoluir/limpar cada
 * parte de forma independente (ex.: limpar o rascunho sem afetar o histórico).
 */
const DRAFT_KEY = 'ta-budget-draft';
const HISTORY_KEY = 'ta-budget-history';
const NEXT_NUMBER_KEY = 'ta-budget-next-number';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readDraft(): BudgetData | null {
  return safeParse<BudgetData | null>(localStorage.getItem(DRAFT_KEY), null);
}

export function writeDraft(draft: BudgetData): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function readHistory(): BudgetData[] {
  return safeParse<BudgetData[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function writeHistory(history: BudgetData[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function peekNextBudgetNumber(): number {
  const raw = localStorage.getItem(NEXT_NUMBER_KEY);
  return raw ? Number(raw) : 1;
}

/**
 * Retorna o próximo número sequencial e já persiste o incremento.
 * O contador nunca é decrementado (nem mesmo ao excluir um orçamento),
 * garantindo que um número usado uma vez nunca seja reaproveitado.
 */
export function consumeNextBudgetNumber(): number {
  const current = peekNextBudgetNumber();
  localStorage.setItem(NEXT_NUMBER_KEY, String(current + 1));
  return current;
}
