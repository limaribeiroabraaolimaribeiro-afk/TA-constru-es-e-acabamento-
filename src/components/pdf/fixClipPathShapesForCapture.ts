/**
 * O html2canvas 1.4.1 (usado para gerar o PDF) não suporta a propriedade CSS
 * `clip-path` — confirmado no código-fonte da própria lib, que não tem
 * nenhuma menção a "clip-path" ou "polygon" em todo o bundle. Um elemento
 * com clip-path sai no PDF como o retângulo cheio, sem nenhum recorte; no
 * cabeçalho isso faz o painel preto (clip-path em forma de seta) cobrir a
 * folha inteira, escondendo a logo, o fundo branco e o chevron dourado.
 *
 * Esta função só roda dentro do `onclone` do html2canvas — atua apenas na
 * cópia do DOM usada para capturar o PDF, nunca na tela do app. Para cada
 * elemento marcado com [data-pdf-clip-shape], ela:
 *   1. remove o background do próprio elemento (que sairia como um
 *      retângulo cheio, sem o recorte);
 *   2. insere um <svg><polygon> com a mesma geometria do clip-path
 *      original. html2canvas sabe desenhar <svg> corretamente — ele
 *      serializa o elemento inteiro para uma imagem e deixa o próprio
 *      navegador rasterizar, sem passar pelo motor de CSS limitado da lib.
 */

interface GradientStop {
  color: string;
  offsetPercent: number;
}

type ShapeFill = { type: 'solid'; color: string } | { type: 'linear'; angleDeg: number; stops: GradientStop[] };

interface ClipShapeSpec {
  /** Mesmos pontos do clip-path: polygon(...) original, convertidos de "X% Y%" para "X,Y". */
  points: string;
  fill: ShapeFill;
}

// Cores e geometria copiadas literalmente de BudgetSheetA4.module.css
// (.headerGoldRibbon, .headerBlackPanel, .headerWedge) — não usar var(...)
// aqui: html2canvas serializa o <svg> como um documento isolado, sem acesso
// às variáveis CSS do :root.
const SHAPES: Record<string, ClipShapeSpec> = {
  'header-gold-ribbon': {
    points: '47,0 51,0 62,65 55,100 52,100 60,65',
    fill: {
      type: 'linear',
      angleDeg: 160,
      stops: [
        { color: '#d4af37', offsetPercent: 0 },
        { color: '#c9a227', offsetPercent: 45 },
        { color: '#a9861f', offsetPercent: 100 },
      ],
    },
  },
  'header-black-panel': {
    points: '51,0 100,0 100,100 55,100 62,65',
    fill: { type: 'solid', color: '#141210' },
  },
  'header-wedge': {
    points: '100,0 100,100 0,100',
    fill: {
      type: 'linear',
      angleDeg: 135,
      stops: [
        { color: '#d4af37', offsetPercent: 0 },
        { color: '#a9861f', offsetPercent: 100 },
      ],
    },
  },
};

/** Converte um ângulo de CSS linear-gradient (0deg = "to top") num vetor x1,y1,x2,y2 (0–1). */
function angleToGradientVector(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  return { x1: 0.5 - dx / 2, y1: 0.5 - dy / 2, x2: 0.5 + dx / 2, y2: 0.5 + dy / 2 };
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export function fixClipPathShapesForCapture(container: ParentNode): void {
  const doc = container instanceof Document ? container : container.ownerDocument;
  if (!doc) return;

  container.querySelectorAll<HTMLElement>('[data-pdf-clip-shape]').forEach((el) => {
    const key = el.getAttribute('data-pdf-clip-shape');
    const spec = key ? SHAPES[key] : undefined;
    if (!spec) return;

    el.style.background = 'none';
    el.style.backgroundImage = 'none';

    const svg = doc.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.display = 'block';

    const polygon = doc.createElementNS(SVG_NS, 'polygon');
    polygon.setAttribute('points', spec.points);

    if (spec.fill.type === 'solid') {
      polygon.setAttribute('fill', spec.fill.color);
    } else {
      const gradientId = `pdf-clip-grad-${key}`;
      const defs = doc.createElementNS(SVG_NS, 'defs');
      const gradient = doc.createElementNS(SVG_NS, 'linearGradient');
      gradient.setAttribute('id', gradientId);
      const { x1, y1, x2, y2 } = angleToGradientVector(spec.fill.angleDeg);
      gradient.setAttribute('x1', String(x1));
      gradient.setAttribute('y1', String(y1));
      gradient.setAttribute('x2', String(x2));
      gradient.setAttribute('y2', String(y2));
      for (const stop of spec.fill.stops) {
        const stopEl = doc.createElementNS(SVG_NS, 'stop');
        stopEl.setAttribute('offset', `${stop.offsetPercent}%`);
        stopEl.setAttribute('stop-color', stop.color);
        gradient.appendChild(stopEl);
      }
      defs.appendChild(gradient);
      svg.appendChild(defs);
      polygon.setAttribute('fill', `url(#${gradientId})`);
    }

    svg.appendChild(polygon);
    el.appendChild(svg);
  });
}
