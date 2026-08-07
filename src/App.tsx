import { useRef, useState } from 'react';
import { BudgetForm } from './components/form/BudgetForm';
import { Logo } from './components/ui/Logo';
import { COMPANY } from './constants/company';
import { useBudgetStore } from './store/useBudgetStore';
import { A4ZoomableViewer } from './components/budget-sheet/A4ZoomableViewer';
import { BudgetSheetA4 } from './components/budget-sheet/BudgetSheetA4';
import { PdfExportButton } from './components/pdf/PdfExportButton';

type View = 'editar' | 'visualizar';

/**
 * Tela temporária de visualização — alterna entre o formulário e a folha A4,
 * com pré-visualização responsiva (escala automática à largura disponível)
 * e zoom/navegação (pinça, roda do mouse, arraste, botões). O tamanho físico
 * da folha e seu layout interno (BudgetSheetA4) não são afetados.
 */
function App() {
  const draft = useBudgetStore((state) => state.draft);
  const [view, setView] = useState<View>('editar');
  const pdfSheetRef = useRef<HTMLDivElement>(null);

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col bg-neutral-50">
      <header className="flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3">
        <Logo className="h-10 w-10 object-contain" />
        <div>
          <p className="text-sm font-semibold text-ta-black">{COMPANY.name}</p>
          <p className="text-xs text-neutral-500">Orçamento Nº {draft.budgetNumber}</p>
        </div>
      </header>

      <nav className="flex border-b border-neutral-200 bg-white">
        <button
          type="button"
          onClick={() => setView('editar')}
          className={`min-h-11 flex-1 text-sm font-semibold ${view === 'editar' ? 'border-b-2 border-ta-gold-dark text-ta-black' : 'text-neutral-400'}`}
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => setView('visualizar')}
          className={`min-h-11 flex-1 text-sm font-semibold ${view === 'visualizar' ? 'border-b-2 border-ta-gold-dark text-ta-black' : 'text-neutral-400'}`}
        >
          Visualizar
        </button>
      </nav>

      <main className="flex-1">
        {view === 'editar' ? (
          <BudgetForm />
        ) : (
          <div className="flex flex-col gap-3 bg-neutral-200 p-3">
            <A4ZoomableViewer>
              <BudgetSheetA4 budget={draft} />
            </A4ZoomableViewer>
            <PdfExportButton sheetRef={pdfSheetRef} budget={draft} />
          </div>
        )}
      </main>

      {/*
        Instância oculta em tamanho real (210mm x 297mm), sem o transform de
        zoom/pan da pré-visualização — é a partir dela que o PDF é capturado
        (Etapa 4), garantindo resultado idêntico ao layout aprovado
        independente do nível de zoom que o usuário está vendo na tela.
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
