import { create } from 'zustand';
import type { BudgetData } from '../types/budget';
import { COMPANY } from '../constants/company';
import { DEFAULT_DESCRIPTION_TYPE } from '../constants/descriptionTypes';
import { createId } from '../utils/id';
import { todayIso } from '../utils/date';
import type { BackupData } from '../utils/backup';
import {
  readDraft,
  writeDraft,
  readHistory,
  writeHistory,
  consumeNextBudgetNumber,
  peekNextBudgetNumber,
  writeNextBudgetNumber,
} from './budgetStorage';

function createEmptyBudget(budgetNumber: number): BudgetData {
  const now = new Date().toISOString();
  return {
    id: createId(),
    budgetNumber,
    clientName: '',
    clientPhone: '',
    workAddress: '',
    showClientData: false,
    descriptionType: DEFAULT_DESCRIPTION_TYPE,
    description: '',
    totalValue: 0,
    date: todayIso(),
    validity: COMPANY.defaultValidityDays,
    observation: '',
    createdAt: now,
    updatedAt: now,
  };
}

/** Carrega o rascunho salvo ou inicia um novo, consumindo um número sequencial. */
function loadInitialDraft(): BudgetData {
  const existing = readDraft();
  if (existing) return existing;
  const draft = createEmptyBudget(consumeNextBudgetNumber());
  writeDraft(draft);
  return draft;
}

interface BudgetStore {
  draft: BudgetData;
  history: BudgetData[];

  /** Inicia um orçamento novo em branco, com um número sequencial novo. */
  createNewBudget: () => BudgetData;
  /** Atualiza campos do rascunho atual (usado pelo formulário a cada alteração). */
  updateDraft: (partial: Partial<BudgetData>) => void;
  /** Limpa o rascunho atual sem consumir um novo número sequencial. */
  clearDraft: () => void;
  /** Salva (cria ou atualiza) o rascunho atual no histórico de orçamentos. */
  saveBudget: () => BudgetData;
  /** Carrega um orçamento salvo do histórico para o rascunho, para edição. */
  loadBudget: (id: string) => BudgetData | undefined;
  /** Cria uma cópia de um orçamento salvo, com novo id e novo número sequencial. */
  duplicateBudget: (id: string) => BudgetData | undefined;
  /** Remove um orçamento do histórico. Não libera o número sequencial usado. */
  deleteBudget: (id: string) => void;
  /** Retorna o próximo número sequencial disponível, já reservando-o. */
  getNextBudgetNumber: () => number;
  /** Monta os dados atuais (rascunho, histórico, contador) para exportar como backup. */
  exportBackupData: () => { draft: BudgetData; history: BudgetData[]; nextBudgetNumber: number };
  /** Substitui rascunho, histórico e contador pelos dados de um backup já validado. */
  restoreFromBackup: (backup: BackupData) => void;
}

export const useBudgetStore = create<BudgetStore>((set, get) => ({
  draft: loadInitialDraft(),
  history: readHistory(),

  createNewBudget: () => {
    const draft = createEmptyBudget(consumeNextBudgetNumber());
    writeDraft(draft);
    set({ draft });
    return draft;
  },

  updateDraft: (partial) => {
    const draft = { ...get().draft, ...partial, updatedAt: new Date().toISOString() };
    writeDraft(draft);
    set({ draft });
  },

  clearDraft: () => {
    const draft = createEmptyBudget(0);
    writeDraft(draft);
    set({ draft });
  },

  saveBudget: () => {
    const saved = { ...get().draft, updatedAt: new Date().toISOString() };
    const history = get().history;
    const existingIndex = history.findIndex((budget) => budget.id === saved.id);
    const nextHistory =
      existingIndex >= 0
        ? history.map((budget, index) => (index === existingIndex ? saved : budget))
        : [...history, saved];
    writeHistory(nextHistory);
    writeDraft(saved);
    set({ history: nextHistory, draft: saved });
    return saved;
  },

  loadBudget: (id) => {
    const found = get().history.find((budget) => budget.id === id);
    if (!found) return undefined;
    writeDraft(found);
    set({ draft: found });
    return found;
  },

  duplicateBudget: (id) => {
    const source = get().history.find((budget) => budget.id === id);
    if (!source) return undefined;
    const now = new Date().toISOString();
    const copy: BudgetData = {
      ...source,
      id: createId(),
      budgetNumber: consumeNextBudgetNumber(),
      createdAt: now,
      updatedAt: now,
    };
    writeDraft(copy);
    set({ draft: copy });
    return copy;
  },

  deleteBudget: (id) => {
    const history = get().history.filter((budget) => budget.id !== id);
    writeHistory(history);
    set({ history });
  },

  getNextBudgetNumber: () => consumeNextBudgetNumber(),

  exportBackupData: () => ({
    draft: get().draft,
    history: get().history,
    nextBudgetNumber: peekNextBudgetNumber(),
  }),

  restoreFromBackup: (backup) => {
    writeDraft(backup.draft);
    writeHistory(backup.history);
    writeNextBudgetNumber(backup.nextBudgetNumber);
    set({ draft: backup.draft, history: backup.history });
  },
}));
