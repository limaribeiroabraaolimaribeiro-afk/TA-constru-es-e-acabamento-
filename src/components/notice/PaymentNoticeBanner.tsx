import { useState } from 'react';
import { PAYMENT_NOTICE_ACTIVE, PAYMENT_NOTICE_INFO } from '../../constants/paymentNotice';

const DISMISS_KEY = 'ta-payment-notice-dismissed';

/**
 * Card de aviso — não bloqueante — logo abaixo do cabeçalho. Some ao fechar
 * (sessionStorage: só nesta sessão/aba) e volta a aparecer da próxima vez
 * que o app for aberto, enquanto PAYMENT_NOTICE_ACTIVE estiver true.
 */
export function PaymentNoticeBanner() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === '1');

  if (!PAYMENT_NOTICE_ACTIVE || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div
      role="status"
      className="mx-3 mt-3 rounded-xl border border-ta-gold-light/40 bg-ta-cream px-3.5 py-3"
    >
      <div className="flex items-start gap-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-5 w-5 shrink-0 text-ta-gold-dark"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z" />
          <path d="M12 9v4" />
          <path d="M12 16.5h.01" />
        </svg>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold tracking-tight text-ta-black">PAGAMENTO PENDENTE</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
            Existe uma parcela pendente referente ao sistema.
          </p>
          <p className="mt-1.5 text-sm font-bold text-ta-black">{PAYMENT_NOTICE_INFO.pendingAmountLabel}</p>

          <div className="mt-2.5 flex items-center gap-2">
            <a
              href={PAYMENT_NOTICE_INFO.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-9 rounded-lg bg-ta-gold-dark px-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-opacity active:opacity-90 flex items-center"
            >
              Pagar parcela
            </a>
            <button
              type="button"
              onClick={handleDismiss}
              className="min-h-9 rounded-lg px-3 text-xs font-semibold text-neutral-500"
            >
              Agora não
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fechar aviso"
          className="-mr-1 -mt-1 min-h-9 min-w-9 shrink-0 rounded-md text-lg text-neutral-400"
        >
          ×
        </button>
      </div>
    </div>
  );
}
