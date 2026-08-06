import type { UseFormRegister } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { Field } from '../ui/Field';
import { inputClass, textareaClass } from '../ui/inputStyles';

interface DateObservationFieldsProps {
  register: UseFormRegister<BudgetFormValues>;
}

export function DateObservationFields({ register }: DateObservationFieldsProps) {
  return (
    <section className="flex flex-col gap-3">
      <Field label="Data">
        <input type="date" {...register('date')} className={inputClass} />
      </Field>
      <Field label="Observação">
        <textarea {...register('observation')} className={textareaClass} rows={3} />
      </Field>
    </section>
  );
}
