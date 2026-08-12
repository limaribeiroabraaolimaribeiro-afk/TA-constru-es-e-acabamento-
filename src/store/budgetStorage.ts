import type { BudgetData } from '../types/budget';
import { DEFAULT_DESCRIPTION_TYPE } from '../constants/descriptionTypes';

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

/** Forma real de um orçamento como pode estar salvo em localStorage/backup — de antes de `descriptionType` existir. */
export type StoredBudgetData = Omit<BudgetData, 'descriptionType'> & Partial<Pick<BudgetData, 'descriptionType'>>;

/**
 * Preenche campos adicionados depois que o orçamento já podia estar salvo —
 * hoje, só descriptionType. Sem isso, um orçamento salvo antes desse campo
 * existir chegaria com `descriptionType: undefined`, e o título impresso
 * cairia no fallback só "por acaso" (undefined) em vez de explicitamente.
 * Usado tanto na leitura do localStorage (abaixo) quanto na importação de
 * backup (utils/backup.ts) — os dois pontos onde dados antigos re-entram
 * no app — mantendo "não quebrar orçamentos antigos" num único lugar.
 */
export function normalizeBudget(budget: StoredBudgetData): BudgetData {
  return { descriptionType: DEFAULT_DESCRIPTION_TYPE, ...budget };
}

export function readDraft(): BudgetData | null {
  const draft = safeParse<StoredBudgetData | null>(localStorage.getItem(DRAFT_KEY), null);
  return draft ? normalizeBudget(draft) : null;
}

export function writeDraft(draft: BudgetData): void {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function readHistory(): BudgetData[] {
  return safeParse<StoredBudgetData[]>(localStorage.getItem(HISTORY_KEY), []).map(normalizeBudget);
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

/** Define o contador diretamente — usado apenas ao restaurar um backup completo. */
export function writeNextBudgetNumber(value: number): void {
  localStorage.setItem(NEXT_NUMBER_KEY, String(value));
}
