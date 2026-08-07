import { createRoot } from 'react-dom/client';
import { BudgetSheetA4 } from '../budget-sheet/BudgetSheetA4';
import { generateBudgetPdf, type GeneratePdfResult } from './generatePdf';
import { buildPdfFileName } from '../../utils/pdfFileName';
import type { BudgetData } from '../../types/budget';

/**
 * Gera o PDF de um orçamento específico do histórico, sem depender do
 * rascunho em edição (`draft`) nem do formulário atualmente montado. Monta
 * uma instância temporária e oculta de BudgetSheetA4 fora da árvore normal
 * do app, aguarda o layout, captura e desmonta em seguida.
 */
export async function regeneratePdfForBudget(budget: BudgetData): Promise<GeneratePdfResult> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '-10000px';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    await new Promise<void>((resolve) => {
      root.render(<BudgetSheetA4 budget={budget} />);
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const sheetElement = container.firstElementChild as HTMLElement | null;
    if (!sheetElement) {
      throw new Error('Falha ao preparar a folha para geração do PDF.');
    }

    const fileName = buildPdfFileName(budget);
    return await generateBudgetPdf(sheetElement, fileName);
  } finally {
    root.unmount();
    document.body.removeChild(container);
  }
}
