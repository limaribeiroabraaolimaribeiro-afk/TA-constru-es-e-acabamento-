import { describe, it, expect, vi, afterEach } from 'vitest';
import { shareBudgetPdf, buildWhatsAppMessage } from './sharePdf';
import type { BudgetData } from '../../types/budget';

function makeBudget(overrides: Partial<BudgetData> = {}): BudgetData {
  const now = new Date().toISOString();
  return {
    id: 'id-1',
    budgetNumber: 1,
    clientName: 'Maria Souza',
    clientPhone: '',
    workAddress: '',
    showClientData: false,
    description: '',
    totalValue: 0,
    date: '2026-08-07',
    validity: 7,
    observation: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('buildWhatsAppMessage', () => {
  it('monta a mensagem no formato pedido', () => {
    expect(buildWhatsAppMessage({ budgetNumber: 1, clientName: 'Maria Souza' })).toBe(
      'Olá, Maria Souza. Segue o orçamento nº 0001 da TA Construções e Acabamento.',
    );
  });

  it('usa "cliente" quando o nome não foi informado', () => {
    expect(buildWhatsAppMessage({ budgetNumber: 2, clientName: '' })).toBe(
      'Olá, cliente. Segue o orçamento nº 0002 da TA Construções e Acabamento.',
    );
  });
});

describe('shareBudgetPdf', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    // @ts-expect-error -- remoção deliberada entre testes
    delete window.open;
  });

  it('usa a Web Share API quando disponível e navigator.canShare aceita arquivos', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    const canShareMock = vi.fn().mockReturnValue(true);
    vi.stubGlobal('navigator', { ...navigator, share: shareMock, canShare: canShareMock });
    const windowOpenMock = vi.fn();
    vi.stubGlobal('open', windowOpenMock);

    const budget = makeBudget();
    const result = await shareBudgetPdf(new Blob(['pdf']), 'orcamento.pdf', budget);

    expect(result).toBe('shared');
    expect(canShareMock).toHaveBeenCalled();
    expect(shareMock).toHaveBeenCalledTimes(1);
    const shareArgs = shareMock.mock.calls[0][0];
    expect(shareArgs.files).toHaveLength(1);
    expect(shareArgs.files[0].name).toBe('orcamento.pdf');
    expect(windowOpenMock).not.toHaveBeenCalled();
  });

  it('retorna "cancelled" sem cair no fallback quando o usuário cancela o compartilhamento nativo', async () => {
    const abortError = new DOMException('cancelled', 'AbortError');
    const shareMock = vi.fn().mockRejectedValue(abortError);
    vi.stubGlobal('navigator', { ...navigator, share: shareMock, canShare: () => true });
    const windowOpenMock = vi.fn();
    vi.stubGlobal('open', windowOpenMock);

    const result = await shareBudgetPdf(new Blob(['pdf']), 'orcamento.pdf', makeBudget());

    expect(result).toBe('cancelled');
    expect(windowOpenMock).not.toHaveBeenCalled();
  });

  it('faz fallback (baixa o PDF e abre o WhatsApp com mensagem) quando a Web Share API não está disponível', async () => {
    const navigatorWithoutShare = { ...navigator };
    // @ts-expect-error -- simula ambiente sem suporte a compartilhamento nativo
    delete navigatorWithoutShare.share;
    // @ts-expect-error -- idem
    delete navigatorWithoutShare.canShare;
    vi.stubGlobal('navigator', navigatorWithoutShare);
    const windowOpenMock = vi.fn();
    vi.stubGlobal('open', windowOpenMock);

    const budget = makeBudget({ budgetNumber: 5, clientName: 'João Pereira' });
    const result = await shareBudgetPdf(new Blob(['pdf']), 'orcamento.pdf', budget);

    expect(result).toBe('fallback');
    expect(windowOpenMock).toHaveBeenCalledTimes(1);
    const [url] = windowOpenMock.mock.calls[0];
    expect(url).toContain('https://wa.me/?text=');
    expect(decodeURIComponent(url)).toContain('João Pereira');
    expect(decodeURIComponent(url)).toContain('nº 0005');
  });

  it('faz fallback quando navigator.canShare rejeita arquivos', async () => {
    const shareMock = vi.fn();
    vi.stubGlobal('navigator', { ...navigator, share: shareMock, canShare: () => false });
    const windowOpenMock = vi.fn();
    vi.stubGlobal('open', windowOpenMock);

    const result = await shareBudgetPdf(new Blob(['pdf']), 'orcamento.pdf', makeBudget());

    expect(result).toBe('fallback');
    expect(shareMock).not.toHaveBeenCalled();
    expect(windowOpenMock).toHaveBeenCalledTimes(1);
  });
});
