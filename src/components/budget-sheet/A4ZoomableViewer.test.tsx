import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { A4ZoomableViewer } from './A4ZoomableViewer';

beforeAll(() => {
  // jsdom não implementa ResizeObserver.
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
});

describe('A4ZoomableViewer', () => {
  it('renderiza o conteúdo e os controles de zoom sem quebrar', () => {
    render(
      <A4ZoomableViewer>
        <div data-testid="sheet-content">Folha</div>
      </A4ZoomableViewer>,
    );
    expect(screen.getByTestId('sheet-content')).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('o botão "+" aumenta o zoom exibido e "Ajustar" volta a 100%', () => {
    render(
      <A4ZoomableViewer>
        <div>Folha</div>
      </A4ZoomableViewer>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Aumentar zoom' }));
    expect(screen.getByText(/1[0-9]{2}%|[2-9][0-9]{2}%/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Ajustar' }));
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('o botão "-" começa desabilitado no zoom mínimo (100%)', () => {
    render(
      <A4ZoomableViewer>
        <div>Folha</div>
      </A4ZoomableViewer>,
    );
    const button = screen.getByRole('button', { name: 'Diminuir zoom' }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
