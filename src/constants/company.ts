/**
 * Dados fixos da empresa, extraídos do papel timbrado oficial.
 * Usados no cabeçalho da folha A4 (Etapa 2) — não editáveis pelo formulário.
 */
export const COMPANY = {
  name: 'TA Construções e Acabamento',
  cnpj: '46.539.617/0001-80',
  phone: '47 9 99282-7227',
  phoneContactName: 'TIAGO',
  whatsapp: '5547992827227',
  address: {
    street: 'Rua Henrique Nagel, 190',
    neighborhood: 'Água Verde',
    zipCode: 'CP 89254560',
  },
  email: 'porcelanatofino0510@gmail.com',
  tagline: 'DO PROJETO AO DETALHE, ENTREGAMOS QUALIDADE.',
  /** Validade padrão (em dias) sugerida para um novo orçamento — campo estruturado `validity`. */
  defaultValidityDays: 7,
  /** Caminho público do arquivo oficial da logo. Ver src/components/ui/Logo.tsx. */
  logoPath: '/logo-ta.png',
} as const;
