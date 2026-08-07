import { describe, it, expect } from 'vitest';
import { normalizeForFileName, buildPdfFileName } from './pdfFileName';

describe('normalizeForFileName', () => {
  it('remove acentos', () => {
    expect(normalizeForFileName('João Pereira')).toBe('Joao-Pereira');
    expect(normalizeForFileName('Água Verde')).toBe('Agua-Verde');
    expect(normalizeForFileName('Construção')).toBe('Construcao');
  });

  it('troca espaços por hífen', () => {
    expect(normalizeForFileName('Maria Souza Lima')).toBe('Maria-Souza-Lima');
  });

  it('remove caracteres inválidos para nome de arquivo', () => {
    expect(normalizeForFileName('Cliente & Cia. (Filial #2)')).toBe('Cliente-Cia-Filial-2');
  });

  it('remove espaços extras nas bordas', () => {
    expect(normalizeForFileName('  Maria Souza  ')).toBe('Maria-Souza');
  });
});

describe('buildPdfFileName', () => {
  it('gera o nome no formato Orcamento-TA-0001-Maria-Souza.pdf', () => {
    expect(buildPdfFileName({ budgetNumber: 1, clientName: 'Maria Souza' })).toBe(
      'Orcamento-TA-0001-Maria-Souza.pdf',
    );
  });

  it('normaliza acentos e espaços no nome do cliente dentro do arquivo', () => {
    expect(buildPdfFileName({ budgetNumber: 12, clientName: 'João da Água Verde' })).toBe(
      'Orcamento-TA-0012-Joao-da-Agua-Verde.pdf',
    );
  });

  it('funciona sem nome de cliente informado', () => {
    expect(buildPdfFileName({ budgetNumber: 3, clientName: '' })).toBe('Orcamento-TA-0003.pdf');
  });
});
