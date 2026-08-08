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
 * Compartilha o PDF do orçamento.
 *
 * Caminho principal: Web Share API de nível 2 (arquivo), exatamente como
 * pedido — `navigator.canShare({ files: [file] })` valida suporte, depois
 * `navigator.share({ files: [file], text })` abre a folha nativa de
 * compartilhamento do Android com o PDF anexado (o usuário escolhe
 * WhatsApp, e-mail, etc. de lá). NUNCA abrimos wa.me/api.whatsapp.com nesse
 * caminho — esses links só preenchem texto, não anexam arquivo, então só
 * são usados como último recurso no fallback abaixo.
 *
 * Sem window.open/target="_blank" em lugar nenhum deste fluxo (nem aqui,
 * nem no fallback — ver openWhatsAppWithMessage) — no Chrome/Android isso é
 * bloqueado como pop-up depois do delay da geração do PDF.
 *
 * Nota sobre "ativação transitória": tanto navigator.share() quanto
 * window.open() só funcionam enquanto o navegador ainda considera o toque
 * original "recente" (no Chrome, alguns segundos). Como a geração do PDF
 * (html2canvas) acontece ANTES desta função ser chamada e pode levar vários
 * segundos em aparelhos mais fracos, é possível — em tese, num aparelho
 * muito lento — que essa janela já tenha expirado quando chegamos aqui, e
 * navigator.share() rejeite com NotAllowedError mesmo com arquivo
 * suportado. É uma restrição da plataforma (nenhuma API de JS permite
 * "renovar" a ativação), não um bug deste código — por isso o catch abaixo
 * trata esse erro como qualquer outra falha do compartilhamento nativo e
 * cai no fallback, em vez de travar a UI.
 */
export async function shareBudgetPdf(blob: Blob, fileName: string, budget: BudgetData): Promise<ShareResult> {
  const message = buildWhatsAppMessage(budget);
  const file = new File([blob], fileName, { type: 'application/pdf' });

  if (canUseNativeFileShare(file)) {
    try {
      await navigator.share({ files: [file], text: message });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled';
      }
      console.warn('navigator.share falhou com arquivo, caindo no fallback (baixar + WhatsApp só com texto):', error);
    }
  }

  downloadBlob(blob, fileName);
  openWhatsAppWithMessage(message);
  return 'fallback';
}
