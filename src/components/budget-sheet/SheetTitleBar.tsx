import { getDescriptionTypeTitle } from '../../constants/descriptionTypes';
import type { DescriptionType } from '../../types/budget';
import styles from './BudgetSheetA4.module.css';

interface SheetTitleBarProps {
  descriptionType: DescriptionType;
}

function Slashes({ className }: { className: string }) {
  return (
    <span className={`${styles.titleSlashes} ${className}`} aria-hidden="true">
      <span className={styles.slash} />
      <span className={styles.slash} />
      <span className={styles.slash} />
    </span>
  );
}

export function SheetTitleBar({ descriptionType }: SheetTitleBarProps) {
  return (
    <div className={styles.titleBar}>
      <Slashes className={styles.titleSlashesLeft} />
      <span className={styles.titleText}>{getDescriptionTypeTitle(descriptionType)}</span>
      <Slashes className={styles.titleSlashesRight} />
      <div className={styles.titleWedge} aria-hidden="true" />
    </div>
  );
}
