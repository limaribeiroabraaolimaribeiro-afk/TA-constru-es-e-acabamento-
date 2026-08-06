import { describe, it, expect, beforeEach, vi } from 'vitest';

// O store lê/escreve localStorage já na inicialização do módulo, então cada
// teste importa uma instância nova (vi.resetModules) sobre um localStorage limpo.
async function loadStore() {
  const mod = await import('./useBudgetStore');
  return mod.useBudgetStore;
}

describe('useBudgetStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('inicia com um rascunho vazio numerado a partir de 1', async () => {
    const useBudgetStore = await loadStore();
    const draft = useBudgetStore.getState().draft;

    expect(draft.budgetNumber).toBe(1);
    expect(draft.clientName).toBe('');
    expect(draft.showClientData).toBe(false);
    expect(draft.totalValue).toBe(0);
  });

  it('createNewBudget emite números sequenciais crescentes', async () => {
    const useBudgetStore = await loadStore();
    const second = useBudgetStore.getState().createNewBudget();
    const third = useBudgetStore.getState().createNewBudget();

    expect(second.budgetNumber).toBe(2);
    expect(third.budgetNumber).toBe(3);
  });

  it('getNextBudgetNumber reserva o número retornado', async () => {
    const useBudgetStore = await loadStore();
    const reserved = useBudgetStore.getState().getNextBudgetNumber();
    const nextDraft = useBudgetStore.getState().createNewBudget();

    expect(reserved).toBe(2);
    expect(nextDraft.budgetNumber).toBe(3);
  });

  it('persiste rascunho, histórico e contador em chaves separadas do localStorage', async () => {
    const useBudgetStore = await loadStore();
    useBudgetStore.getState().updateDraft({ clientName: 'Maria' });
    useBudgetStore.getState().saveBudget();

    expect(localStorage.getItem('ta-budget-draft')).toContain('Maria');
    expect(localStorage.getItem('ta-budget-history')).toContain('Maria');
    expect(localStorage.getItem('ta-budget-next-number')).toBe('2');
  });

  it('saveBudget insere no histórico e loadBudget restaura o rascunho', async () => {
    const useBudgetStore = await loadStore();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente A' });
    const saved = useBudgetStore.getState().saveBudget();

    useBudgetStore.getState().createNewBudget();
    expect(useBudgetStore.getState().draft.clientName).toBe('');

    const loaded = useBudgetStore.getState().loadBudget(saved.id);
    expect(loaded?.clientName).toBe('Cliente A');
    expect(useBudgetStore.getState().draft.id).toBe(saved.id);
  });

  it('duplicateBudget copia os dados com novo id e novo número sequencial', async () => {
    const useBudgetStore = await loadStore();
    useBudgetStore.getState().updateDraft({ clientName: 'Original' });
    const saved = useBudgetStore.getState().saveBudget();

    const duplicated = useBudgetStore.getState().duplicateBudget(saved.id);

    expect(duplicated).toBeDefined();
    expect(duplicated?.id).not.toBe(saved.id);
    expect(duplicated?.budgetNumber).toBe(2);
    expect(duplicated?.clientName).toBe('Original');
  });

  it('deleteBudget remove do histórico sem liberar o número sequencial usado', async () => {
    const useBudgetStore = await loadStore();
    const saved = useBudgetStore.getState().saveBudget();
    expect(useBudgetStore.getState().history).toHaveLength(1);

    useBudgetStore.getState().deleteBudget(saved.id);
    expect(useBudgetStore.getState().history).toHaveLength(0);

    // O próximo orçamento não deve reaproveitar o número do orçamento excluído.
    const next = useBudgetStore.getState().createNewBudget();
    expect(next.budgetNumber).toBe(2);
  });

  it('clearDraft limpa os campos sem consumir um novo número sequencial', async () => {
    const useBudgetStore = await loadStore();
    useBudgetStore.getState().updateDraft({ clientName: 'Temporário' });

    useBudgetStore.getState().clearDraft();

    expect(useBudgetStore.getState().draft.clientName).toBe('');
    expect(localStorage.getItem('ta-budget-next-number')).toBe('2');
  });
});
