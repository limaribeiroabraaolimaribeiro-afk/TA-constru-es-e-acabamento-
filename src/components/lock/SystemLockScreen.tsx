import { COMPANY } from '../../constants/company';
import { SYSTEM_LOCK_INFO } from '../../constants/systemLock';
import { Logo } from '../ui/Logo';

/**
 * Tela exibida quando SYSTEM_BLOCKED (src/constants/systemLock.ts) está
 * ativo. Substitui todo o app — nenhuma rota/tela operacional é montada
 * enquanto esta tela é exibida (ver App.tsx).
 */
export function SystemLockScreen() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:max-w-md sm:p-8">
        <Logo className="mx-auto h-12 w-12 object-contain" />

        <div className="mx-auto mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-ta-cream">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-ta-gold-dark"
            aria-hidden="true"
          >
            <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
          </svg>
        </div>

        <h1 className="mt-4 text-lg font-bold tracking-tight text-ta-black sm:text-xl">
          SISTEMA TEMPORARIAMENTE BLOQUEADO
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Existe uma pendência financeira vinculada a este sistema.
          <br />
          Regularize o pagamento para restaurar o acesso às funcionalidades.
        </p>

        <div className="mt-5 rounded-xl bg-ta-black px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ta-gold-light">
            Valor pendente
          </p>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {SYSTEM_LOCK_INFO.pendingAmountLabel}
          </p>
        </div>

        <a
          href={SYSTEM_LOCK_INFO.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full rounded-xl bg-ta-gold-dark px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition-opacity active:opacity-90"
        >
          Pagar e desbloquear sistema
        </a>

        <p className="mt-4 text-xs text-neutral-400">{COMPANY.name}</p>
      </div>
    </div>
  );
}
