import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BudgetData, BudgetItem } from '../types/budget';
import { COMPANY } from '../constants/company';
import { createId } from '../utils/id';
import { todayIso } from '../utils/date';

const STORAGE_KEY = 'ta-orcamento-draft';

function createEmptyBudget(): BudgetData {
  const now = new Date().toISOString();
  return {
    id: createId(),
    clientName: '',
    items: [{ id: createId(), description: '' }],
    totalValue: '',
    date: todayIso(),
    observation: COMPANY.defaultObservation,
    createdAt: now,
    updatedAt: now,
  };
}

interface BudgetStore {
  budget: BudgetData;
  /** Substitui o orçamento inteiro (usado para sincronizar com o formulário). */
  setBudget: (budget: BudgetData) => void;
  /** Atualiza campos específicos sem perder o restante do estado. */
  updateBudget: (partial: Partial<BudgetData>) => void;
  addItem: () => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, description: string) => void;
  resetBudget: () => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set) => ({
      budget: createEmptyBudget(),

      setBudget: (budget) => set({ budget }),

      updateBudget: (partial) =>
        set((state) => ({
          budget: { ...state.budget, ...partial, updatedAt: new Date().toISOString() },
        })),

      addItem: () =>
        set((state) => ({
          budget: {
            ...state.budget,
            items: [...state.budget.items, { id: createId(), description: '' } satisfies BudgetItem],
            updatedAt: new Date().toISOString(),
          },
        })),

      removeItem: (itemId) =>
        set((state) => ({
          budget: {
            ...state.budget,
            items: state.budget.items.filter((item) => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateItem: (itemId, description) =>
        set((state) => ({
          budget: {
            ...state.budget,
            items: state.budget.items.map((item) =>
              item.id === itemId ? { ...item, description } : item,
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      resetBudget: () => set({ budget: createEmptyBudget() }),
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);
