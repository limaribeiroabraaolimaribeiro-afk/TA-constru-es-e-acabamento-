import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Aviso discreto de nova versão disponível. O service worker é registrado
 * com registerType: 'prompt' (ver vite.config.ts) — a nova versão fica
 * esperando em segundo plano até o usuário tocar em "Atualizar"; nunca
 * substitui a página sozinha enquanto alguém está preenchendo um orçamento.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: (error) => {
      console.error('Falha ao registrar o service worker do PWA', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 bg-ta-black px-4 py-2.5 text-sm text-white"
      style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top))' }}
    >
      <span>Nova versão disponível</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => updateServiceWorker(true)}
          className="min-h-9 rounded-md bg-ta-gold-light px-3 text-xs font-semibold text-ta-black"
        >
          Atualizar
        </button>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          aria-label="Fechar aviso"
          className="min-h-9 min-w-9 rounded-md text-lg text-white/70"
        >
          ×
        </button>
      </div>
    </div>
  );
}
