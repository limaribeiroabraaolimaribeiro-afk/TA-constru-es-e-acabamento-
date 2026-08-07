import { Logo } from '../ui/Logo';
import { COMPANY } from '../../constants/company';
import { IconPerson, IconPhone, IconPin, IconEnvelope } from './icons';
import styles from './BudgetSheetA4.module.css';

export function SheetHeader() {
  return (
    <div className={styles.header}>
      <div className={styles.headerGoldRibbon} data-pdf-clip-shape="header-gold-ribbon" aria-hidden="true" />
      <div className={styles.headerBlackPanel} data-pdf-clip-shape="header-black-panel" aria-hidden="true" />

      {/* A logo oficial já traz o nome da empresa, o WhatsApp e o telefone
          "assados" na própria imagem — não duplicamos esse texto em HTML. */}
      <div className={styles.headerLeft}>
        <Logo className={styles.logo} />
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

      <div className={styles.headerWedge} data-pdf-clip-shape="header-wedge" aria-hidden="true" />
    </div>
  );
}
