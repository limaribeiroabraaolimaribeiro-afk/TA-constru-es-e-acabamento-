/** Uma linha de descrição livre dentro da área "Descrição mão de obra e material". */
export interface BudgetItem {
  id: string;
  description: string;
}

/** Dados completos de um orçamento, espelhando os campos do papel timbrado oficial. */
export interface BudgetData {
  id: string;
  /** Nome do cliente / identificação da obra — não impresso na folha, usado para organização interna e nome do PDF. */
  clientName: string;
  items: BudgetItem[];
  /** Valor total digitado manualmente (não é somatório automático dos itens). */
  totalValue: string;
  /** Data no formato ISO (yyyy-mm-dd), exibida na folha como dd/mm/aaaa. */
  date: string;
  observation: string;
  createdAt: string;
  updatedAt: string;
}
