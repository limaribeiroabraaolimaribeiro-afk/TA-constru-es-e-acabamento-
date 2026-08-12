import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { BudgetDescriptionEditor } from './BudgetDescriptionEditor';

function Wrapper() {
  const { register } = useForm<BudgetFormValues>({
    defaultValues: { descriptionType: 'labor_material', description: '' } as Partial<BudgetFormValues>,
  });
  return <BudgetDescriptionEditor register={register} />;
}

describe('BudgetDescriptionEditor', () => {
  it('mostra as três opções de tipo de descrição, com os rótulos exatos pedidos', () => {
    render(<Wrapper />);
    const select = screen.getByLabelText('Tipo de descrição') as HTMLSelectElement;
    const optionLabels = Array.from(select.options).map((option) => option.textContent);

    expect(optionLabels).toEqual([
      'Descrição mão de obra',
      'Descrição mão de obra e material',
      'Descrição pagamento — etapas e entradas',
    ]);
  });

  it('trocar o tipo de descrição não apaga nem preenche automaticamente o texto já digitado', () => {
    render(<Wrapper />);

    const textarea = screen.getByLabelText('Descrição') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Foi feito reboco\nSubido parede\nMontado blocos' } });

    const select = screen.getByLabelText('Tipo de descrição');
    fireEvent.change(select, { target: { value: 'payment' } });

    expect(textarea.value).toBe('Foi feito reboco\nSubido parede\nMontado blocos');
  });
});
