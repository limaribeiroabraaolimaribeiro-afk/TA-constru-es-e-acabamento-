import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

async function loadFresh() {
  const storeMod = await import('../../store/useBudgetStore');
  const toastMod = await import('../../store/useToastStore');
  const { FormActions } = await import('./FormActions');
  return { useBudgetStore: storeMod.useBudgetStore, useToastStore: toastMod.useToastStore, FormActions };
}

describe('FormActions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it('"Salvar orçamento" grava o rascunho no histórico e mostra feedback de sucesso', async () => {
    const { useBudgetStore, useToastStore, FormActions } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Teste' });

    render(<FormActions />);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar orçamento' }));

    expect(useBudgetStore.getState().history).toHaveLength(1);
    expect(useBudgetStore.getState().history[0].clientName).toBe('Cliente Teste');
    expect(useToastStore.getState().message).toMatch(/salvo com sucesso/i);
    expect(useToastStore.getState().variant).toBe('success');
  });

  it('salvar duas vezes o mesmo rascunho atualiza o registro em vez de duplicar', async () => {
    const { useBudgetStore, FormActions } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Teste' });

    render(<FormActions />);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar orçamento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Salvar orçamento' }));

    expect(useBudgetStore.getState().history).toHaveLength(1);
  });

  it('"Novo orçamento" limpa os campos e mantém o histórico', async () => {
    const { useBudgetStore, FormActions } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Antigo' });
    useBudgetStore.getState().saveBudget();

    render(<FormActions />);
    fireEvent.click(screen.getByRole('button', { name: 'Novo orçamento' }));

    expect(useBudgetStore.getState().draft.clientName).toBe('');
    expect(useBudgetStore.getState().draft.budgetNumber).toBe(2);
    expect(useBudgetStore.getState().history).toHaveLength(1);
  });
});
