import type { SVGProps } from 'react';

/**
 * Ícones de linha genéricos (pessoa, telefone, pin, envelope, calendário,
 * documento, cifrão). Não têm relação com a logo oficial da empresa —
 * são pictogramas utilitários recriados em SVG, coloridos via currentColor.
 */
const baseProps: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconPerson(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

export function IconPhone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M5 4h3.2l1.3 4.5-2 1.6a12.5 12.5 0 0 0 6.4 6.4l1.6-2 4.5 1.3V19a2 2 0 0 1-2.2 2C10.9 20.6 3.4 13.1 3 6.2A2 2 0 0 1 5 4Z" />
    </svg>
  );
}

export function IconPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 21s7-6.3 7-11.5A7 7 0 0 0 5 9.5C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function IconEnvelope(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.4" />
      <path d="M4 6.5 12 13l8-6.5" />
    </svg>
  );
}

export function IconCalendar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.4" />
      <path d="M3.5 9.5h17M8 3v3.4M16 3v3.4" />
    </svg>
  );
}

export function IconDocument(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6.5 3.5h8l3 3V20a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M9 12h6M9 15.5h6" />
    </svg>
  );
}

export function IconWhatsapp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.02 2C6.5 2 2.03 6.46 2.03 11.98c0 1.88.51 3.63 1.4 5.14L2 22l5.03-1.4a9.96 9.96 0 0 0 4.99 1.34c5.52 0 9.99-4.46 9.99-9.98C22 6.46 17.54 2 12.02 2Zm5.85 14.24c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.26-.28.57-.35.76-.35h.55c.18 0 .41-.07.64.49.24.57.81 1.98.88 2.13.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.29.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.44.2.51.31.07.12.07.66-.17 1.34Z" />
    </svg>
  );
}

export function IconCoin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M9.7 9.6c0-1 .9-1.7 2.3-1.7 1.5 0 2.3.8 2.3 1.7 0 2.2-4.6 1.3-4.6 3.6 0 1 .9 1.8 2.3 1.8 1.5 0 2.4-.7 2.4-1.8" />
    </svg>
  );
}
