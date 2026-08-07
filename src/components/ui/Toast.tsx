import { useEffect } from 'react';
import { useToastStore } from '../../store/useToastStore';

const AUTO_HIDE_MS = 2600;

/** Feedback visual global — renderizado uma única vez em App.tsx. */
export function Toast() {
  const message = useToastStore((state) => state.message);
  const variant = useToastStore((state) => state.variant);
  const hide = useToastStore((state) => state.hide);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hide, AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [message, hide]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4"
    >
      <div
        className={`pointer-events-auto rounded-full px-4 py-2 text-center text-sm font-semibold text-white shadow-lg ${
          variant === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
