import { downloadBlob } from './downloadBlob';
import { formatBudgetNumber } from '../../utils/budgetNumber';
import type { BudgetData } from '../../types/budget';

/** Mensagem padrão de compartilhamento pelo WhatsApp. */
export function buildWhatsAppMessage(budget: Pick<BudgetData, 'budgetNumber' | 'clientName'>): string {
  const clientName = budget.clientName.trim() || 'cliente';
  return `Olá, ${clientName}. Segue o orçamento nº ${formatBudgetNumber(budget.budgetNumber)} da TA Construções e Acabamento.`;
}

/**
 * Abre o WhatsApp (app no celular, ou web) com a mensagem pronta, sem tentar
 * anexar o PDF via URL — a Web API do WhatsApp (wa.me) não suporta isso.
 *
 * Navega a própria aba (`location.href`), em vez de `window.open`/
 * `target="_blank"`: a geração do PDF antes deste ponto (html2canvas) leva
 * alguns segundos, e por essa altura o navegador já não considera o toque
 * original do usuário "recente" o suficiente para autorizar uma nova janela
 * — o Chrome no Android bloqueia como pop-up. Trocar a navegação da própria
 * aba não passa por essa checagem (não é uma nova janela/aba) e funciona
 * com um único toque. No Android, um link wa.me é interceptado pelo próprio
 * sistema para abrir o app do WhatsApp direto, sem tirar o usuário do PWA.
 */
export function openWhatsAppWithMessage(message: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

export type ShareResult = 'shared' | 'cancelled' | 'fallback';

function canUseNativeFileShare(file: File): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return true;
  return navigator.canShare({ files: [file] });
}

/**
 * Tenta compartilhar o PDF via Web Share API (abre o menu nativo do
 * aparelho, de onde o usuário escolhe o WhatsApp). Se o compartilhamento de
 * arquivo não for suportado, baixa o PDF e abre o WhatsApp com a mensagem
 * pronta (sem anexar automaticamente — não suportado via wa.me).
 */
export async function shareBudgetPdf(blob: Blob, fileName: string, budget: BudgetData): Promise<ShareResult> {
  const message = buildWhatsAppMessage(budget);
  const file = new File([blob], fileName, { type: 'application/pdf' });

  if (canUseNativeFileShare(file)) {
    try {
      await navigator.share({ files: [file], title: fileName, text: message });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      // Outros erros do compartilhamento nativo: cai no fallback abaixo.
    }
  }

  downloadBlob(blob, fileName);
  openWhatsAppWithMessage(message);
  return 'fallback';
}
