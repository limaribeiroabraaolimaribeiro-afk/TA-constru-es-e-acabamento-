import { Logo } from '../ui/Logo';
import styles from './BudgetSheetA4.module.css';

interface SheetDescriptionAreaProps {
  description: string;
}

export function SheetDescriptionArea({ description }: SheetDescriptionAreaProps) {
  return (
    <div className={styles.descriptionWrap}>
      <Logo variant="watermark" className={styles.watermark} />
      <div className={styles.linesLayer} aria-hidden="true" />
      {description.trim() ? (
        <div className={styles.descriptionText} data-testid="budget-description-text">
          {description}
        </div>
      ) : (
        <div
          className={`${styles.descriptionText} ${styles.descriptionPlaceholder}`}
          data-testid="budget-description-text"
        >
          Descreva os serviços e materiais deste orçamento.
        </div>
      )}
    </div>
  );
}
