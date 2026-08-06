const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/** Formata um número (reais) como moeda brasileira (ex.: 1500 -> "R$ 1.500,00"). */
export function formatCurrencyDisplay(value: number): string {
  return BRL_FORMATTER.format(value);
}

/**
 * Converte a entrada digitada pelo usuário (ex.: "150000" ou "R$ 1.500,00")
 * em um número de reais, tratando os dois últimos dígitos como centavos.
 * Usado para mascarar o campo "Valor Total" enquanto o usuário digita.
 */
export function parseCurrencyInputToNumber(rawInput: string): number {
  const digitsOnly = rawInput.replace(/\D/g, '');
  if (!digitsOnly) return 0;
  return Number(digitsOnly) / 100;
}
