import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, type BudgetFormValues } from '../../utils/validation';
import { useBudgetStore } from '../../store/useBudgetStore';
import { Field } from '../ui/Field';
import { inputClass } from '../ui/inputStyles';
import { ItemsListEditor } from './ItemsListEditor';
import { TotalValueField } from './TotalValueField';
import { DateObservationFields } from './DateObservationFields';

export function BudgetForm() {
  const budget = useBudgetStore((state) => state.budget);
  const setBudget = useBudgetStore((state) => state.setBudget);

  const { register, control, watch } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: budget,
    mode: 'onBlur',
  });

  // Sincroniza cada alteração do formulário com o estado global (Zustand),
  // que já persiste automaticamente em localStorage (ver useBudgetStore.ts).
  useEffect(() => {
    const subscription = watch((values) => {
      setBudget({ ...(values as BudgetFormValues), updatedAt: new Date().toISOString() });
    });
    return () => subscription.unsubscribe();
  }, [watch, setBudget]);

  return (
    <form className="flex flex-col gap-6 p-4 pb-24">
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Cliente / Obra</h2>
        <Field label="Nome do cliente">
          <input {...register('clientName')} className={inputClass} placeholder="Ex: João Silva" />
        </Field>
      </section>

      <ItemsListEditor control={control} register={register} />
      <TotalValueField control={control} />
      <DateObservationFields register={register} />
    </form>
  );
}
