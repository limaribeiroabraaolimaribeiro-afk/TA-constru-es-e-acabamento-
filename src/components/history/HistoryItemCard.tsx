import { useState } from 'react';
import type { BudgetData } from '../../types/budget';
import { formatBudgetNumber } from '../../utils/budgetNumber';
import { formatCurrencyDisplay } from '../../utils/currency';
import { formatDateBr, formatDateTimeBr } from '../../utils/date';
import { IconEye, IconPencil, IconCopy, IconTrash, IconDownload } from '../ui/actionIcons';

interface HistoryItemCardProps {
  budget: BudgetData;
  isGeneratingPdf: boolean;
  onOpen: (budget: BudgetData) => void;
  onEdit: (budget: BudgetData) => void;
  onDuplicate: (budget: BudgetData) => void;
  onDelete: (budget: BudgetData) => void;
  onGeneratePdf: (budget: BudgetData) => void;
}

const actionButtonClass =
  'flex min-h-10 flex-1 flex-col items-center justify-center gap-0.5 rounded-md border border-neutral-200 py-1.5 text-[10px] font-medium text-neutral-600 active:bg-neutral-100 disabled:opacity-40';

export function HistoryItemCard({
  budget,
  isGeneratingPdf,
  onOpen,
  onEdit,
  onDuplicate,
  onDelete,
  onGeneratePdf,
}: HistoryItemCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
      <button type="button" onClick={() => onOpen(budget)} className="flex w-full flex-col items-start text-left">
        <div className="flex w-full items-center justify-between">
          <span className="text-xs font-bold tracking-wide text-ta-gold-dark">
            Nº {formatBudgetNumber(budget.budgetNumber)}
          </span>
          <span className="text-[11px] text-neutral-400">Editado em {formatDateTimeBr(budget.updatedAt)}</span>
        </div>
        <p className="mt-1 text-sm font-semibold text-ta-black">{budget.clientName || 'Cliente não informado'}</p>
        <div className="mt-1 flex w-full items-center justify-between text-xs text-neutral-500">
          <span>{formatDateBr(budget.date)}</span>
          <span className="font-semibold text-ta-black">{formatCurrencyDisplay(budget.totalValue)}</span>
        </div>
      </button>

      {confirmingDelete ? (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 p-2">
          <p className="flex-1 text-xs text-red-700">Excluir este orçamento?</p>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="min-h-8 rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-ta-black"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmingDelete(false);
              onDelete(budget);
            }}
            className="min-h-8 rounded-md bg-red-600 px-3 text-xs font-semibold text-white"
          >
            Excluir
          </button>
        </div>
      ) : (
        <div className="mt-3 flex gap-1.5">
          <button type="button" className={actionButtonClass} onClick={() => onEdit(budget)}>
            <IconPencil className="h-4 w-4" />
            Editar
          </button>
          <button type="button" className={actionButtonClass} onClick={() => onDuplicate(budget)}>
            <IconCopy className="h-4 w-4" />
            Duplicar
          </button>
          <button
            type="button"
            className={actionButtonClass}
            onClick={() => onGeneratePdf(budget)}
            disabled={isGeneratingPdf}
          >
            <IconDownload className="h-4 w-4" />
            {isGeneratingPdf ? 'Gerando…' : 'PDF'}
          </button>
          <button type="button" className={actionButtonClass} onClick={() => onOpen(budget)}>
            <IconEye className="h-4 w-4" />
            Abrir
          </button>
          <button
            type="button"
            className={`${actionButtonClass} text-red-600`}
            onClick={() => setConfirmingDelete(true)}
          >
            <IconTrash className="h-4 w-4" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
