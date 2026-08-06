import { Controller, type Control } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { formatCurrencyDisplay, parseCurrencyInputToNumber } from '../../utils/currency';
import { Field } from '../ui/Field';
import { inputClass } from '../ui/inputStyles';

interface TotalValueFieldProps {
  control: Control<BudgetFormValues>;
}

export function TotalValueField({ control }: TotalValueFieldProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Valor total</h2>
      <Controller
        control={control}
        name="totalValue"
        render={({ field }) => (
          <Field label="R$">
            <input
              inputMode="numeric"
              className={inputClass}
              placeholder="R$ 0,00"
              value={field.value ? formatCurrencyDisplay(field.value) : ''}
              onChange={(event) => field.onChange(parseCurrencyInputToNumber(event.target.value))}
              onBlur={field.onBlur}
            />
          </Field>
        )}
      />
    </section>
  );
}
