/**
 * MASTER REFERENCE COMPONENT 12: REACT BITS SPECIALIZED PRIMITIVES
 * Sources: React Bits (reactbits.dev / David Hckh)
 * Components Included:
 *   1. ReactBitsTextPressure (Cursor-distance sensitive variable typography)
 *   2. ReactBitsTrueFocus (CAD Focus Reticle Bracket tracking keywords)
 *   3. ReactBitsPixelCard (High-frequency pixel matrix dissipation card)
 *   4. ReactBitsShinyText (Continuous laser sheen sweeping across monospace text)
 *   5. ReactBitsSplitTextReveal (Staggered kinematic character & word spring entrance)
 *   6. ReactBitsLineWaves (Canvas CAD wireframe oscillating waveform mesh)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these React Bits specialized primitives for interactive typography, reticle focus tracking,
 * pixel grid cards, and oscillating background waveforms. Strictly maintain the TraceOn Obsidian
 * Industrial CAD theme with Phosphor Amber highlights and zero purple/blue slop."
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =========================================================================
 * 1. REACT BITS TEXT PRESSURE
 * Source Inspiration: React Bits `Text Pressure`
 * Description: Variable font typography scaling weight, width, and optical
 *              sizing dynamically based on mouse cursor distance and velocity.
 * ========================================================================= */

export interface ReactBitsTextPressureProps {
  text: string;
  minWeight?: number;
  maxWeight?: number;
  radius?: number; // Activation distance in px
  className?: string;
}

export const ReactBitsTextPressure: React.FC<ReactBitsTextPressureProps> = ({
  text,
  minWeight = 300,
  maxWeight = 900,
  radius = 140,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -9999, y: -9999 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center select-none font-mono tracking-wider ${className}`}
    >
      {text.split('').map((char, i) => (
        <PressureChar
          key={i}
          char={char}
          mousePos={mousePos}
          radius={radius}
          minWeight={minWeight}
          maxWeight={maxWeight}
        />
      ))}
    </div>
  );
};

function PressureChar({
  char,
  mousePos,
  radius,
  minWeight,
  maxWeight,
}: {
  char: string;
  mousePos: { x: number; y: number };
  radius: number;
  minWeight: number;
  maxWeight: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [weight, setWeight] = useState(minWeight);
  const [color, setColor] = useState('#CCCCCC');

  useEffect(() => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);

    if (dist < radius) {
      const factor = 1 - dist / radius; // 0 (far) to 1 (near)
      const targetWeight = Math.round(minWeight + factor * (maxWeight - minWeight));
      setWeight(targetWeight);
      setColor(factor > 0.5 ? '#FFB000' : '#FFFFFF');
    } else {
      setWeight(minWeight);
      setColor('#CCCCCC');
    }
  }, [mousePos, radius, minWeight, maxWeight]);

  return (
    <span
      ref={spanRef}
      style={{ fontWeight: weight, color }}
      className="transition-all duration-100 ease-out inline-block"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
}

/* =========================================================================
 * 2. REACT BITS TRUE FOCUS (CAD RETICLE BRACKET)
 * Source Inspiration: React Bits `True Focus`
 * Description: Precision CAD focus reticle bracket with 4 corner corners
 *              that snaps dynamically across keywords upon hover or cycle.
 * ========================================================================= */

export interface ReactBitsTrueFocusProps {
  sentence: string; // e.g. "DETERMINISTIC AST ANALYSIS FOR MISSION CRITICAL RUNTIMES"
  focusWordIndex?: number;
  glowColor?: string;
  className?: string;
}

export const ReactBitsTrueFocus: React.FC<ReactBitsTrueFocusProps> = ({
  sentence,
  focusWordIndex,
  glowColor = '#FFB000',
  className = '',
}) => {
  const words = sentence.split(' ');
  const [activeIndex, setActiveIndex] = useState(focusWordIndex ?? 0);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (focusWordIndex === undefined) {
      // Auto cycle every 2.5s if not controlled
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % words.length);
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setActiveIndex(focusWordIndex);
    }
  }, [focusWordIndex, words.length]);

  return (
    <div className={`relative inline-flex flex-wrap gap-x-3 gap-y-2 font-mono text-sm uppercase select-none ${className}`}>
      {words.map((word, idx) => {
        const isFocused = idx === activeIndex;

        return (
          <span
            key={idx}
            ref={(el) => {
              wordRefs.current[idx] = el;
            }}
            onMouseEnter={() => setActiveIndex(idx)}
            className={`relative py-1 px-2 cursor-pointer transition-colors duration-150 ${
              isFocused ? 'text-white font-bold' : 'text-[#666666] hover:text-[#AAAAAA]'
            }`}
          >
            {/* Corner Bracket Reticles on Focused Word */}
            {isFocused && (
              <motion.div
                layoutId="true-focus-bracket"
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                className="absolute inset-0 pointer-events-none"
              >
                {/* 4 Corner Crosshairs */}
                <span className="absolute -top-1 -left-1 text-[8px] text-[#FFB000] font-bold">┌</span>
                <span className="absolute -top-1 -right-1 text-[8px] text-[#FFB000] font-bold">┐</span>
                <span className="absolute -bottom-1 -left-1 text-[8px] text-[#FFB000] font-bold">└</span>
                <span className="absolute -bottom-1 -right-1 text-[8px] text-[#FFB000] font-bold">┘</span>

                {/* Subtle Amber Halo */}
                <div className="absolute inset-0 bg-[#FFB000]/10 border border-[#FFB000]/30" />
              </motion.div>
            )}

            <span className="relative z-10">{word}</span>
          </span>
        );
      })}
    </div>
  );
};

/* =========================================================================
 * 3. REACT BITS PIXEL CARD (MATRIX GRID CARD)
 * Source Inspiration: React Bits `Pixel Card`
 * Description: Interactive card with high-frequency pixel dissipation noise
 *              that illuminates phosphor dots upon cursor proximity.
 * ========================================================================= */

export interface ReactBitsPixelCardProps {
  children: React.ReactNode;
  pixelSize?: number;
  className?: string;
  tag?: string;
}

export const ReactBitsPixelCard: React.FC<ReactBitsPixelCardProps> = ({
  children,
  pixelSize = 8,
  className = '',
  tag = 'PIXEL_NODE_01',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cardRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = cardRef.current.offsetWidth);
    const height = (canvas.height = cardRef.current.offsetHeight);

    const cols = Math.ceil(width / pixelSize);
    const rows = Math.ceil(height / pixelSize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * pixelSize;
          const py = r * pixelSize;

          const dist = Math.hypot(mousePos.x - px, mousePos.y - py);
          if (dist < 120) {
            const intensity = 1 - dist / 120;
            if (Math.random() < intensity * 0.7) {
              ctx.fillStyle = intensity > 0.5 ? '#FFB000' : 'rgba(204, 204, 204, 0.4)';
              ctx.fillRect(px, py, pixelSize - 1, pixelSize - 1);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [mousePos, pixelSize]);

  return (
    <div
      ref={cardRef}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
      className={`relative p-5 bg-[#101010] border border-[#262626] rounded-sm overflow-hidden font-mono ${className}`}
    >
      {/* Background Pixel Dissipation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />

      {/* Engineering Header */}
      {tag && (
        <div className="flex items-center justify-between text-[8px] text-[#555555] pb-2 mb-2 border-b border-[#1C1C1C] relative z-10">
          <span>[{tag}]</span>
          <span className="w-1.5 h-1.5 bg-[#FFB000]" />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* =========================================================================
 * 4. REACT BITS SHINY TEXT (LASER SHEEN HEADING)
 * Source Inspiration: React Bits `Shiny Text`
 * Description: Continuous laser sheen beam sweeping across typography with
 *              adjustable velocity and phosphor highlight angle.
 * ========================================================================= */

export interface ReactBitsShinyTextProps {
  text: string;
  speed?: number; // Duration in seconds (default 3)
  className?: string;
}

export const ReactBitsShinyText: React.FC<ReactBitsShinyTextProps> = ({
  text,
  speed = 3,
  className = '',
}) => {
  return (
    <span
      className={`inline-block font-mono font-bold uppercase select-none ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(120deg, rgba(204,204,204,0.4) 30%, rgba(255,176,0,0.9) 50%, rgba(204,204,204,0.4) 70%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `shiny-sweep ${speed}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes shiny-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {text}
    </span>
  );
};

/* =========================================================================
 * 5. REACT BITS SPLIT TEXT REVEAL
 * Source Inspiration: React Bits `Split Text`
 * Description: Staggered kinematic spring entrance animation splitting
 *              sentences into individual character spans on view.
 * ========================================================================= */

export interface ReactBitsSplitTextRevealProps {
  text: string;
  stagger?: number;
  className?: string;
}

export const ReactBitsSplitTextReveal: React.FC<ReactBitsSplitTextRevealProps> = ({
  text,
  stagger = 0.03,
  className = '',
}) => {
  const characters = text.split('');

  return (
    <span className={`inline-flex flex-wrap font-mono ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 24,
            delay: index * stagger,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

/* =========================================================================
 * 6. REACT BITS LINE WAVES (CAD WIREFRAME MESH)
 * Source Inspiration: React Bits `Line Waves` / Oscillating Mesh
 * Description: Pure Canvas 2D oscillating hairline wireframe lines
 *              with mouse repulsion field for hero backgrounds.
 * ========================================================================= */

export interface ReactBitsLineWavesProps {
  linesCount?: number;
  className?: string;
}

export const ReactBitsLineWaves: React.FC<ReactBitsLineWavesProps> = ({
  linesCount = 14,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 300;
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      step += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < linesCount; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = i % 4 === 0 ? 'rgba(255, 176, 0, 0.25)' : 'rgba(38, 38, 38, 0.4)';

        const yBase = (canvas.height / (linesCount + 1)) * (i + 1);

        for (let x = 0; x < canvas.width; x += 6) {
          const dx = mousePos.x - x;
          const dy = mousePos.y - yBase;
          const dist = Math.hypot(dx, dy);
          const mouseDisplacement = dist < 120 ? (1 - dist / 120) * -30 : 0;

          const wave = Math.sin(x * 0.008 + step + i * 0.4) * 14;
          const y = yBase + wave + mouseDisplacement;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [mousePos, linesCount]);

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseLeave={() => setMousePos({ x: -1000, y: -1000 })}
      className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
};
