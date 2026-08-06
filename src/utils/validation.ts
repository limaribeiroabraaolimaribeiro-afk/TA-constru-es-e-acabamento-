import { z } from 'zod';

export const budgetSchema = z.object({
  id: z.string(),
  budgetNumber: z.number().int().nonnegative(),
  clientName: z.string().max(120, 'Nome muito longo'),
  clientPhone: z.string().max(30, 'Telefone muito longo'),
  workAddress: z.string().max(200, 'Endereço muito longo'),
  showClientData: z.boolean(),
  description: z.string().max(4000, 'Descrição muito longa'),
  totalValue: z.number().nonnegative(),
  date: z.string(),
  validity: z.number().int().nonnegative(),
  observation: z.string().max(500, 'Observação muito longa'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
