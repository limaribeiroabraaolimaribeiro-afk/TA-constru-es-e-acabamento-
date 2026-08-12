import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BudgetSheetA4 } from './BudgetSheetA4';
import type { BudgetData } from '../../types/budget';

function makeBudget(overrides: Partial<BudgetData> = {}): BudgetData {
  const now = new Date().toISOString();
  return {
    id: 'test-id',
    budgetNumber: 1,
    clientName: 'Maria Souza',
    clientPhone: '(47) 98888-7777',
    workAddress: 'Rua das Flores, 45',
    showClientData: false,
    descriptionType: 'labor_material',
    description: 'Linha 1\nLinha 2',
    totalValue: 1500,
    date: '2026-08-06',
    validity: 7,
    observation: 'Observação de teste',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('BudgetSheetA4', () => {
  it('exibe o número do orçamento formatado com 4 dígitos', () => {
    render(<BudgetSheetA4 budget={makeBudget({ budgetNumber: 7 })} />);
    expect(screen.getByText(/ORÇAMENTO Nº 0007/)).toBeTruthy();
  });

  it('não exibe o bloco de cliente quando showClientData é falso', () => {
    render(<BudgetSheetA4 budget={makeBudget({ showClientData: false })} />);
    expect(screen.queryByText('CLIENTE')).toBeNull();
    expect(screen.queryByText('Maria Souza')).toBeNull();
  });

  it('exibe cliente, telefone e local da obra quando showClientData é verdadeiro', () => {
    render(<BudgetSheetA4 budget={makeBudget({ showClientData: true })} />);
    expect(screen.getByText('CLIENTE')).toBeTruthy();
    expect(screen.getByText('Maria Souza')).toBeTruthy();
    expect(screen.getByText('TELEFONE')).toBeTruthy();
    expect(screen.getByText('(47) 98888-7777')).toBeTruthy();
    expect(screen.getByText('LOCAL DA OBRA')).toBeTruthy();
    expect(screen.getByText('Rua das Flores, 45')).toBeTruthy();
  });

  it('preserva quebras de linha da descrição', () => {
    render(<BudgetSheetA4 budget={makeBudget({ description: 'Primeira linha\nSegunda linha' })} />);
    expect(screen.getByTestId('budget-description-text').textContent).toBe('Primeira linha\nSegunda linha');
  });

  it('formata o valor total em Real brasileiro', () => {
    render(<BudgetSheetA4 budget={makeBudget({ totalValue: 18500 })} />);
    expect(screen.getByText(/18\.500,00/)).toBeTruthy();
  });

  it('exibe data e validade a partir do estado do orçamento', () => {
    render(<BudgetSheetA4 budget={makeBudget({ date: '2026-08-06', validity: 15 })} />);
    expect(screen.getByText('06/08/2026')).toBeTruthy();
    expect(screen.getByText(/Validade: 15 dias/)).toBeTruthy();
  });

  it('imprime o título correspondente a cada tipo de descrição', () => {
    render(<BudgetSheetA4 budget={makeBudget({ descriptionType: 'labor' })} />);
    expect(screen.getByText('DESCRIÇÃO MÃO DE OBRA')).toBeTruthy();
  });

  it('imprime o título de mão de obra e material', () => {
    render(<BudgetSheetA4 budget={makeBudget({ descriptionType: 'labor_material' })} />);
    expect(screen.getByText('DESCRIÇÃO MÃO DE OBRA E MATERIAL')).toBeTruthy();
  });

  it('imprime o título de pagamento — etapas e entradas', () => {
    render(<BudgetSheetA4 budget={makeBudget({ descriptionType: 'payment' })} />);
    expect(screen.getByText('DESCRIÇÃO PAGAMENTO — ETAPAS E ENTRADAS')).toBeTruthy();
  });

  it('usa o título de mão de obra e material como fallback para orçamentos antigos sem o campo', () => {
    const budget = makeBudget();
    // @ts-expect-error -- simula um orçamento salvo antes deste campo existir
    delete budget.descriptionType;
    render(<BudgetSheetA4 budget={budget} />);
    expect(screen.getByText('DESCRIÇÃO MÃO DE OBRA E MATERIAL')).toBeTruthy();
  });
});
