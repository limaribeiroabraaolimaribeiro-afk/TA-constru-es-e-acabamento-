import type { DescriptionType } from '../types/budget';

/** Fallback para orçamentos salvos antes deste campo existir — preserva o comportamento anterior. */
export const DEFAULT_DESCRIPTION_TYPE: DescriptionType = 'labor_material';

interface DescriptionTypeOption {
  value: DescriptionType;
  /** Rótulo mostrado no seletor do formulário. */
  label: string;
  /** Título impresso na barra preta da folha A4 (e usado na aba Visualizar/PDF). */
  sheetTitle: string;
}

/** As três variações suportadas, na ordem em que aparecem no seletor do formulário. */
export const DESCRIPTION_TYPE_OPTIONS: DescriptionTypeOption[] = [
  { value: 'labor', label: 'Descrição mão de obra', sheetTitle: 'DESCRIÇÃO MÃO DE OBRA' },
  {
    value: 'labor_material',
    label: 'Descrição mão de obra e material',
    sheetTitle: 'DESCRIÇÃO MÃO DE OBRA E MATERIAL',
  },
  {
    value: 'payment',
    label: 'Descrição pagamento — etapas e entradas',
    sheetTitle: 'DESCRIÇÃO PAGAMENTO — ETAPAS E ENTRADAS',
  },
];

const TITLE_BY_TYPE: Record<DescriptionType, string> = Object.fromEntries(
  DESCRIPTION_TYPE_OPTIONS.map((option) => [option.value, option.sheetTitle]),
) as Record<DescriptionType, string>;

/** Título a imprimir na folha para o tipo informado — usa o padrão se o valor for ausente/inválido. */
export function getDescriptionTypeTitle(type: DescriptionType | undefined | null): string {
  return TITLE_BY_TYPE[type as DescriptionType] ?? TITLE_BY_TYPE[DEFAULT_DESCRIPTION_TYPE];
}
