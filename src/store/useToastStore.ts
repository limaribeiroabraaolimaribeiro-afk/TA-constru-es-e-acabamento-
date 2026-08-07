import { create } from 'zustand';

export type ToastVariant = 'success' | 'error';

interface ToastState {
  message: string | null;
  variant: ToastVariant;
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
}

/** Feedback visual global (salvo, duplicado, excluído, erro) — ver src/components/ui/Toast.tsx. */
export const useToastStore = create<ToastState>((set) => ({
  message: null,
  variant: 'success',
  show: (message, variant = 'success') => set({ message, variant }),
  hide: () => set({ message: null }),
}));
