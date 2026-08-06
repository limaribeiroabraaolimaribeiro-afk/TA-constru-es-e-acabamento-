import { COMPANY } from '../../constants/company';
import styles from './BudgetSheetA4.module.css';

export function SheetFooter() {
  return (
    <div className={styles.footer}>
      <span className={styles.footerText}>{COMPANY.tagline}</span>
      <div className={styles.footerWedge} aria-hidden="true" />
    </div>
  );
}
