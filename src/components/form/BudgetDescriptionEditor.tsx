import type { UseFormRegister } from 'react-hook-form';
import type { BudgetFormValues } from '../../utils/validation';
import { DESCRIPTION_TYPE_OPTIONS } from '../../constants/descriptionTypes';
import { Field } from '../ui/Field';
import { inputClass, textareaClass } from '../ui/inputStyles';

interface BudgetDescriptionEditorProps {
  register: UseFormRegister<BudgetFormValues>;
}

/**
 * Seletor de tipo de descrição + área de texto livre única, aceitando
 * múltiplas linhas e parágrafos (sem lista de itens estruturada). O tipo
 * só troca qual título é impresso na folha (ver getDescriptionTypeTitle) —
 * nunca preenche nem apaga o texto já digitado.
 */
export function BudgetDescriptionEditor({ register }: BudgetDescriptionEditorProps) {
  return (
    <section className="flex flex-col gap-3">
      <Field label="Tipo de descrição">
        <select {...register('descriptionType')} className={inputClass}>
          {DESCRIPTION_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
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
