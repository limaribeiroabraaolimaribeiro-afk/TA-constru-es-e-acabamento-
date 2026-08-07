import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('../pdf/regeneratePdfForBudget', () => ({
  regeneratePdfForBudget: vi.fn().mockResolvedValue({ blob: new Blob(['pdf']), fileName: 'orcamento-0001.pdf' }),
}));
vi.mock('../pdf/downloadBlob', () => ({
  downloadBlob: vi.fn(),
}));

// O store e a tela lêem/escrevem localStorage já na inicialização do módulo,
// então cada teste importa instâncias novas (vi.resetModules) sobre um
// localStorage limpo, garantindo que ambos compartilhem a mesma instância do store.
async function loadFresh() {
  const storeMod = await import('../../store/useBudgetStore');
  const { HistoryScreen } = await import('./HistoryScreen');
  return { useBudgetStore: storeMod.useBudgetStore, HistoryScreen };
}

describe('HistoryScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('mostra mensagem quando não há orçamentos salvos', async () => {
    const { HistoryScreen } = await loadFresh();
    render(<HistoryScreen onNavigate={() => {}} />);
    expect(screen.getByText(/Nenhum orçamento salvo/)).toBeTruthy();
  });

  it('lista orçamentos salvos com número, cliente, data e valor', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Maria Souza', totalValue: 1500 });
    useBudgetStore.getState().saveBudget();

    render(<HistoryScreen onNavigate={() => {}} />);
    expect(screen.getByText('Maria Souza')).toBeTruthy();
    expect(screen.getByText(/Nº 0001/)).toBeTruthy();
    expect(screen.getByText(/1\.500,00/)).toBeTruthy();
  });

  it('busca por parte do nome do cliente, sem diferenciar maiúsculas/minúsculas', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Maria Souza' });
    useBudgetStore.getState().saveBudget();
    useBudgetStore.getState().createNewBudget();
    useBudgetStore.getState().updateDraft({ clientName: 'João Pereira' });
    useBudgetStore.getState().saveBudget();

    render(<HistoryScreen onNavigate={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar por cliente/), { target: { value: 'MARIA' } });

    expect(screen.getByText('Maria Souza')).toBeTruthy();
    expect(screen.queryByText('João Pereira')).toBeNull();
  });

  it('busca pelo número do orçamento', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Um' });
    useBudgetStore.getState().saveBudget();
    useBudgetStore.getState().createNewBudget();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Dois' });
    useBudgetStore.getState().saveBudget();

    render(<HistoryScreen onNavigate={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Buscar por cliente/), { target: { value: '0002' } });

    expect(screen.getByText('Cliente Dois')).toBeTruthy();
    expect(screen.queryByText('Cliente Um')).toBeNull();
  });

  it('ordena do mais recentemente editado para o mais antigo', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();

    // Datas de sistema fixas para garantir updatedAt distintos e determinísticos.
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'));
      useBudgetStore.getState().updateDraft({ clientName: 'Primeiro Salvo' });
      useBudgetStore.getState().saveBudget();

      vi.setSystemTime(new Date('2026-01-01T10:05:00.000Z'));
      useBudgetStore.getState().createNewBudget();
      useBudgetStore.getState().updateDraft({ clientName: 'Segundo Salvo' });
      useBudgetStore.getState().saveBudget();
    } finally {
      vi.useRealTimers();
    }

    render(<HistoryScreen onNavigate={() => {}} />);
    const names = screen.getAllByText(/Salvo/).map((el) => el.textContent);
    expect(names).toEqual(['Segundo Salvo', 'Primeiro Salvo']);
  });

  it('duplicar cria um novo orçamento e navega para a edição', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Original' });
    useBudgetStore.getState().saveBudget();

    let navigatedTo: string | null = null;
    render(<HistoryScreen onNavigate={(view) => (navigatedTo = view)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Duplicar' }));

    expect(useBudgetStore.getState().history).toHaveLength(1);
    expect(useBudgetStore.getState().draft.clientName).toBe('Original');
    expect(useBudgetStore.getState().draft.budgetNumber).toBe(2);
    expect(navigatedTo).toBe('editar');
  });

  it('excluir pede confirmação antes de remover o orçamento', async () => {
    const { useBudgetStore, HistoryScreen } = await loadFresh();
    useBudgetStore.getState().updateDraft({ clientName: 'Cliente Removível' });
    const saved = useBudgetStore.getState().saveBudget();

    render(<HistoryScreen onNavigate={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: /Excluir/ }));
    expect(screen.getByText('Excluir este orçamento?')).toBeTruthy();
    // Ainda não foi removido só de clicar em "Excluir" pela primeira vez.
    expect(useBudgetStore.getState().history).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(useBudgetStore.getState().history).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: /Excluir/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

    expect(useBudgetStore.getState().history).toHaveLength(0);
    // O número usado pelo orçamento excluído não deve ser reaproveitado.
    const next = useBudgetStore.getState().createNewBudget();
    expect(next.budgetNumber).toBe(2);
    void saved;
  });
});
