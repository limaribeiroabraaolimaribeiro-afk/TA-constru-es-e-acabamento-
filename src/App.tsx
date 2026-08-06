import { BudgetForm } from './components/form/BudgetForm';
import { Logo } from './components/ui/Logo';
import { COMPANY } from './constants/company';
import { useBudgetStore } from './store/useBudgetStore';

function App() {
  const budgetNumber = useBudgetStore((state) => state.draft.budgetNumber);

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Logo className="h-10 w-10 object-contain" />
        <div>
          <p className="text-sm font-semibold text-ta-black">{COMPANY.name}</p>
          <p className="text-xs text-neutral-500">Orçamento Nº {budgetNumber}</p>
        </div>
      </header>

      <main className="flex-1">
        <BudgetForm />
      </main>
    </div>
  );
}

export default App;
