import { useRef, useState } from 'react';
import { BudgetForm } from './components/form/BudgetForm';
import { Logo } from './components/ui/Logo';
import { Toast } from './components/ui/Toast';
import { UpdatePrompt } from './components/pwa/UpdatePrompt';
import { COMPANY } from './constants/company';
import { useBudgetStore } from './store/useBudgetStore';
import { A4ZoomableViewer } from './components/budget-sheet/A4ZoomableViewer';
import { BudgetSheetA4 } from './components/budget-sheet/BudgetSheetA4';
import { VisualizarActions } from './components/pdf/VisualizarActions';
import { HistoryScreen } from './components/history/HistoryScreen';
import type { AppView } from './types/navigation';

const TABS: { key: AppView; label: string }[] = [
  { key: 'editar', label: 'Editar' },
  { key: 'visualizar', label: 'Visualizar' },
  { key: 'historico', label: 'Histórico' },
];

/**
 * Alterna entre formulário, pré-visualização da folha A4 (com zoom/navegação)
 * e o histórico de orçamentos salvos, através de uma barra de abas fixa no
 * rodapé — padrão de navegação mobile.
 */
function App() {
  const draft = useBudgetStore((state) => state.draft);
  const [view, setView] = useState<AppView>('editar');
  const pdfSheetRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-neutral-50">
      <UpdatePrompt />

      <header
        className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3"
        style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
      >
        <Logo className="h-10 w-10 object-contain" />
        <div>
          <p className="text-sm font-semibold text-ta-black">{COMPANY.name}</p>
          <p className="text-xs text-neutral-500">Orçamento Nº {draft.budgetNumber}</p>
        </div>
      </header>

      <main className="flex-1">
        {view === 'editar' && <BudgetForm />}
        {view === 'visualizar' && (
          <div className="flex flex-col gap-3 bg-neutral-200 p-3">
            <A4ZoomableViewer>
              <BudgetSheetA4 budget={draft} />
            </A4ZoomableViewer>
            <VisualizarActions sheetRef={pdfSheetRef} budget={draft} onEdit={() => setView('editar')} />
          </div>
        )}
        {view === 'historico' && <HistoryScreen onNavigate={setView} />}
      </main>

      <nav
        className="sticky bottom-0 flex border-t border-neutral-200 bg-white"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setView(tab.key)}
            className={`min-h-12 flex-1 text-sm font-semibold ${
              view === tab.key ? 'border-t-2 border-ta-gold-dark text-ta-black' : 'text-neutral-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <Toast />

      {/*
        Instância oculta em tamanho real (210mm x 297mm), sem o transform de
        zoom/pan da pré-visualização — é a partir dela que o PDF do rascunho
        atual é capturado (Etapa 4), garantindo resultado idêntico ao layout
        aprovado independente do nível de zoom que o usuário está vendo na
        tela. PDFs gerados a partir do Histórico usam uma instância separada
        (ver regeneratePdfForBudget.tsx), sem afetar este rascunho.
      */}
      <div style={{ position: 'fixed', top: 0, left: '-10000px', pointerEvents: 'none' }} aria-hidden="true">
        <div ref={pdfSheetRef}>
          <BudgetSheetA4 budget={draft} />
        </div>
      </div>
    </div>
  );
}

export default App;
