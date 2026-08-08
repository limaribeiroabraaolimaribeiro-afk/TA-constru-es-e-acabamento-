import { useState, type RefObject } from 'react';
import { generateBudgetPdf, PdfOverflowError } from './generatePdf';
import { downloadBlob } from './downloadBlob';
import { shareBudgetPdf } from './sharePdf';
import { buildPdfFileName } from '../../utils/pdfFileName';
import { useToastStore } from '../../store/useToastStore';
import type { BudgetData } from '../../types/budget';

interface VisualizarActionsProps {
  sheetRef: RefObject<HTMLDivElement | null>;
  budget: BudgetData;
  onEdit: () => void;
}

type Status = 'idle' | 'generating' | 'sharing' | 'overflow' | 'error';

const buttonBaseClass =
  'min-h-11 min-w-0 flex-1 rounded-md px-1 text-[11px] font-semibold tracking-tight whitespace-nowrap disabled:opacity-50 sm:px-2 sm:text-sm sm:tracking-normal';

/** Botões da aba Visualizar: Editar, Gerar PDF e Compartilhar. */
export function VisualizarActions({ sheetRef, budget, onEdit }: VisualizarActionsProps) {
  const [status, setStatus] = useState<Status>('idle');
  const showToast = useToastStore((state) => state.show);

  const busy = status === 'generating' || status === 'sharing';

  const runWithSheet = async (
    nextStatus: 'generating' | 'sharing',
    action: (sheetElement: HTMLElement, fileName: string) => Promise<void>,
  ) => {
    const sheetElement = sheetRef.current;
    if (!sheetElement) return;

    setStatus(nextStatus);
    try {
      const fileName = buildPdfFileName(budget);
      await action(sheetElement, fileName);
      setStatus('idle');
    } catch (error) {
      if (error instanceof PdfOverflowError) {
        setStatus('overflow');
      } else {
        console.error('Falha ao processar o PDF do orçamento', error);
        setStatus('error');
      }
    }
  };

  const handleGeneratePdf = () =>
    runWithSheet('generating', async (sheetElement, fileName) => {
      const { blob } = await generateBudgetPdf(sheetElement, fileName);
      downloadBlob(blob, fileName);
      showToast('PDF gerado com sucesso.', 'success');
    });

  const handleShare = () =>
    runWithSheet('sharing', async (sheetElement, fileName) => {
      const { blob } = await generateBudgetPdf(sheetElement, fileName);
      const result = await shareBudgetPdf(blob, fileName, budget);
      if (result === 'shared') {
        showToast('Orçamento compartilhado.', 'success');
      } else if (result === 'fallback') {
        showToast('PDF baixado. No WhatsApp que abriu, anexe o arquivo baixado manualmente.', 'success');
      }
    });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button type="button" onClick={onEdit} className={`${buttonBaseClass} border border-neutral-300 text-ta-black`}>
          Editar
        </button>
        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={busy}
          className={`${buttonBaseClass} bg-ta-black text-ta-gold-light`}
        >
          {status === 'generating' ? 'Gerando…' : 'Gerar PDF'}
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy}
          className={`${buttonBaseClass} bg-emerald-600 text-white`}
        >
          {status === 'sharing' ? 'Enviando…' : 'Compartilhar'}
        </button>
      </div>

      {status === 'overflow' && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          O conteúdo da descrição ultrapassa o limite da folha A4. Reduza o texto e tente novamente.
        </p>
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Não foi possível concluir. Tente novamente.
        </p>
      )}
    </div>
  );
}
