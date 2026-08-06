import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, type BudgetFormValues } from '../../utils/validation';
import { useBudgetStore } from '../../store/useBudgetStore';
import { Field } from '../ui/Field';
import { inputClass, textareaClass } from '../ui/inputStyles';
import { BudgetDescriptionEditor } from './BudgetDescriptionEditor';
import { TotalValueField } from './TotalValueField';

export function BudgetForm() {
  const draft = useBudgetStore((state) => state.draft);
  const updateDraft = useBudgetStore((state) => state.updateDraft);

  const { register, control, watch } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: draft,
    mode: 'onBlur',
  });

  // Sincroniza cada alteração do formulário com o rascunho no estado global
  // (Zustand), que persiste automaticamente em localStorage (chave ta-budget-draft).
  useEffect(() => {
    const subscription = watch((values) => {
      updateDraft(values as BudgetFormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateDraft]);

  return (
    <form className="flex flex-col gap-6 p-4 pb-24">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Cliente / Obra</h2>
        <Field label="Nome do cliente">
          <input {...register('clientName')} className={inputClass} placeholder="Ex: João Silva" />
        </Field>
        <Field label="Telefone do cliente">
          <input
            {...register('clientPhone')}
            className={inputClass}
            type="tel"
            placeholder="Ex: (47) 99999-9999"
          />
        </Field>
        <Field label="Endereço da obra">
          <input {...register('workAddress')} className={inputClass} placeholder="Ex: Rua Exemplo, 123" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" {...register('showClientData')} className="h-4 w-4" />
          Exibir dados do cliente no orçamento
        </label>
      </section>

      <BudgetDescriptionEditor register={register} />
      <TotalValueField control={control} />

      <section className="flex flex-col gap-3">
        <Field label="Data">
          <input type="date" {...register('date')} className={inputClass} />
        </Field>
        <Field label="Validade (dias)">
          <input
            type="number"
            min={0}
            {...register('validity', { valueAsNumber: true })}
            className={inputClass}
          />
        </Field>
        <Field label="Observação">
          <textarea {...register('observation')} className={textareaClass} rows={3} />
        </Field>
      </section>
    </form>
  );
}
