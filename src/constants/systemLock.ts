/**
 * Ponto central de controle do bloqueio temporário do sistema por
 * pendência financeira.
 *
 * true  -> App renderiza somente <SystemLockScreen />; nenhuma tela
 *          operacional (formulário, visualização, PDF, histórico) fica
 *          acessível.
 * false -> sistema funciona normalmente, exatamente como antes.
 *
 * Não apaga nem altera dados: localStorage/histórico/backup permanecem
 * intactos independente deste valor — é apenas um bloqueio de interface,
 * verificado em um único lugar (src/App.tsx).
 */
export const SYSTEM_BLOCKED = true;

export const SYSTEM_LOCK_INFO = {
  pendingAmountLabel: 'R$ 175,00',
  paymentUrl:
    'https://limaribeiroabraaolimaribeiro-afk.github.io/Smart-Billingg/cobranca-publica.html?token=112e6d3b-9e46-403f-827f-5be670673854',
} as const;
