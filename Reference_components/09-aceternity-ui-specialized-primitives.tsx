/**
 * MASTER REFERENCE COMPONENT 09: ACETERNITY UI SPECIALIZED PRIMITIVES
 * Sources: Aceternity UI (ui.aceternity.com / Manu Arora)
 * Components Included:
 *   1. AceternityLens (CAD Inspection Magnifier Loupe with crosshair reticle)
 *   2. AceternityCompare (Before/After AST & Metric Refactoring Slider)
 *   3. AceternityTracingBeam (SVG Laser Progress Tracker for long logs & pipelines)
 *   4. AceternityMovingBorder (Continuous Laser Perimeter Actuator)
 *   5. AceternityCardHoverEffect (Framer Motion LayoutId Spring Hover Grid)
 *   6. AceternityFloatingDock (Distance-based magnification CAD Command Palette)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these Aceternity UI specialized primitives for interactive AST magnification,
 * before/after code refactoring comparisons, scroll progress tracking, and command palette navigation.
 * All components have been stripped of generic purples/blues and locked to the Obsidian Industrial CAD theme."
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { Eye, CheckCircle2, AlertTriangle, ArrowRight, GitCommit, ChevronRight, Terminal, Layers } from 'lucide-react';

/* =========================================================================
 * 1. ACETERNITY LENS (CAD INSPECTION MAGNIFIER LOUPE)
 * Source: Aceternity UI `Lens`
 * Description: Interactive inspection magnifying loupe that zooms into AST
 *              nodes, code strings, or compiler traces on cursor hover.
 * ========================================================================= */

export interface AceternityLensProps {
  children: React.ReactNode;
  zoomFactor?: number; // Default 2.0x
  lensSize?: number; // Lens diameter in px (default 160)
  className?: string;
}

export const AceternityLens: React.FC<AceternityLensProps> = ({
  children,
  zoomFactor = 2,
  lensSize = 160,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden cursor-crosshair select-none ${className}`}
    >
      {/* Base Layer */}
      <div>{children}</div>

      {/* Magnified Loupe Overlay */}
      {isHovered && (
        <div
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            top: `${mousePos.y - lensSize / 2}px`,
            left: `${mousePos.x - lensSize / 2}px`,
          }}
          className="absolute pointer-events-none rounded-full border-2 border-[#FFB000] shadow-[0_0_20px_rgba(255,176,0,0.35)] overflow-hidden bg-[#0A0A0A] z-40"
        >
          {/* Scaled Zoomed Duplicate Viewport */}
          <div
            style={{
              position: 'absolute',
              width: containerRef.current?.offsetWidth || '100%',
              height: containerRef.current?.offsetHeight || '100%',
              transform: `scale(${zoomFactor}) translate(${-mousePos.x + lensSize / (2 * zoomFactor)}px, ${
                -mousePos.y + lensSize / (2 * zoomFactor)
              }px)`,
              transformOrigin: '0 0',
            }}
          >
            {children}
          </div>

          {/* Precision CAD Hairline Crosshair Reticles (+) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-[#FFB000]/40" />
            <div className="h-full w-[1px] bg-[#FFB000]/40 absolute" />
            <div className="w-3 h-3 rounded-full border border-[#FFB000] absolute" />
          </div>

          {/* Micro Zoom Level Badge */}
          <div className="absolute bottom-1 right-2 px-1 py-0.5 bg-[#121212] border border-[#333333] text-[7px] font-mono text-[#FFB000]">
            {zoomFactor}X LOUPE
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
 * 2. ACETERNITY COMPARE (AST & REFACTORING SPLIT SLIDER)
 * Source: Aceternity UI `Compare`
 * Description: Interactive dual-view split comparison slider showing
 *              pre-optimization bloat vs post-optimization CAD efficiency.
 * ========================================================================= */

export interface AceternityCompareProps {
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  initialSliderPercentage?: number;
  className?: string;
}

export const AceternityCompare: React.FC<AceternityCompareProps> = ({
  beforeContent,
  afterContent,
  beforeLabel = 'LEGACY_BLOAT',
  afterLabel = 'TRACEON_CAD',
  initialSliderPercentage = 50,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
      className={`relative overflow-hidden border border-[#262626] bg-[#0A0A0A] font-mono select-none ${className}`}
    >
      {/* Background (After / Clean Layer) */}
      <div className="w-full h-full p-5 relative">
        <div className="absolute top-2 right-3 px-2 py-0.5 bg-[#10B981]/10 border border-[#10B981]/40 text-[9px] text-[#10B981] font-bold">
          {afterLabel}
        </div>
        {afterContent}
      </div>

      {/* Foreground (Before / Legacy Layer) Clipped by Slider */}
      <div
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        className="absolute inset-0 bg-[#0E0E0E] p-5 border-r border-[#333333]"
      >
        <div className="absolute top-2 left-3 px-2 py-0.5 bg-[#FF3333]/10 border border-[#FF3333]/40 text-[9px] text-[#FF3333] font-bold">
          {beforeLabel}
        </div>
        {beforeContent}
      </div>

      {/* Draggable Divider Line & Keycap Handle */}
      <div
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="absolute inset-y-0 -ml-[1px] w-[2px] bg-[#FFB000] cursor-ew-resize flex items-center justify-center z-30"
      >
        <div className="w-6 h-8 bg-[#161616] border border-[#FFB000] shadow-[0_0_10px_#FFB000] flex items-center justify-center gap-0.5">
          <div className="w-[1px] h-3 bg-[#FFB000]" />
          <div className="w-[1px] h-3 bg-[#FFB000]" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
 * 3. ACETERNITY TRACING BEAM (SVG LASER PROGRESS TRACKER)
 * Source: Aceternity UI `TracingBeam`
 * Description: Vertical SVG laser path that traces alongside documentation,
 *              audit steps, or AST execution logs during scroll.
 * ========================================================================= */

export interface TracingStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  status: 'passed' | 'active' | 'pending';
}

export interface AceternityTracingBeamProps {
  steps: TracingStepItem[];
  className?: string;
}

export const AceternityTracingBeam: React.FC<AceternityTracingBeamProps> = ({
  steps,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 30 });

  return (
    <div ref={containerRef} className={`relative font-mono ${className}`}>
      {/* Left Laser SVG Rail Track */}
      <div className="absolute top-0 bottom-0 left-4 w-6 flex justify-center">
        {/* Static Background Rail */}
        <div className="w-[1px] h-full bg-[#222222]" />

        {/* Animated Phosphor Laser Trail */}
        <motion.div
          style={{ scaleY: pathLength, transformOrigin: 'top center' }}
          className="absolute top-0 w-[2px] h-full bg-[#FFB000] shadow-[0_0_8px_#FFB000]"
        />
      </div>

      {/* Step Content Items */}
      <div className="ml-12 space-y-8">
        {steps.map((item, index) => {
          const statusColors = {
            passed: 'text-[#10B981] border-[#10B981] bg-[#10B981]/10',
            active: 'text-[#FFB000] border-[#FFB000] bg-[#FFB000]/10',
            pending: 'text-[#555555] border-[#333333] bg-[#141414]',
          };

          return (
            <div key={item.id} className="relative p-4 bg-[#121212] border border-[#262626] rounded-sm">
              {/* Milestone Indicator Node */}
              <div
                className={`absolute -left-[37px] top-4 w-3.5 h-3.5 border rounded-full flex items-center justify-center bg-[#0A0A0A] ${statusColors[item.status]}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${item.status === 'passed' ? 'bg-[#10B981]' : item.status === 'active' ? 'bg-[#FFB000] animate-pulse' : 'bg-[#444444]'}`}
                />
              </div>

              {/* Step Header */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1C1C1C]">
                <div className="flex items-center gap-2">
                  <span className="text-[#888888]">[{item.step}]</span>
                  <span className="text-white font-bold tracking-wider">{item.title}</span>
                </div>
                <span className={`px-1.5 py-0.2 border text-[8px] uppercase font-bold ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>

              {/* Step Description */}
              <p className="text-[#AAAAAA] text-xs mt-2 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 4. ACETERNITY MOVING BORDER (LASER PERIMETER TRACER)
 * Source: Aceternity UI `MovingBorder`
 * Description: Continuous laser photon beam revolving around the rectangular
 *              perimeter of high-priority CAD cards and actuators.
 * ========================================================================= */

export interface AceternityMovingBorderProps {
  children: React.ReactNode;
  duration?: number; // Seconds per cycle (default: 4)
  rx?: number;
  className?: string;
  borderColor?: string;
}

export const AceternityMovingBorder: React.FC<AceternityMovingBorderProps> = ({
  children,
  duration = 4,
  rx = 2,
  className = '',
  borderColor = '#FFB000',
}) => {
  return (
    <div className={`relative p-[1px] overflow-hidden bg-[#161616] border border-[#262626] ${className}`}>
      {/* Rotating High-Intensity Laser Gradient */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
        className="absolute -inset-[100%] origin-center pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${borderColor} 60deg, transparent 120deg)`,
        }}
      />

      {/* Foreground Content Shell */}
      <div className="relative bg-[#111111] p-4 z-10">{children}</div>
    </div>
  );
};

/* =========================================================================
 * 5. ACETERNITY CARD HOVER EFFECT (LAYOUT-ID SPRING GRID)
 * Source: Aceternity UI `CardHoverEffect`
 * Description: Card grid where moving the cursor animates a seamless
 *              floating phosphor border highlight underneath cards.
 * ========================================================================= */

export interface HoverCardItem {
  id: string;
  title: string;
  metric: string;
  description: string;
  tag: string;
}

export interface AceternityCardHoverEffectProps {
  items: HoverCardItem[];
  className?: string;
}

export const AceternityCardHoverEffect: React.FC<AceternityCardHoverEffectProps> = ({
  items,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono ${className}`}>
      {items.map((item, i) => (
        <div
          key={item.id}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          className="relative group p-4 border border-[#262626] bg-[#121212] overflow-hidden cursor-pointer"
        >
          {/* Framer Motion LayoutId Seamless Hover Highlight */}
          <AnimatePresence>
            {hoveredIdx === i && (
              <motion.span
                layoutId="cad-card-hover-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.1 } }}
                className="absolute inset-0 bg-[#FFB000]/10 border border-[#FFB000] z-0 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between text-[9px] text-[#666666] pb-2 mb-2 border-b border-[#1C1C1C]">
              <span>[{item.tag}]</span>
              <span className="text-[#FFB000] font-bold">{item.metric}</span>
            </div>

            {/* Title & Description */}
            <h3 className="text-white font-bold text-sm tracking-wide">{item.title}</h3>
            <p className="text-[#888888] text-xs mt-1 leading-relaxed">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

/* =========================================================================
 * 6. ACETERNITY FLOATING DOCK (CAD COMMAND PALETTE)
 * Source: Aceternity UI `FloatingDock`
 * Description: Distance-based magnification floating navigation bar for rapid
 *              view switching between AST, Call Graph, CURISM, and Scrubber.
 * ========================================================================= */

export interface DockActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

export interface AceternityFloatingDockProps {
  items: DockActionItem[];
  className?: string;
}

export const AceternityFloatingDock: React.FC<AceternityFloatingDockProps> = ({
  items,
  className = '',
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className={`fixed bottom-6 inset-x-0 flex justify-center z-50 pointer-events-none font-mono ${className}`}>
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-center gap-3 px-4 py-2 bg-[#0F0F0F]/90 backdrop-blur-md border border-[#262626] rounded shadow-2xl"
      >
        {items.map((item) => (
          <DockIconKeycap key={item.id} item={item} mouseX={mouseX} />
        ))}
      </div>
    </div>
  );
};

function DockIconKeycap({ item, mouseX }: { item: DockActionItem; mouseX: any }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Spring Magnification Math
  const widthSync = useTransform(distance, [-120, 0, 120], [38, 54, 38]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 400, damping: 25 });

  return (
    <div className="relative flex flex-col items-center">
      {/* Tooltip Label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: -4 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute -top-7 px-2 py-0.5 bg-[#1C1C1C] border border-[#333333] text-[9px] text-white whitespace-nowrap shadow"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keycap Button */}
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={item.onClick}
        className={`
          flex items-center justify-center border rounded-sm transition-colors
          ${item.active ? 'bg-[#FFB000] text-black border-[#FFB000]' : 'bg-[#181818] text-[#CCCCCC] border-[#303030] hover:text-white'}
        `}
      >
        {item.icon}
      </motion.button>
    </div>
  );
}
