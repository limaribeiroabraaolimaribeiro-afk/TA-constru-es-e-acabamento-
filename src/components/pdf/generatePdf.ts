import { A4_WIDTH_MM, A4_HEIGHT_MM } from '../../utils/a4';

/** Escala de captura do html2canvas — resolução alta para impressão/PDF nítido. */
const CAPTURE_SCALE = 3;
/** Tolerância em px para o teste de overflow, absorvendo arredondamentos de layout. */
const OVERFLOW_TOLERANCE_PX = 2;

export class PdfOverflowError extends Error {
  constructor() {
    super('O conteúdo do orçamento ultrapassa os limites da folha A4.');
    this.name = 'PdfOverflowError';
  }
}

/**
 * Verifica se algum trecho de conteúdo ultrapassa a altura disponível:
 *
 * 1. A folha como um todo (`scrollHeight` reflete a altura real do conteúdo
 *    mesmo com `overflow: hidden`) — cobre o caso de uma observação muito
 *    longa empurrar o rodapé para fora da página.
 * 2. O texto da descrição especificamente, comparando sua posição+altura
 *    reais contra o espaço disponível dentro da caixa. Não usamos o
 *    `scrollHeight` da caixa de descrição em si porque a marca-d'água sangra
 *    intencionalmente para fora dela (bottom/right negativos) — isso infla o
 *    `scrollHeight` do container sem representar overflow de conteúdo real.
 */
export function checkSheetOverflow(sheetElement: HTMLElement): boolean {
  if (sheetElement.scrollHeight > sheetElement.clientHeight + OVERFLOW_TOLERANCE_PX) {
    return true;
  }

  const descriptionWrap = sheetElement.querySelector<HTMLElement>('[data-testid="budget-description-wrap"]');
  const descriptionText = sheetElement.querySelector<HTMLElement>('[data-testid="budget-description-text"]');
  if (descriptionWrap && descriptionText) {
    const textBottom = descriptionText.offsetTop + descriptionText.offsetHeight;
    if (textBottom > descriptionWrap.clientHeight + OVERFLOW_TOLERANCE_PX) {
      return true;
    }
  }

  return false;
}

async function waitForFonts(): Promise<void> {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    await document.fonts.ready;
  }
}

/** Aguarda o carregamento (ou falha) de todas as imagens dentro do elemento, incluindo a logo. */
function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  const pending = images.filter((img) => !img.complete);
  if (pending.length === 0) return Promise.resolve();

  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
        }),
    ),
  ).then(() => undefined);
}

/** Aguarda dois frames de animação, garantindo que o layout já refletiu fontes/imagens carregadas. */
function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/**
 * Troca temporariamente o `src` de cada `<img>` já carregada por um
 * `data:` URL com os mesmos pixels (via canvas), e devolve uma função para
 * restaurar o `src` original depois da captura.
 *
 * Necessário porque o html2canvas clona o documento (num iframe) para
 * capturá-lo, e esse clone reabre cada imagem pela rede em vez de
 * reaproveitar a que já está carregada na página. Offline, mesmo com a
 * imagem em cache do Service Worker (a própria tela mostra a logo
 * normalmente), esse re-fetch do html2canvas falha com
 * ERR_INTERNET_DISCONNECTED e a logo sai em branco no PDF. Um `data:` URL
 * não depende de rede nenhuma, então elimina o problema por completo.
 */
async function inlineLoadedImagesAsDataUrls(container: HTMLElement): Promise<() => void> {
  const images = Array.from(container.querySelectorAll('img'));
  const restores: Array<() => void> = [];

  await Promise.all(
    images.map(async (img) => {
      if (!img.complete || img.naturalWidth === 0 || img.src.startsWith('data:')) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        const originalSrc = img.src;

        await new Promise<void>((resolve) => {
          img.addEventListener('load', () => resolve(), { once: true });
          img.addEventListener('error', () => resolve(), { once: true });
          img.src = dataUrl;
        });

        restores.push(() => {
          img.src = originalSrc;
        });
      } catch {
        // Não foi possível ler os pixels (ex.: imagem de outra origem sem CORS) —
        // mantém o src original e deixa o html2canvas tentar do jeito normal.
      }
    }),
  );

  return () => {
    for (const restore of restores) restore();
  };
}

export interface GeneratePdfResult {
  blob: Blob;
  fileName: string;
}

/**
 * Gera um PDF de página única (A4, 210mm x 297mm) a partir do elemento da
 * folha, idêntico à visualização em tela. Lança PdfOverflowError se o
 * conteúdo ultrapassar a folha, sem gerar um PDF cortado/distorcido.
 */
export async function generateBudgetPdf(sheetElement: HTMLElement, fileName: string): Promise<GeneratePdfResult> {
  await waitForFonts();
  await waitForImages(sheetElement);
  await waitForNextPaint();

  if (checkSheetOverflow(sheetElement)) {
    throw new PdfOverflowError();
  }

  // Import dinâmico: html2canvas + jsPDF só são baixados quando o usuário
  // realmente gera um PDF, evitando inflar o bundle inicial do app (mobile-first).
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const restoreImages = await inlineLoadedImagesAsDataUrls(sheetElement);
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(sheetElement, {
      scale: CAPTURE_SCALE,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: sheetElement.offsetWidth,
      height: sheetElement.offsetHeight,
      windowWidth: sheetElement.offsetWidth,
      windowHeight: sheetElement.offsetHeight,
    });
  } finally {
    restoreImages();
  }

  const imageData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
  pdf.addImage(imageData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');

  const blob = pdf.output('blob');
  return { blob, fileName };
}
