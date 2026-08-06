/**
 * Tokens visuais do documento (folha A4), espelhando as variáveis definidas
 * em src/index.css (@theme). Mantidos também em TS para uso fora de CSS,
 * como no motor de geração de PDF (Etapa 2).
 */
export const THEME = {
  colors: {
    black: '#141210',
    blackSoft: '#1c1a17',
    gold: '#c9a227',
    goldLight: '#d4af37',
    goldDark: '#a9861f',
    cream: '#f7f5f0',
    creamLine: '#b0aea8',
    grayText: '#6b6b6b',
  },
  /** Proporção fixa da folha A4 (210mm x 297mm). */
  a4: {
    widthMm: 210,
    heightMm: 297,
  },
} as const;
