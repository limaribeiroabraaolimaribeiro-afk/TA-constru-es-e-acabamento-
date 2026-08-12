import { z } from 'zod';
import { budgetSchema } from './validation';
import { normalizeBudget, type StoredBudgetData } from '../store/budgetStorage';
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

/**
 * Preenche descriptionType em draft/history ANTES da validação, para
 * aceitar backups exportados antes desse campo existir — mesma
 * normalização usada na leitura do localStorage (ver budgetStorage.ts).
 * Feito no JSON bruto, antes do zod: o schema exige descriptionType
 * (necessário para o zodResolver do formulário bater tipos), então um
 * backup antigo sem o campo falharia a validação se não fosse preenchido
 * aqui primeiro.
 */
function normalizeBackupJson(parsedJson: unknown): unknown {
  if (typeof parsedJson !== 'object' || parsedJson === null) return parsedJson;
  const obj = parsedJson as Record<string, unknown>;
  const normalized: Record<string, unknown> = { ...obj };

  if (obj.draft && typeof obj.draft === 'object') {
    normalized.draft = normalizeBudget(obj.draft as StoredBudgetData);
  }
  if (Array.isArray(obj.history)) {
    normalized.history = obj.history.map((item) =>
      item && typeof item === 'object' ? normalizeBudget(item as StoredBudgetData) : item,
    );
  }

  return normalized;
}

/** Valida a estrutura de um backup antes de permitir a importação (nunca sobrescreve sem essa checagem). */
export function parseAndValidateBackup(raw: string): BackupValidationResult {
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { valid: false, error: 'O arquivo não é um JSON válido.' };
  }

  const result = backupSchema.safeParse(normalizeBackupJson(parsedJson));
  if (!result.success) {
    return { valid: false, error: 'O arquivo não tem o formato esperado de um backup do TA Orçamentos.' };
  }

  return { valid: true, data: result.data };
}
