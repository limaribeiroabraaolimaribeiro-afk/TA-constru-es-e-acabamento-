import type { BudgetData } from '../../types/budget';
import { formatCurrencyDisplay } from '../../utils/currency';
import { formatDateBr } from '../../utils/date';
import { IconCoin, IconCalendar, IconDocument } from './icons';
import styles from './BudgetSheetA4.module.css';

interface SheetTotalsBlockProps {
  budget: BudgetData;
}

export function SheetTotalsBlock({ budget }: SheetTotalsBlockProps) {
  return (
    <div className={styles.totalsWrap}>
      <div className={styles.totalRow}>
        <div className={styles.totalLabelCell}>
          <span className={styles.coinBadge}>
            <IconCoin />
          </span>
          VALOR TOTAL
        </div>
        <div className={styles.totalValueCell}>{formatCurrencyDisplay(budget.totalValue)}</div>
      </div>

      <div className={styles.subRow}>
        <div className={styles.dateCol}>
          <span className={styles.colHeader}>
            <IconCalendar />
            DATA
          </span>
          <span className={styles.dateValue}>{formatDateBr(budget.date) || '__/__/____'}</span>
          <span className={styles.validityValue}>Validade: {budget.validity} dias</span>
        </div>

        <div className={styles.obsCol}>
          <span className={styles.colHeader}>
            <IconDocument />
            OBSERVAÇÃO
          </span>
          <span className={styles.obsValue}>{budget.observation}</span>
        </div>
      </div>
    </div>
  );
}
