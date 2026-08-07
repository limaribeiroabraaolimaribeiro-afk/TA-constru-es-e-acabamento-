import { useState } from 'react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { useToastStore } from '../../store/useToastStore';
import { searchAndSortBudgets } from '../../utils/searchBudgets';
import { formatBudgetNumber } from '../../utils/budgetNumber';
import { regeneratePdfForBudget } from '../pdf/regeneratePdfForBudget';
import { downloadBlob } from '../pdf/downloadBlob';
import { PdfOverflowError } from '../pdf/generatePdf';
import { IconSearch } from '../ui/actionIcons';
import { HistoryItemCard } from './HistoryItemCard';
import type { BudgetData } from '../../types/budget';
import type { AppView } from '../../types/navigation';

interface HistoryScreenProps {
  onNavigate: (view: AppView) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const history = useBudgetStore((state) => state.history);
  const loadBudget = useBudgetStore((state) => state.loadBudget);
  const duplicateBudget = useBudgetStore((state) => state.duplicateBudget);
  const deleteBudget = useBudgetStore((state) => state.deleteBudget);
  const showToast = useToastStore((state) => state.show);

  const [query, setQuery] = useState('');
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);

  const results = searchAndSortBudgets(history, query);

  const handleOpen = (budget: BudgetData) => {
    loadBudget(budget.id);
    onNavigate('visualizar');
  };

  const handleEdit = (budget: BudgetData) => {
    loadBudget(budget.id);
    onNavigate('editar');
  };

  const handleDuplicate = (budget: BudgetData) => {
    const duplicated = duplicateBudget(budget.id);
    if (!duplicated) {
      showToast('Não foi possível duplicar o orçamento.', 'error');
      return;
    }
    showToast(`Orçamento duplicado como Nº ${formatBudgetNumber(duplicated.budgetNumber)}.`, 'success');
    onNavigate('editar');
  };

  const handleDelete = (budget: BudgetData) => {
    deleteBudget(budget.id);
    showToast(`Orçamento Nº ${formatBudgetNumber(budget.budgetNumber)} excluído.`, 'success');
  };

  const handleGeneratePdf = async (budget: BudgetData) => {
    setGeneratingPdfId(budget.id);
    try {
      const { blob, fileName } = await regeneratePdfForBudget(budget);
      downloadBlob(blob, fileName);
      showToast(`PDF do orçamento Nº ${formatBudgetNumber(budget.budgetNumber)} gerado.`, 'success');
    } catch (error) {
      if (error instanceof PdfOverflowError) {
        showToast('O conteúdo desse orçamento ultrapassa a folha A4. Edite antes de gerar o PDF.', 'error');
      } else {
        console.error('Falha ao gerar PDF a partir do histórico', error);
        showToast('Não foi possível gerar o PDF. Tente novamente.', 'error');
      }
    } finally {
      setGeneratingPdfId(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 pb-8">
      <div className="relative">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por cliente ou número do orçamento"
          className="min-h-11 w-full rounded-md border border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none focus:border-ta-gold-dark focus:ring-1 focus:ring-ta-gold-dark"
        />
      </div>

      {results.length === 0 ? (
        <p className="mt-6 text-center text-sm text-neutral-500">
          {history.length === 0
            ? 'Nenhum orçamento salvo ainda. Preencha um orçamento e toque em "Salvar orçamento".'
            : 'Nenhum orçamento encontrado para essa busca.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {results.map((budget) => (
            <HistoryItemCard
              key={budget.id}
              budget={budget}
              isGeneratingPdf={generatingPdfId === budget.id}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onGeneratePdf={handleGeneratePdf}
            />
          ))}
        </div>
      )}
    </div>
  );
}
