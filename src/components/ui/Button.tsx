import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-ta-black text-ta-gold-light hover:bg-ta-black-soft',
  ghost: 'bg-transparent text-ta-black border border-neutral-300 hover:bg-neutral-100',
};

export function Button({ variant = 'ghost', className, ...props }: ButtonProps) {
  return (
    <button
      className={`min-h-11 rounded-md px-4 text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASS[variant]} ${className ?? ''}`}
      {...props}
    />
  );
}
