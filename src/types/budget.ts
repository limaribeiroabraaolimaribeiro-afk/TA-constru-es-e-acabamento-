/**
 * Qual das três variações de descrição o orçamento usa — controla o título
 * impresso na barra preta acima do texto livre. "labor_material" é o
 * padrão histórico, usado como fallback para orçamentos salvos antes deste
 * campo existir (ver normalizeBudget em store/budgetStorage.ts).
 */
export type DescriptionType = 'labor' | 'labor_material' | 'payment';

/** Dados completos de um orçamento, incluindo numeração sequencial e controle de exibição do cliente. */
export interface BudgetData {
  id: string;
  budgetNumber: number;
  clientName: string;
  clientPhone: string;
  workAddress: string;
  /** Controla se o bloco de dados do cliente é impresso na folha (Etapa 2). */
  showClientData: boolean;
  /** Qual título/variação de descrição usar — ver DescriptionType. */
  descriptionType: DescriptionType;
  /** Texto livre, múltiplas linhas/parágrafos — conteúdo da descrição, qualquer que seja o tipo. */
  description: string;
  totalValue: number;
  /** Data no formato ISO (yyyy-mm-dd), exibida na folha como dd/mm/aaaa. */
  date: string;
  /** Validade do orçamento em dias a partir da data. */
  validity: number;
  observation: string;
  createdAt: string;
  updatedAt: string;
}
