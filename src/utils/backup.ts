import { z } from 'zod';
import { budgetSchema } from './validation';
import type { BudgetData } from '../types/budget';

export const BACKUP_VERSION = 1;

export interface BackupData {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  draft: BudgetData;
  history: BudgetData[];
  nextBudgetNumber: number;
}

const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  draft: budgetSchema,
  history: z.array(budgetSchema),
  nextBudgetNumber: z.number().int().nonnegative(),
});

export function createBackup(input: {
  draft: BudgetData;
  history: BudgetData[];
  nextBudgetNumber: number;
}): BackupData {
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    draft: input.draft,
    history: input.history,
    nextBudgetNumber: input.nextBudgetNumber,
  };
}

export function serializeBackup(backup: BackupData): string {
  return JSON.stringify(backup, null, 2);
}

/** Nome de arquivo sugerido para o backup, ex.: "ta-orcamentos-backup-2026-08-07.json". */
export function buildBackupFileName(date: Date = new Date()): string {
  const iso = date.toISOString().slice(0, 10);
  return `ta-orcamentos-backup-${iso}.json`;
}

export type BackupValidationResult =
  | { valid: true; data: BackupData }
  | { valid: false; error: string };

/** Valida a estrutura de um backup antes de permitir a importação (nunca sobrescreve sem essa checagem). */
export function parseAndValidateBackup(raw: string): BackupValidationResult {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { valid: false, error: 'O arquivo não é um JSON válido.' };
  }

  const result = backupSchema.safeParse(parsedJson);
  if (!result.success) {
    return { valid: false, error: 'O arquivo não tem o formato esperado de um backup do TA Orçamentos.' };
  }

  return { valid: true, data: result.data };
}
