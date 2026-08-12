import { describe, it, expect } from 'vitest';
import { createBackup, serializeBackup, parseAndValidateBackup, buildBackupFileName, BACKUP_VERSION } from './backup';
import type { BudgetData } from '../types/budget';

function makeBudget(overrides: Partial<BudgetData> = {}): BudgetData {
  const now = new Date().toISOString();
  return {
    id: 'id-1',
    budgetNumber: 1,
    clientName: 'Maria Souza',
    clientPhone: '',
    workAddress: '',
    showClientData: false,
    descriptionType: 'labor_material',
    description: '',
    totalValue: 1500,
    date: '2026-08-07',
    validity: 7,
    observation: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('createBackup / serializeBackup', () => {
  it('monta um backup com a versão atual e os dados fornecidos', () => {
    const draft = makeBudget({ id: 'draft-id' });
    const history = [makeBudget({ id: 'h1' }), makeBudget({ id: 'h2', budgetNumber: 2 })];
    const backup = createBackup({ draft, history, nextBudgetNumber: 3 });

    expect(backup.version).toBe(BACKUP_VERSION);
    expect(backup.draft).toEqual(draft);
    expect(backup.history).toEqual(history);
    expect(backup.nextBudgetNumber).toBe(3);
    expect(typeof backup.exportedAt).toBe('string');
  });

  it('serializa como JSON legível e reversível', () => {
    const backup = createBackup({ draft: makeBudget(), history: [], nextBudgetNumber: 1 });
    const json = serializeBackup(backup);
    expect(JSON.parse(json)).toEqual(backup);
  });
});

describe('parseAndValidateBackup', () => {
  it('aceita um backup válido', () => {
    const draft = makeBudget();
    const backup = createBackup({ draft, history: [draft], nextBudgetNumber: 2 });
    const result = parseAndValidateBackup(serializeBackup(backup));

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.history).toHaveLength(1);
      expect(result.data.nextBudgetNumber).toBe(2);
    }
  });

  it('rejeita um JSON malformado', () => {
    const result = parseAndValidateBackup('{ isso não é json');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toMatch(/JSON/);
    }
  });

  it('rejeita um JSON válido mas com formato inesperado (faltando campos obrigatórios)', () => {
    const result = parseAndValidateBackup(JSON.stringify({ hello: 'world' }));
    expect(result.valid).toBe(false);
  });

  it('rejeita um backup com um orçamento inválido dentro do histórico', () => {
    const draft = makeBudget();
    const backup = createBackup({ draft, history: [draft], nextBudgetNumber: 2 });
    const corrupted = { ...backup, history: [{ ...draft, budgetNumber: 'não é número' }] };

    const result = parseAndValidateBackup(JSON.stringify(corrupted));
    expect(result.valid).toBe(false);
  });

  it('rejeita um backup de versão diferente da suportada', () => {
    const draft = makeBudget();
    const backup = createBackup({ draft, history: [], nextBudgetNumber: 1 });
    const wrongVersion = { ...backup, version: 99 };

    const result = parseAndValidateBackup(JSON.stringify(wrongVersion));
    expect(result.valid).toBe(false);
  });

  it('aceita um backup exportado antes de descriptionType existir, usando "mão de obra e material" como fallback', () => {
    const draft = makeBudget();
    const backup = createBackup({ draft, history: [draft, makeBudget({ id: 'h2' })], nextBudgetNumber: 2 });
    // Simula um backup salvo por uma versão anterior do app: sem o campo em lugar nenhum.
    const legacy = JSON.parse(serializeBackup(backup));
    delete legacy.draft.descriptionType;
    legacy.history.forEach((item: { descriptionType?: string }) => delete item.descriptionType);

    const result = parseAndValidateBackup(JSON.stringify(legacy));

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.draft.descriptionType).toBe('labor_material');
      expect(result.data.history.every((item) => item.descriptionType === 'labor_material')).toBe(true);
    }
  });
});

describe('buildBackupFileName', () => {
  it('gera um nome de arquivo com a data no formato aaaa-mm-dd', () => {
    const fileName = buildBackupFileName(new Date('2026-08-07T10:00:00.000Z'));
    expect(fileName).toBe('ta-orcamentos-backup-2026-08-07.json');
  });
});
