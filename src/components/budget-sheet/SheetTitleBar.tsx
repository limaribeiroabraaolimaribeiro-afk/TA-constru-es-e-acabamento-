import styles from './BudgetSheetA4.module.css';

function Slashes({ className }: { className: string }) {
  return (
    <span className={`${styles.titleSlashes} ${className}`} aria-hidden="true">
      <span className={styles.slash} />
      <span className={styles.slash} />
      <span className={styles.slash} />
    </span>
  );
}

export function SheetTitleBar() {
  return (
    <div className={styles.titleBar}>
      <Slashes className={styles.titleSlashesLeft} />
      <span className={styles.titleText}>DESCRIÇÃO MÃO DE OBRA E MATERIAL</span>
      <Slashes className={styles.titleSlashesRight} />
      <div className={styles.titleWedge} aria-hidden="true" />
    </div>
  );
}
