/** Converte data ISO (yyyy-mm-dd) para o formato exibido na folha (dd/mm/aaaa). */
export function formatDateBr(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';
  return `${day}/${month}/${year}`;
}

/** Data de hoje no formato ISO (yyyy-mm-dd), usada como valor padrão do formulário. */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Formata um timestamp ISO completo (ex.: updatedAt) como "dd/mm/aaaa hh:mm". */
export function formatDateTimeBr(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = date.toLocaleDateString('pt-BR');
  const timePart = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${datePart} ${timePart}`;
}
