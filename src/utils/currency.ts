const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/**
 * Formata uma sequência de dígitos digitados (ex.: "123456") como moeda
 * brasileira (ex.: "R$ 1.234,56"), tratando os dois últimos dígitos como centavos.
 * Usado para mascarar o campo "Valor Total" enquanto o usuário digita.
 */
export function formatCurrencyInput(rawDigits: string): string {
  const digitsOnly = rawDigits.replace(/\D/g, '');
  if (!digitsOnly) return '';
  const cents = Number(digitsOnly);
  return BRL_FORMATTER.format(cents / 100);
}

/** Extrai apenas os dígitos de um valor já formatado, para reconstruir o estado. */
export function extractDigits(formatted: string): string {
  return formatted.replace(/\D/g, '');
}
