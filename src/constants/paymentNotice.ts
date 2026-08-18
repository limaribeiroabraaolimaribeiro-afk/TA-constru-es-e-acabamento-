/**
 * Ponto central de controle do aviso (não bloqueante) de parcela pendente.
 *
 * true  -> PaymentNoticeBanner pode aparecer (sujeito a ter sido fechado
 *          nesta sessão — ver sessionStorage em PaymentNoticeBanner.tsx);
 *          o sistema continua funcionando normalmente por trás dele.
 * false -> aviso desaparece completamente, em qualquer sessão.
 *
 * Não bloqueia nem altera dados: é só um aviso de interface.
 */
export const PAYMENT_NOTICE_ACTIVE = true;

export const PAYMENT_NOTICE_INFO = {
  pendingAmountLabel: 'R$ 175,00',
  paymentUrl:
    'https://limaribeiroabraaolimaribeiro-afk.github.io/Smart-Billingg/cobranca-publica.html?token=112e6d3b-9e46-403f-827f-5be670673854',
} as const;
