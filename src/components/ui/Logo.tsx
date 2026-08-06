import { useState } from 'react';
import { COMPANY } from '../../constants/company';

interface LogoProps {
  className?: string;
  /** Estilo de exibição: "normal" para o cabeçalho, "watermark" para a marca-d'água. */
  variant?: 'normal' | 'watermark';
}

/**
 * Renderiza o arquivo oficial da logo (public/logo-ta.png ou .svg, se fornecido
 * posteriormente). Não recria o desenho — apenas exibe o asset fornecido pela empresa.
 * Enquanto o arquivo não existir no projeto, mostra um placeholder para não quebrar o layout.
 */
export function Logo({ className, variant = 'normal' }: LogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-ta-gold-dark text-[10px] uppercase tracking-wide text-ta-gold-dark ${className ?? ''}`}
        role="img"
        aria-label={`Logo ${COMPANY.name} (arquivo ainda não adicionado)`}
      >
        Logo TA
      </div>
    );
  }

  return (
    <img
      src={COMPANY.logoPath}
      alt={variant === 'watermark' ? '' : COMPANY.name}
      aria-hidden={variant === 'watermark'}
      className={className}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
