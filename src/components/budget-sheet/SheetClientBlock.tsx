import type { BudgetData } from '../../types/budget';
import styles from './BudgetSheetA4.module.css';

interface SheetClientBlockProps {
  budget: BudgetData;
}

/** Só ocupa espaço na folha quando showClientData está ativo (retorna null caso contrário). */
export function SheetClientBlock({ budget }: SheetClientBlockProps) {
  if (!budget.showClientData) return null;

  return (
    <div className={styles.clientBlock}>
      <div className={styles.clientItem}>
        <div className={styles.clientLabel}>CLIENTE</div>
        <div className={styles.clientValue}>{budget.clientName || '—'}</div>
      </div>
      <div className={styles.clientItem}>
        <div className={styles.clientLabel}>TELEFONE</div>
        <div className={styles.clientValue}>{budget.clientPhone || '—'}</div>
      </div>
      <div className={styles.clientItem}>
        <div className={styles.clientLabel}>LOCAL DA OBRA</div>
        <div className={styles.clientValue}>{budget.workAddress || '—'}</div>
      </div>
    </div>
  );
}
