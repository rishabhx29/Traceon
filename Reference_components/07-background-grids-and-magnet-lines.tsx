/**
 * MASTER REFERENCE COMPONENT 07: BACKGROUND GRIDS & MAGNET LINES
 * Sources: React Bits (Magnet Lines), Aceternity UI (Canvas Reveal Effect / Dot Matrix), CAD Viewport
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use MagnetLinesGrid and CadCanvasRevealDots for background viewports and hero canvas floors.
 * The lines or dots must subtly interact with mouse proximity without causing GPU lag or distraction.
 * Keep background opacities under 25% to preserve stark contrast for foreground CAD components."
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/* =========================================================================
 * 1. REACT BITS MAGNET LINES GRID
 * Source Inspiration: React Bits Magnet Lines
 * Description: Grid of calibrated hairline vectors that rotate dynamically
 *              to align with cursor vector field in real time.
 * ========================================================================= */

export interface MagnetLinesGridProps {
  rows?: number;
  columns?: number;
  lineLength?: number;
  lineWidth?: string;
  className?: string;
}

export const MagnetLinesGrid: React.FC<MagnetLinesGridProps> = ({
  rows = 12,
  columns = 24,
  lineLength = 12,
  lineWidth = '1px',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -9999, y: -9999 });
  };

  const totalCells = rows * columns;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: totalCells }).map((_, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;

        return (
          <MagnetLineCell
            key={i}
            row={row}
            col={col}
            rows={rows}
            columns={columns}
            mousePos={mousePos}
            lineLength={lineLength}
            lineWidth={lineWidth}
            containerRef={containerRef}
          />
        );
      })}
    </div>
  );
};

interface MagnetLineCellProps {
  row: number;
  col: number;
  rows: number;
  columns: number;
  mousePos: { x: number; y: number };
  lineLength: number;
  lineWidth: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const MagnetLineCell: React.FC<MagnetLineCellProps> = ({
  mousePos,
  lineLength,
  lineWidth,
  containerRef,
}) => {
  const cellRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (!cellRef.current || !containerRef.current) return;
    const cellRect = cellRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const cellCenterX = cellRect.left - containerRect.left + cellRect.width / 2;
    const cellCenterY = cellRect.top - containerRect.top + cellRect.height / 2;

    const dx = mousePos.x - cellCenterX;
    const dy = mousePos.y - cellCenterY;
    const dist = Math.hypot(dx, dy);

    if (dist < 400 && mousePos.x > 0) {
      const calculatedAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      setAngle(calculatedAngle);
      setIntensity(Math.max(0, 1 - dist / 400));
    } else {
      setAngle(0);
      setIntensity(0);
    }
  }, [mousePos]);

  return (
    <div ref={cellRef} className="flex items-center justify-center pointer-events-none">
      <div
        style={{
          width: `${lineLength}px`,
          height: lineWidth,
          transform: `rotate(${angle}deg)`,
          backgroundColor: intensity > 0.4 ? '#FFB000' : '#2A2A2A',
          opacity: 0.2 + intensity * 0.8,
        }}
        className="transition-transform duration-75 ease-out rounded-full"
      />
    </div>
  );
};

/* =========================================================================
 * 2. ACETERNITY CANVAS REVEAL DOT MATRIX
 * Source Inspiration: Aceternity UI Canvas Reveal Effect / Shader Grid
 * Description: Interactive dot matrix with radial cursor illumination and
 *              phosphor amber reaction halo.
 * ========================================================================= */

export interface CadCanvasRevealDotsProps {
  dotSize?: number;
  gap?: number;
  className?: string;
}

export const CadCanvasRevealDots: React.FC<CadCanvasRevealDotsProps> = ({
  dotSize = 2,
  gap = 24,
  className = '',
}) => {
  const [cursor, setCursor] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setCursor({ x: -1000, y: -1000 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full bg-[#0A0A0A] overflow-hidden ${className}`}
    >
      {/* Background Static Hairline Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#444444 ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${gap}px ${gap}px`,
        }}
      />

      {/* Dynamic Cursor Proximity Reveal Halo */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          background: `radial-gradient(350px circle at ${cursor.x}px ${cursor.y}px, rgba(255,176,0,0.18), transparent 75%)`,
        }}
      />

      {/* Concentric Amber Revealed Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: `radial-gradient(280px circle at ${cursor.x}px ${cursor.y}px, black 30%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(280px circle at ${cursor.x}px ${cursor.y}px, black 30%, transparent 80%)`,
          backgroundImage: `radial-gradient(#FFB000 ${dotSize * 1.5}px, transparent ${dotSize * 1.5}px)`,
          backgroundSize: `${gap}px ${gap}px`,
        }}
      />
    </div>
  );
};

/* =========================================================================
 * 3. CAD AXIS RULER & COORDINATE OVERLAY
 * Source Inspiration: CAD Mechanical Blueprint Drafting Overlay
 * Description: Viewport millimeter tick marks and live coordinate readout.
 * ========================================================================= */

export const CadAxisRulerOverlay: React.FC = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 font-mono select-none">
      {/* Top Millimeter Tick Ruler */}
      <div className="absolute top-0 inset-x-0 h-4 border-b border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-sm flex items-end justify-between px-2 text-[7px] text-[#444444]">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span>{i * 100}</span>
            <div className="w-[1px] h-1.5 bg-[#333333]" />
          </div>
        ))}
      </div>

      {/* Left Millimeter Tick Ruler */}
      <div className="absolute left-0 inset-y-0 w-4 border-r border-[#222222] bg-[#0A0A0A]/80 backdrop-blur-sm flex flex-col justify-between py-6 text-[7px] text-[#444444] items-end pr-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <span>{i * 100}</span>
            <div className="h-[1px] w-1.5 bg-[#333333]" />
          </div>
        ))}
      </div>

      {/* Bottom Right Live Pointer Coordinates Badge */}
      <div className="absolute bottom-3 right-4 px-2 py-1 bg-[#121212] border border-[#262626] text-[9px] text-[#888888] flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
        <span>X: <strong className="text-white">{coords.x}</strong></span>
        <span>Y: <strong className="text-white">{coords.y}</strong></span>
        <span className="text-[#FFB000]">CAD_ACTIVE</span>
      </div>
    </div>
  );
};
