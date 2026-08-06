/** Dados completos de um orçamento, incluindo numeração sequencial e controle de exibição do cliente. */
export interface BudgetData {
  id: string;
  budgetNumber: number;
  clientName: string;
  clientPhone: string;
  workAddress: string;
  /** Controla se o bloco de dados do cliente é impresso na folha (Etapa 2). */
  showClientData: boolean;
  /** Texto livre, múltiplas linhas/parágrafos — descrição de mão de obra e material. */
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
