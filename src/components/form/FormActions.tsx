import { useBudgetStore } from '../../store/useBudgetStore';
import { useToastStore } from '../../store/useToastStore';
import { formatBudgetNumber } from '../../utils/budgetNumber';

/** Botões "Salvar orçamento" e "Novo orçamento", com feedback visual (toast). */
export function FormActions() {
  const saveBudget = useBudgetStore((state) => state.saveBudget);
  const createNewBudget = useBudgetStore((state) => state.createNewBudget);
  const showToast = useToastStore((state) => state.show);

  const handleSave = () => {
    const saved = saveBudget();
    showToast(`Orçamento Nº ${formatBudgetNumber(saved.budgetNumber)} salvo com sucesso.`, 'success');
  };

  const handleNew = () => {
    const created = createNewBudget();
    showToast(`Novo orçamento Nº ${formatBudgetNumber(created.budgetNumber)} criado.`, 'success');
  };

  return (
    <div className="flex gap-2 border-t border-neutral-200 bg-white p-4">
      <button
        type="button"
        onClick={handleNew}
        className="min-h-11 flex-1 rounded-md border border-neutral-300 text-sm font-semibold text-ta-black"
      >
        Novo orçamento
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="min-h-11 flex-1 rounded-md bg-ta-black text-sm font-semibold text-ta-gold-light"
      >
        Salvar orçamento
      </button>
    </div>
  );
}
