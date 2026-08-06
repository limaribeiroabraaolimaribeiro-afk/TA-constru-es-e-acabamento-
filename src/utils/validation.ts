import { z } from 'zod';

export const budgetItemSchema = z.object({
  id: z.string(),
  description: z.string().max(200, 'Descrição muito longa'),
});

export const budgetFormSchema = z.object({
  id: z.string(),
  clientName: z.string().max(120, 'Nome muito longo'),
  items: z.array(budgetItemSchema),
  totalValue: z.string(),
  date: z.string(),
  observation: z.string().max(300, 'Observação muito longa'),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
