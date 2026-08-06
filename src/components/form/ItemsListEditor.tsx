import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { createId } from '../../utils/id';
import { Button } from '../ui/Button';
import { inputClass } from '../ui/inputStyles';

interface ItemsListEditorProps {
  control: Control<BudgetFormValues>;
  register: UseFormRegister<BudgetFormValues>;
}

export function ItemsListEditor({ control, register }: ItemsListEditorProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Descrição mão de obra e material
        </h2>
        <Button type="button" onClick={() => append({ id: createId(), description: '' })}>
          + Linha
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right text-xs text-neutral-400">{index + 1}</span>
            <input
              {...register(`items.${index}.description`)}
              className={inputClass}
              placeholder="Descreva o serviço ou material"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              className="shrink-0 rounded-md p-2 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30"
              aria-label="Remover linha"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
