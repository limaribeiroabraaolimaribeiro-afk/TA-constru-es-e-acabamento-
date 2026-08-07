import { describe, it, expect } from 'vitest';
import { checkSheetOverflow } from './generatePdf';

function setClientDims(el: HTMLElement, scrollHeight: number, clientHeight: number) {
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: clientHeight, configurable: true });
}

function setOffset(el: HTMLElement, offsetTop: number, offsetHeight: number) {
  Object.defineProperty(el, 'offsetTop', { value: offsetTop, configurable: true });
  Object.defineProperty(el, 'offsetHeight', { value: offsetHeight, configurable: true });
}

function buildSheet({
  sheetScroll = 1122,
  sheetClient = 1122,
  wrapClient = 700,
  textOffsetTop = 20,
  textOffsetHeight = 400,
}: Partial<{
  sheetScroll: number;
  sheetClient: number;
  wrapClient: number;
  textOffsetTop: number;
  textOffsetHeight: number;
}> = {}) {
  const sheet = document.createElement('div');
  setClientDims(sheet, sheetScroll, sheetClient);

  const descriptionWrap = document.createElement('div');
  descriptionWrap.dataset.testid = 'budget-description-wrap';
  setClientDims(descriptionWrap, 0, wrapClient);
  sheet.appendChild(descriptionWrap);

  const descriptionText = document.createElement('div');
  descriptionText.dataset.testid = 'budget-description-text';
  setOffset(descriptionText, textOffsetTop, textOffsetHeight);
  descriptionWrap.appendChild(descriptionText);

  return sheet;
}

describe('checkSheetOverflow', () => {
  it('retorna false quando o texto cabe dentro da área de descrição', () => {
    const sheet = buildSheet({ wrapClient: 700, textOffsetTop: 20, textOffsetHeight: 400 });
    expect(checkSheetOverflow(sheet)).toBe(false);
  });

  it('retorna true quando a folha como um todo excede a altura disponível (ex.: observação muito longa)', () => {
    const sheet = buildSheet({ sheetScroll: 1200, sheetClient: 1122 });
    expect(checkSheetOverflow(sheet)).toBe(true);
  });

  it('retorna true quando o texto da descrição ultrapassa a altura da caixa', () => {
    const sheet = buildSheet({ wrapClient: 700, textOffsetTop: 20, textOffsetHeight: 900 });
    expect(checkSheetOverflow(sheet)).toBe(true);
  });

  it('ignora a marca-d’água que sangra para fora da caixa (não deve gerar falso positivo)', () => {
    // A marca-d'água tem posição absoluta com bottom/right negativos, o que infla o
    // scrollHeight do container mesmo sem overflow real de texto — por isso a checagem
    // não usa mais o scrollHeight da própria caixa de descrição.
    const sheet = buildSheet({ wrapClient: 539, textOffsetTop: 20, textOffsetHeight: 30 });
    const descriptionWrap = sheet.querySelector('[data-testid="budget-description-wrap"]') as HTMLElement;
    setClientDims(descriptionWrap, 569, 539); // scrollHeight > clientHeight só por causa do bleed
    expect(checkSheetOverflow(sheet)).toBe(false);
  });

  it('ignora pequenas diferenças de arredondamento (tolerância)', () => {
    const sheet = buildSheet({ sheetScroll: 1123, sheetClient: 1122 });
    expect(checkSheetOverflow(sheet)).toBe(false);
  });
});
