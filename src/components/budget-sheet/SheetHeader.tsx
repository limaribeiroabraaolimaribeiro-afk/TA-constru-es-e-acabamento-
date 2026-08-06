import { Logo } from '../ui/Logo';
import { COMPANY } from '../../constants/company';
import { IconPerson, IconPhone, IconPin, IconEnvelope, IconWhatsapp } from './icons';
import styles from './BudgetSheetA4.module.css';

export function SheetHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.headerGoldRibbon} aria-hidden="true" />
      <div className={styles.headerBlackPanel} aria-hidden="true" />

      <div className={styles.headerLeft}>
        <Logo className={styles.logo} />
        <div className={styles.brandRow}>
          <span className={styles.brandName}>CONSTRUÇÕES E ACABAMENTO</span>
        </div>
        <div className={styles.brandRow}>
          <IconWhatsapp className={styles.whatsappIcon} />
          <span className={styles.brandPhone}>{COMPANY.phone}</span>
        </div>
      </div>

      <div className={styles.headerRightContent}>
        <div className={styles.contactRow}>
          <span className={styles.contactIcon}>
            <IconPerson />
          </span>
          <span className={styles.contactText}>
            <span className={styles.contactLabel}>CNPJ: </span>
            <span className={styles.contactValue}>{COMPANY.cnpj}</span>
          </span>
        </div>

        <div className={styles.contactRow}>
          <span className={styles.contactIcon}>
            <IconPhone />
          </span>
          <span className={styles.contactText}>
            <span className={styles.contactValue}>
              {COMPANY.phone} - {COMPANY.phoneContactName}
            </span>
          </span>
        </div>

        <div className={styles.contactRow}>
          <span className={styles.contactIcon}>
            <IconPin />
          </span>
          <span className={styles.contactText}>
            <span className={styles.contactLabel}>Endereço:</span>
            <br />
            <span className={styles.contactValue}>
              {COMPANY.address.street}
              <br />
              {COMPANY.address.neighborhood}
              <br />
              {COMPANY.address.zipCode}
            </span>
          </span>
        </div>

        <div className={styles.contactRow}>
          <span className={styles.contactIcon}>
            <IconEnvelope />
          </span>
          <span className={styles.contactText}>
            <span className={styles.contactLabel}>E-mail:</span>
            <br />
            <span className={styles.contactValue}>{COMPANY.email}</span>
          </span>
        </div>
      </div>

      <div className={styles.headerWedge} aria-hidden="true" />
    </div>
  );
}
