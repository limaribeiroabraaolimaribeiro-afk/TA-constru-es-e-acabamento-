import { useEffect, useRef, useState, type ReactNode } from 'react';
import { A4_WIDTH_PX, A4_HEIGHT_PX } from '../../utils/a4';

interface A4ScaledPreviewProps {
  children: ReactNode;
}

/**
 * Escala a folha A4 (tamanho físico fixo) inteira para caber na largura
 * disponível — usada na visualização mobile. O layout interno da folha
 * nunca reflui: apenas o wrapper aplica transform: scale().
 */
export function A4ScaledPreview({ children }: A4ScaledPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? container.clientWidth;
      setScale(width / A4_WIDTH_PX);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: A4_HEIGHT_PX * scale }}>
      <div
        style={{
          width: A4_WIDTH_PX,
          height: A4_HEIGHT_PX,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children}
      </div>
    </div>
  );
}
