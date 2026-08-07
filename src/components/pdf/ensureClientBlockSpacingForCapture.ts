/**
 * Reforço redundante, aplicado só na cópia do html2canvas (via onclone em
 * generatePdf.ts), garantindo que o bloco CLIENTE / TELEFONE / LOCAL DA
 * OBRA tenha espaço vertical suficiente no PDF — mesmo que, por algum
 * motivo, o html2canvas não aplique fielmente o min-height/overflow vindos
 * da folha de estilos (BudgetSheetA4.module.css já define os mesmos
 * valores para a tela; isto é apenas uma segunda garantia, via estilo
 * inline, que tem prioridade máxima e não depende do parser de CSS externo
 * do html2canvas).
 *
 * Nunca roda na tela do app — só na cópia usada para gerar o PDF.
 */
export function ensureClientBlockSpacingForCapture(container: ParentNode): void {
  const block = container.querySelector<HTMLElement>('[data-pdf-client-block]');
  if (block) {
    block.style.height = 'auto';
    block.style.minHeight = '17mm';
    block.style.overflow = 'visible';
    block.style.paddingBottom = '5mm';
  }

  container.querySelectorAll<HTMLElement>('[data-pdf-client-value]').forEach((value) => {
    value.style.overflow = 'visible';
    value.style.height = 'auto';
    value.style.lineHeight = '1.8';
  });
}
