/**
 * MASTER REFERENCE COMPONENT 03: CAD FRAMES & SPOTLIGHT CARDS
 * Sources: Aceternity UI (Card Spotlight & 3D Pin), 21st.dev, Industrial Blueprint Spec
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981)
 *
 * PROMPT FOR SUBAGENTS:
 * "Wrap all dashboard cards, feature previews, and metric summaries in CAD Spotlight Frames.
 * Use 1px Steel borders, hairline corner crosshairs, radial mouse-tracking flashlight illumination,
 * and technical monospace dimension tags. Avoid round bubbly cards or blurry drop shadows."
 */

import React, { useState, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

/* =========================================================================
 * 1. ACETERNITY CARBON SPOTLIGHT CARD
 * Source Inspiration: Aceternity UI Card Spotlight
 * Description: Dark carbon card with radial flashlight illumination following
 *              mouse cursor, exposing high-frequency technical grid texture.
 * ========================================================================= */

export interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  color?: string; // Hex for flashlight tint
  tag?: string;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className = '',
  radius = 280,
  color = '#FFB000',
  tag = 'BLK-01',
}) => {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        group relative border border-[#262626] bg-[#121212] overflow-hidden
        transition-colors duration-200 hover:border-[#333333] ${className}
      `}
    >
      {/* 4 Corner Crosshairs (+) */}
      <span className="absolute top-1 left-1.5 font-mono text-[9px] text-[#444444] pointer-events-none select-none">+</span>
      <span className="absolute top-1 right-1.5 font-mono text-[9px] text-[#444444] pointer-events-none select-none">+</span>
      <span className="absolute bottom-1 left-1.5 font-mono text-[9px] text-[#444444] pointer-events-none select-none">+</span>
      <span className="absolute bottom-1 right-1.5 font-mono text-[9px] text-[#444444] pointer-events-none select-none">+</span>

      {/* Engineering Tag Header */}
      {tag && (
        <div className="absolute top-2.5 right-3 font-mono text-[8px] text-[#555555] tracking-widest pointer-events-none select-none">
          [{tag}]
        </div>
      )}

      {/* Radial Flashlight Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              ${color}12,
              transparent 80%
            )
          `,
        }}
      />

      {/* High-frequency Technical Grid Underlay (Revealed by Spotlight) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Card Content */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};

/* =========================================================================
 * 2. INDUSTRIAL BLUEPRINT FRAME
 * Source Inspiration: CAD Mechanical Blueprint Sheeting
 * Description: Precision enclosure with millimeter edge ticks, border coordinates,
 *              and structured title block metadata.
 * ========================================================================= */

export interface BlueprintFrameProps {
  title: string;
  revision?: string;
  coordinates?: string;
  status?: 'NOMINAL' | 'EVAL' | 'CRITICAL';
  children: React.ReactNode;
  className?: string;
}

export const BlueprintFrame: React.FC<BlueprintFrameProps> = ({
  title,
  revision = 'REV-1.04',
  coordinates = 'GRID_X89-Y14',
  status = 'NOMINAL',
  children,
  className = '',
}) => {
  const statusColorMap = {
    NOMINAL: 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10',
    EVAL: 'text-[#FFB000] border-[#FFB000]/30 bg-[#FFB000]/10',
    CRITICAL: 'text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10',
  };

  return (
    <div className={`relative bg-[#0E0E0E] border border-[#262626] p-4 font-mono ${className}`}>
      {/* Top Engineering Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F1F1F] text-[10px]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#FFB000]" />
          <span className="font-bold text-white uppercase tracking-wider">{title}</span>
          <span className="text-[#666666]">[{revision}]</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#555555]">{coordinates}</span>
          <span className={`px-2 py-0.5 border text-[9px] font-semibold uppercase ${statusColorMap[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Children Viewport */}
      <div className="relative">{children}</div>

      {/* Bottom Hairline Axis Calibration Bar */}
      <div className="mt-3 pt-2 border-t border-[#1F1F1F] flex items-center justify-between text-[8px] text-[#444444]">
        <span>SCALE: 1:1.0 CAD-SPEC</span>
        <span>SECURITY LEVEL: ISOLATED RUNTIME</span>
        <span>SYS_STATUS: ACTIVE</span>
      </div>
    </div>
  );
};

/* =========================================================================
 * 3. 3D PIN PERSPECTIVE CONTAINER
 * Source Inspiration: Aceternity UI 3D Pin
 * Description: Card container that tilts dynamically along pitch and roll
 *              axes with a perspective cursor tracking pinpoint.
 * ========================================================================= */

export interface Cad3DPinPerspectiveProps {
  children: React.ReactNode;
  href?: string;
  pinLabel?: string;
  className?: string;
}

export const Cad3DPinPerspective: React.FC<Cad3DPinPerspectiveProps> = ({
  children,
  href = '#',
  pinLabel = 'INSPECT_MODULE',
  className = '',
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Max 10 deg tilt
    setRotateX(-y * 0.035);
    setRotateY(x * 0.035);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{ perspective: '1000px' }}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={cardRef}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative border border-[#262626] bg-[#121212] p-5 shadow-2xl ${className}`}
      >
        {/* Floating Laser Coordinates Pin Badge */}
        <div
          style={{ transform: 'translateZ(30px)' }}
          className="absolute -top-3 left-4 px-2 py-0.5 bg-[#1C1C1C] border border-[#333333] text-[9px] font-mono text-[#FFB000] flex items-center gap-1.5 shadow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB000] animate-ping" />
          <span className="font-bold">{pinLabel}</span>
        </div>

        {/* Card Content with 3D Depth */}
        <div style={{ transform: 'translateZ(15px)' }}>{children}</div>
      </motion.div>
    </div>
  );
};
