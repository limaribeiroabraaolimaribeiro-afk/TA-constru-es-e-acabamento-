import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { A4_WIDTH_PX, A4_HEIGHT_PX } from '../../utils/a4';

interface A4ZoomableViewerProps {
  children: ReactNode;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

interface Point {
  x: number;
  y: number;
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Pré-visualização responsiva da folha A4 com zoom (pinça no celular, roda do
 * mouse no desktop, botões +/-) e navegação por arraste. O tamanho físico da
 * folha (210mm x 297mm) e seu layout interno (BudgetSheetA4) nunca são
 * alterados — apenas a escala/posição de exibição do wrapper.
 */
export function A4ZoomableViewer({ children }: A4ZoomableViewerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  zoomRef.current = zoom;
  panRef.current = pan;

  const gestureRef = useRef<{
    mode: 'none' | 'pan' | 'pinch';
    startZoom: number;
    startPan: Point;
    startTouch: Point;
    startDist: number;
    startMid: Point;
  }>({
    mode: 'none',
    startZoom: 1,
    startPan: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
    startDist: 0,
    startMid: { x: 0, y: 0 },
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? viewport.clientWidth;
      setFitScale(width / A4_WIDTH_PX);
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const viewportHeight = A4_HEIGHT_PX * fitScale;

  const clampPan = useCallback(
    (candidate: Point, currentZoom: number): Point => {
      const viewport = viewportRef.current;
      if (!viewport) return candidate;
      const effectiveScale = fitScale * currentZoom;
      const contentWidth = A4_WIDTH_PX * effectiveScale;
      const contentHeight = A4_HEIGHT_PX * effectiveScale;
      const viewportWidth = viewport.clientWidth;
      const vpHeight = viewport.clientHeight;

      const clampAxis = (value: number, contentSize: number, viewportSize: number) => {
        if (contentSize <= viewportSize) {
          return (viewportSize - contentSize) / 2;
        }
        const min = viewportSize - contentSize;
        return Math.min(0, Math.max(min, value));
      };

      return {
        x: clampAxis(candidate.x, contentWidth, viewportWidth),
        y: clampAxis(candidate.y, contentHeight, vpHeight),
      };
    },
    [fitScale],
  );

  const zoomAt = useCallback(
    (screenPoint: Point, nextZoomRaw: number) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoomRaw));
      const currentZoom = zoomRef.current;
      const currentPan = panRef.current;
      const currentScale = fitScale * currentZoom;
      const nextScale = fitScale * nextZoom;

      const contentPoint = {
        x: (screenPoint.x - currentPan.x) / currentScale,
        y: (screenPoint.y - currentPan.y) / currentScale,
      };
      const nextPan = {
        x: screenPoint.x - contentPoint.x * nextScale,
        y: screenPoint.y - contentPoint.y * nextScale,
      };

      setZoom(nextZoom);
      setPan(clampPan(nextPan, nextZoom));
    },
    [fitScale, clampPan],
  );

  const viewportCenter = useCallback((): Point => {
    const viewport = viewportRef.current;
    if (!viewport) return { x: 0, y: 0 };
    const rect = viewport.getBoundingClientRect();
    return { x: rect.width / 2, y: rect.height / 2 };
  }, []);

  const handleZoomIn = () => zoomAt(viewportCenter(), zoomRef.current * 1.4);
  const handleZoomOut = () => zoomAt(viewportCenter(), zoomRef.current / 1.4);
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const relativePoint = (clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) };
  };

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const point = relativePoint(event.clientX, event.clientY);
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      zoomAt(point, zoomRef.current * factor);
    },
    [zoomAt],
  );

  const handleTouchStart = (event: React.TouchEvent) => {
    const touches = event.touches;
    if (touches.length === 2) {
      const p0 = relativePoint(touches[0].clientX, touches[0].clientY);
      const p1 = relativePoint(touches[1].clientX, touches[1].clientY);
      gestureRef.current = {
        mode: 'pinch',
        startZoom: zoomRef.current,
        startPan: panRef.current,
        startTouch: { x: 0, y: 0 },
        startDist: distance(p0, p1),
        startMid: midpoint(p0, p1),
      };
    } else if (touches.length === 1) {
      gestureRef.current = {
        mode: 'pan',
        startZoom: zoomRef.current,
        startPan: panRef.current,
        startTouch: relativePoint(touches[0].clientX, touches[0].clientY),
        startDist: 0,
        startMid: { x: 0, y: 0 },
      };
    }
  };

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const gesture = gestureRef.current;
      const touches = event.touches;

      if (gesture.mode === 'pinch' && touches.length === 2) {
        event.preventDefault();
        const p0 = relativePoint(touches[0].clientX, touches[0].clientY);
        const p1 = relativePoint(touches[1].clientX, touches[1].clientY);
        const newDist = distance(p0, p1);
        const newMid = midpoint(p0, p1);
        const scaleFactor = newDist / (gesture.startDist || newDist);
        const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, gesture.startZoom * scaleFactor));
        const currentScale = fitScale * gesture.startZoom;
        const nextScale = fitScale * nextZoom;
        const contentPoint = {
          x: (gesture.startMid.x - gesture.startPan.x) / currentScale,
          y: (gesture.startMid.y - gesture.startPan.y) / currentScale,
        };
        const nextPan = {
          x: newMid.x - contentPoint.x * nextScale,
          y: newMid.y - contentPoint.y * nextScale,
        };
        setZoom(nextZoom);
        setPan(clampPan(nextPan, nextZoom));
      } else if (gesture.mode === 'pan' && touches.length === 1) {
        if (zoomRef.current <= MIN_ZOOM) return;
        event.preventDefault();
        const current = relativePoint(touches[0].clientX, touches[0].clientY);
        const nextPan = {
          x: gesture.startPan.x + (current.x - gesture.startTouch.x),
          y: gesture.startPan.y + (current.y - gesture.startTouch.y),
        };
        setPan(clampPan(nextPan, zoomRef.current));
      }
    },
    [fitScale, clampPan],
  );

  // React anexa onWheel/onTouchMove como listeners passivos (não é possível
  // chamar preventDefault neles), então usamos listeners nativos para
  // impedir o scroll/zoom padrão do navegador enquanto o usuário interage
  // com o visualizador.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener('wheel', handleWheel, { passive: false });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
      viewport.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, handleTouchMove]);

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (event.touches.length === 0) {
      gestureRef.current.mode = 'none';
    } else if (event.touches.length === 1) {
      gestureRef.current = {
        mode: 'pan',
        startZoom: zoomRef.current,
        startPan: panRef.current,
        startTouch: relativePoint(event.touches[0].clientX, event.touches[0].clientY),
        startDist: 0,
        startMid: { x: 0, y: 0 },
      };
    }
  };

  // Arraste com mouse (desktop) quando ampliado.
  const mouseDragRef = useRef<{ dragging: boolean; start: Point; startPan: Point }>({
    dragging: false,
    start: { x: 0, y: 0 },
    startPan: { x: 0, y: 0 },
  });

  const handleMouseDown = (event: React.MouseEvent) => {
    if (zoomRef.current <= MIN_ZOOM) return;
    mouseDragRef.current = {
      dragging: true,
      start: relativePoint(event.clientX, event.clientY),
      startPan: panRef.current,
    };
  };
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!mouseDragRef.current.dragging) return;
    const current = relativePoint(event.clientX, event.clientY);
    const nextPan = {
      x: mouseDragRef.current.startPan.x + (current.x - mouseDragRef.current.start.x),
      y: mouseDragRef.current.startPan.y + (current.y - mouseDragRef.current.start.y),
    };
    setPan(clampPan(nextPan, zoomRef.current));
  };
  const stopMouseDrag = () => {
    mouseDragRef.current.dragging = false;
  };

  const effectiveScale = fitScale * zoom;
  const isZoomed = zoom > MIN_ZOOM + 0.001;

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden rounded-md bg-neutral-300 touch-none select-none"
        style={{ height: viewportHeight, cursor: isZoomed ? 'grab' : 'default' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopMouseDrag}
        onMouseLeave={stopMouseDrag}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${effectiveScale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-xs text-neutral-500">{Math.round(zoom * 100)}%</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="min-h-9 min-w-9 rounded-md border border-neutral-300 bg-white text-base font-semibold text-ta-black disabled:opacity-30"
            aria-label="Diminuir zoom"
          >
            −
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-9 rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-ta-black"
          >
            Ajustar
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="min-h-9 min-w-9 rounded-md border border-neutral-300 bg-white text-base font-semibold text-ta-black disabled:opacity-30"
            aria-label="Aumentar zoom"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
