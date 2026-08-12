import { z } from 'zod';

/*
 * descriptionType é obrigatório aqui (sem .default()) de propósito — usar
 * .default() deixaria o tipo de ENTRADA opcional mas o de SAÍDA
 * obrigatório, e o zodResolver do react-hook-form exige que os dois batam
 * (useForm<BudgetFormValues> quebra a checagem de tipos com esse
 * descompasso). A compatibilidade com orçamentos/backups salvos antes
 * deste campo existir é resolvida ANTES da validação — ver normalizeBudget
 * em store/budgetStorage.ts (localStorage) e utils/backup.ts (importação
 * de backup) — então por aqui os dados sempre chegam já completos.
 */
export const budgetSchema = z.object({
  id: z.string(),
  budgetNumber: z.number().int().nonnegative(),
  clientName: z.string().max(120, 'Nome muito longo'),
  clientPhone: z.string().max(30, 'Telefone muito longo'),
  workAddress: z.string().max(200, 'Endereço muito longo'),
  showClientData: z.boolean(),
  descriptionType: z.enum(['labor', 'labor_material', 'payment']),
  description: z.string().max(4000, 'Descrição muito longa'),
  totalValue: z.number().nonnegative(),
  date: z.string(),
  validity: z.number().int().nonnegative(),
  observation: z.string().max(500, 'Observação muito longa'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
