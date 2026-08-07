import { useState, type RefObject } from 'react';
import { generateBudgetPdf, PdfOverflowError } from './generatePdf';
import { downloadBlob } from './downloadBlob';
import { formatBudgetNumber } from '../../utils/budgetNumber';
import type { BudgetData } from '../../types/budget';

interface PdfExportButtonProps {
  sheetRef: RefObject<HTMLDivElement | null>;
  budget: BudgetData;
}

type Status = 'idle' | 'loading' | 'overflow' | 'error';

export function PdfExportButton({ sheetRef, budget }: PdfExportButtonProps) {
  const [status, setStatus] = useState<Status>('idle');

  const handleClick = async () => {
    const sheetElement = sheetRef.current;
    if (!sheetElement) return;

    setStatus('loading');
    try {
      const fileName = `orcamento-${formatBudgetNumber(budget.budgetNumber)}.pdf`;
      const { blob } = await generateBudgetPdf(sheetElement, fileName);
      downloadBlob(blob, fileName);
      setStatus('idle');
    } catch (error) {
      if (error instanceof PdfOverflowError) {
        setStatus('overflow');
      } else {
        console.error('Falha ao gerar PDF do orçamento', error);
        setStatus('error');
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === 'loading'}
        className="min-h-11 rounded-md bg-ta-black px-4 text-sm font-semibold tracking-wide text-ta-gold-light disabled:opacity-50"
      >
        {status === 'loading' ? 'Gerando PDF…' : 'Gerar PDF'}
      </button>

      {status === 'overflow' && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          O conteúdo da descrição ultrapassa o limite da folha A4. Reduza o texto e tente novamente.
        </p>
      )}

      {status === 'error' && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Não foi possível gerar o PDF. Tente novamente.
        </p>
      )}
    </div>
  );
}
