import type { UseFormRegister } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { Field } from '../ui/Field';
import { textareaClass } from '../ui/inputStyles';

interface BudgetDescriptionEditorProps {
  register: UseFormRegister<BudgetFormValues>;
}

/**
 * Área de texto livre única para "Descrição mão de obra e material",
 * aceitando múltiplas linhas e parágrafos (sem lista de itens estruturada).
 */
export function BudgetDescriptionEditor({ register }: BudgetDescriptionEditorProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
        Descrição mão de obra e material
      </h2>
      <Field label="Descrição">
        <textarea
          {...register('description')}
          className={`${textareaClass} min-h-64`}
          rows={14}
          placeholder={
            'Descreva os serviços e materiais do orçamento.\n\nEx.:\nReboco e pintura da fachada\nInstalação de porcelanato 60x60\nMão de obra elétrica completa'
          }
        />
      </Field>
    </section>
  );
}
