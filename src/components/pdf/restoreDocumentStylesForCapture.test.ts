import { describe, expect, it } from 'vitest';
import { findBudgetSheet } from './generatePdf';
import { restoreDocumentStylesForCapture } from './restoreDocumentStylesForCapture';

describe('findBudgetSheet', () => {
  it('captura a folha interna, e não o wrapper usado na visualização', () => {
    const wrapper = document.createElement('div');
    const sheet = document.createElement('div');
    sheet.dataset.testid = 'budget-sheet-a4';
    wrapper.appendChild(sheet);
    expect(findBudgetSheet(wrapper)).toBe(sheet);
    expect(findBudgetSheet(sheet)).toBe(sheet);
  });

  it('não captura um elemento arbitrário sem folha A4', () => {
    expect(() => findBudgetSheet(document.createElement('div'))).toThrow('folha A4');
  });
});

describe('restoreDocumentStylesForCapture', () => {
  it('inclui as regras CSS já carregadas no documento clonado', () => {
    const style = document.createElement('style');
    style.textContent = '.pdf-a4-test { display: flex; flex-direction: column; }';
    document.head.appendChild(style);

    try {
      const css = restoreDocumentStylesForCapture.snapshot(document);
      expect(css).toContain('.pdf-a4-test');
      const cloned = document.implementation.createHTMLDocument('orçamento');
      restoreDocumentStylesForCapture.inject(cloned, css);
      expect(cloned.head.querySelector('[data-pdf-restored-styles]')?.textContent).toContain('.pdf-a4-test');
    } finally {
      style.remove();
    }
  });
});
