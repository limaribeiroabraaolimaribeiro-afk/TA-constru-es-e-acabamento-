import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import type { BudgetData } from '../../types/budget';
import { formatBudgetNumber } from '../../utils/budgetNumber';
import { SheetHeader } from './SheetHeader';
import { SheetClientBlock } from './SheetClientBlock';
import { SheetTitleBar } from './SheetTitleBar';
import { SheetDescriptionArea } from './SheetDescriptionArea';
import { SheetTotalsBlock } from './SheetTotalsBlock';
import { SheetFooter } from './SheetFooter';
import styles from './BudgetSheetA4.module.css';

interface BudgetSheetA4Props {
  budget: BudgetData;
}

/**
 * Folha A4 do orçamento, fiel ao papel timbrado oficial da TA Construções e
 * Acabamento. Tamanho físico fixo (210mm x 297mm) e layout interno não
 * responsivo — em telas pequenas, use A4ZoomableViewer para escalar/navegar
 * o componente inteiro sem alterar seu layout interno.
 */
export function BudgetSheetA4({ budget }: BudgetSheetA4Props) {
  return (
    <div className={styles.sheet} data-testid="budget-sheet-a4">
      <div className={styles.goldDotsTopLeft} aria-hidden="true" />
      <div className={styles.goldDotsBottomRight} aria-hidden="true" />

      <span className={styles.budgetBadge}>ORÇAMENTO Nº {formatBudgetNumber(budget.budgetNumber)}</span>

      <SheetHeader />
      <SheetClientBlock budget={budget} />
      <SheetTitleBar descriptionType={budget.descriptionType} />
      <SheetDescriptionArea description={budget.description} />
      <SheetTotalsBlock budget={budget} />
      <SheetFooter />
    </div>
  );
}
