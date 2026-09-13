/**
 * MASTER REFERENCE COMPONENT 08: VENGEANCE UI SPECIALIZED PRIMITIVES
 * Sources: Vengeance UI (vengenceui.com / github.com/Ashutoshx7/VengeanceUI)
 * Components Included:
 *   1. VengeanceAsciiGlitchRipple (ASCII wave ripple scramble on hover)
 *   2. VengeancePerspectiveGridFloor (3D CAD horizon ground plane grid)
 *   3. VengeanceCollimatedRays (Collimated background ambient laser rays)
 *   4. VengeanceLightLineTracer (SVG animated laser photon pulses along circuit tracks)
 *   5. VengeanceCadFolderInspect (3D opening repository folder with file tab elevation)
 *   6. VengeanceCadNotchNavbar (Precision CAD geometric notched floating header dock)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these Vengeance UI specialized primitives for hero backgrounds, telemetry typography,
 * code symbol hover reactions, and repository file inspection. Every component has been
 * refactored to eliminate generic blues/purples in favor of the TraceOn Obsidian Industrial CAD theme."
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileCode, GitBranch, Cpu, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';

/* =========================================================================
 * 1. VENGEANCE ASCII GLITCH RIPPLE
 * Source: Vengeance UI `ascii-glitch-ripple`
 * Description: Wave-based character scramble ripple spreading from cursor
 *              entry point outward at 60fps without React re-render overhead.
 * ========================================================================= */

const WAVE_THRESH = 3;
const CHAR_MULT = 3;
const ANIM_STEP = 40;
const WAVE_BUF = 5;

export interface VengeanceAsciiGlitchRippleProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  as?: any;
  className?: string;
  dur?: number; // Wave duration in ms (default: 800)
  chars?: string;
  preserveSpaces?: boolean;
  spread?: number;
  highlightColor?: string; // e.g. '#FFB000'
}

export function VengeanceAsciiGlitchRipple({
  children,
  as = 'span',
  className = '',
  dur = 800,
  chars = '.,·-─~+:;=*π""┐┌┘┴┬╗╔╝╚╬╠╣╩╦║░▒▓█▄▀▌▐■!?&#$@0123456789*',
  preserveSpaces = true,
  spread = 1.0,
  highlightColor = '#FFB000',
  ...props
}: VengeanceAsciiGlitchRippleProps) {
  const Component = as;
  const elRef = useRef<any>(null);

  const stateRef = useRef({
    origTxt: children,
    origChars: children.split(''),
    isAnim: false,
    cursorPos: 0,
    waves: [] as Array<{ startPos: number; startTime: number; id: number }>,
    animId: null as number | null,
    isHover: false,
    origW: null as number | null,
    dur,
    chars,
    preserveSpaces,
    spread,
  });

  useEffect(() => {
    stateRef.current.origTxt = children;
    stateRef.current.origChars = children.split('');
    stateRef.current.dur = dur;
    stateRef.current.chars = chars;
    stateRef.current.preserveSpaces = preserveSpaces;
    stateRef.current.spread = spread;

    if (stateRef.current.origW !== null && elRef.current) {
      elRef.current.style.width = '';
      stateRef.current.origW = null;
    }

    if (!stateRef.current.isAnim && elRef.current) {
      elRef.current.textContent = children;
    }
  }, [children, dur, chars, preserveSpaces, spread]);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    el.textContent = children;

    const updateCursorPos = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const len = stateRef.current.origTxt.length;
      const pos = Math.round((x / rect.width) * len);
      stateRef.current.cursorPos = Math.max(0, Math.min(pos, len - 1));
    };

    const stop = () => {
      el.textContent = stateRef.current.origTxt;
      el.style.color = '';
      if (stateRef.current.origW !== null) {
        el.style.width = '';
        stateRef.current.origW = null;
      }
      stateRef.current.isAnim = false;
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
        stateRef.current.animId = null;
      }
    };

    const start = () => {
      if (stateRef.current.isAnim) return;

      if (stateRef.current.origW === null) {
        stateRef.current.origW = el.getBoundingClientRect().width;
        el.style.width = `${stateRef.current.origW}px`;
      }

      stateRef.current.isAnim = true;
      el.style.color = highlightColor;

      const animate = () => {
        const t = Date.now();
        stateRef.current.waves = stateRef.current.waves.filter(
          (w) => t - w.startTime < stateRef.current.dur
        );

        if (stateRef.current.waves.length === 0) {
          stop();
          return;
        }

        el.textContent = genScrambledTxt(t);
        stateRef.current.animId = requestAnimationFrame(animate);
      };

      stateRef.current.animId = requestAnimationFrame(animate);
    };

    const startWave = () => {
      stateRef.current.waves.push({
        startPos: stateRef.current.cursorPos,
        startTime: Date.now(),
        id: Math.random(),
      });
      if (!stateRef.current.isAnim) start();
    };

    const calcWaveEffect = (charIdx: number, t: number) => {
      let shouldAnim = false;
      let resultChar = stateRef.current.origChars[charIdx];

      for (const w of stateRef.current.waves) {
        const age = t - w.startTime;
        const prog = Math.min(age / stateRef.current.dur, 1);
        const dist = Math.abs(charIdx - w.startPos);
        const maxDist = Math.max(w.startPos, stateRef.current.origChars.length - w.startPos - 1);
        const rad = (prog * (maxDist + WAVE_BUF)) / stateRef.current.spread;

        if (dist <= rad) {
          shouldAnim = true;
          const intens = Math.max(0, rad - dist);
          if (intens <= WAVE_THRESH && intens > 0) {
            const index =
              (dist * CHAR_MULT + Math.floor(age / ANIM_STEP)) % stateRef.current.chars.length;
            resultChar = stateRef.current.chars[index];
          }
        }
      }
      return { shouldAnim, char: resultChar };
    };

    const genScrambledTxt = (t: number) =>
      stateRef.current.origChars
        .map((char, i) => {
          if (stateRef.current.preserveSpaces && char === ' ') return ' ';
          const res = calcWaveEffect(i, t);
          return res.shouldAnim ? res.char : char;
        })
        .join('');

    const handleEnter = (e: MouseEvent) => {
      stateRef.current.isHover = true;
      updateCursorPos(e);
      startWave();
    };

    const handleMove = (e: MouseEvent) => {
      if (!stateRef.current.isHover) return;
      const old = stateRef.current.cursorPos;
      updateCursorPos(e);
      if (stateRef.current.cursorPos !== old) startWave();
    };

    const handleLeave = () => {
      stateRef.current.isHover = false;
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      if (stateRef.current.animId) {
        cancelAnimationFrame(stateRef.current.animId);
      }
    };
  }, [children]);

  return (
    <Component
      ref={elRef}
      className={`cursor-pointer select-none relative inline-block font-mono transition-colors duration-150 ${className}`}
      {...props}
    />
  );
}

/* =========================================================================
 * 2. VENGEANCE PERSPECTIVE GRID FLOOR
 * Source: Vengeance UI `perspective-grid`
 * Description: 3D perspective ground grid with horizon vanishing point,
 *              depth gradient attenuation, and hairline CAD ticks.
 * ========================================================================= */

export interface VengeancePerspectiveGridFloorProps {
  className?: string;
  gridSize?: number; // Number of subdivisions
  fadeRadius?: number; // Radial fade percentage
}

export const VengeancePerspectiveGridFloor: React.FC<VengeancePerspectiveGridFloorProps> = ({
  className = '',
  gridSize = 32,
  fadeRadius = 75,
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#0A0A0A] ${className}`}>
      {/* 3D Rotated Perspective Plane */}
      <div
        className="absolute inset-x-0 -top-1/4 h-[150%] origin-center pointer-events-none"
        style={{
          transform: 'perspective(400px) rotateX(68deg)',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / gridSize}% ${100 / gridSize}%`,
        }}
      />

      {/* Vanishing Point Horizon Fog Mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, transparent 10%, #0A0A0A ${fadeRadius}%)`,
        }}
      />

      {/* Central Horizon Axis Line */}
      <div className="absolute top-[35%] inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB000]/25 to-transparent pointer-events-none" />
    </div>
  );
};

/* =========================================================================
 * 3. VENGEANCE COLLIMATED RAYS
 * Source: Vengeance UI `animated-rays`
 * Description: Collimated geometrical ambient laser rays with subtle
 *              angular sweep and zero neon bloom.
 * ========================================================================= */

export interface VengeanceCollimatedRaysProps {
  className?: string;
  rayColor?: string; // Amber or White
  speed?: number; // seconds per cycle
}

export const VengeanceCollimatedRays: React.FC<VengeanceCollimatedRaysProps> = ({
  className = '',
  rayColor = 'rgba(255, 176, 0, 0.05)',
  speed = 24,
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] origin-center"
        style={{
          background: `conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            ${rayColor} 15deg,
            transparent 30deg,
            ${rayColor} 60deg,
            transparent 90deg,
            ${rayColor} 120deg,
            transparent 180deg,
            ${rayColor} 240deg,
            transparent 300deg,
            ${rayColor} 340deg,
            transparent 360deg
          )`,
        }}
      />
      {/* Central Vignette Mask to avoid overpowering foreground content */}
      <div className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-[1px]" />
    </div>
  );
};

/* =========================================================================
 * 4. VENGEANCE LIGHT LINE TRACER
 * Source: Vengeance UI `light-lines`
 * Description: SVG animated photon packets traveling along hairline CAD tracks
 *              with configurable velocity and phosphor amber pulse heads.
 * ========================================================================= */

export interface VengeanceLightLineTracerProps {
  className?: string;
  lineCount?: number;
  speed?: number;
}

export const VengeanceLightLineTracer: React.FC<VengeanceLightLineTracerProps> = ({
  className = '',
  lineCount = 6,
  speed = 3,
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: lineCount }).map((_, i) => {
          const xPercent = (i + 0.5) * (100 / lineCount);

          return (
            <g key={i}>
              {/* Static Background Rail */}
              <line
                x1={`${xPercent}%`}
                y1="0%"
                x2={`${xPercent}%`}
                y2="100%"
                stroke="#1A1A1A"
                strokeWidth="1"
              />

              {/* Animated Phosphor Laser Pulse */}
              <motion.line
                x1={`${xPercent}%`}
                y1="-20%"
                x2={`${xPercent}%`}
                y2="0%"
                stroke="#FFB000"
                strokeWidth="1.5"
                initial={{ y1: '-20%', y2: '0%' }}
                animate={{ y1: '100%', y2: '120%' }}
                transition={{
                  duration: speed,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: i * (speed / lineCount),
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* =========================================================================
 * 5. VENGEANCE CAD FOLDER INSPECT
 * Source: Vengeance UI `folder-preview`
 * Description: 3D mechanical repository folder that opens its cover upon
 *              hover, elevating stacked file inspection cards with status tags.
 * ========================================================================= */

export interface RepositoryFileItem {
  name: string;
  type: 'ts' | 'rs' | 'json' | 'glsl';
  status: 'M' | 'A' | '!'; // Modified, Added, Hotspot
  loc: number;
}

export interface VengeanceCadFolderInspectProps {
  folderName: string;
  files: RepositoryFileItem[];
  branch?: string;
  className?: string;
  onSelectFolder?: () => void;
}

export const VengeanceCadFolderInspect: React.FC<VengeanceCadFolderInspectProps> = ({
  folderName,
  files,
  branch = 'main',
  className = '',
  onSelectFolder,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusBadge = {
    M: 'text-[#FFB000] border-[#FFB000]',
    A: 'text-[#10B981] border-[#10B981]',
    '!': 'text-[#FF3333] border-[#FF3333]',
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelectFolder}
      style={{ perspective: '800px' }}
      className={`relative w-72 h-44 cursor-pointer font-mono select-none ${className}`}
    >
      {/* Folder Backplate (Chassis) */}
      <div className="absolute inset-0 bg-[#121212] border border-[#262626] rounded-sm p-3 shadow-xl">
        {/* Top Folder Tab Index */}
        <div className="absolute -top-3.5 left-0 px-2 py-0.5 bg-[#1C1C1C] border-t border-x border-[#333333] text-[9px] text-[#FFB000] font-bold">
          DIR: {folderName}
        </div>

        {/* Git Branch Readout */}
        <div className="flex items-center gap-1.5 text-[9px] text-[#666666] pt-1">
          <GitBranch className="w-3 h-3 text-[#FFB000]" />
          <span>{branch}</span>
          <span className="text-[#444444]">|</span>
          <span>{files.length} TARGETS</span>
        </div>
      </div>

      {/* Stacked File Cards (Elevate upward on hover) */}
      <div className="absolute inset-x-2 bottom-3 top-8 space-y-1 overflow-hidden pointer-events-none">
        {files.slice(0, 3).map((f, i) => (
          <motion.div
            key={f.name}
            animate={{
              y: isHovered ? -16 * (i + 1) : 0,
              scale: isHovered ? 1 - i * 0.03 : 1,
              opacity: isHovered ? 1 : 0.4,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="flex items-center justify-between px-2 py-1.5 bg-[#1A1A1A] border border-[#2E2E2E] text-[10px] shadow"
          >
            <div className="flex items-center gap-1.5 text-white truncate max-w-[140px]">
              <FileCode className="w-3 h-3 text-[#888888]" />
              <span className="truncate">{f.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#666666] text-[8px]">{f.loc}L</span>
              <span className={`w-3.5 h-3.5 flex items-center justify-center border text-[8px] font-bold ${statusBadge[f.status]}`}>
                {f.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Folder Front Cover (Opens down with 3D rotation on hover) */}
      <motion.div
        animate={{ rotateX: isHovered ? -35 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        style={{ transformOrigin: 'bottom center' }}
        className="absolute inset-x-0 bottom-0 h-28 bg-[#161616] border-t border-x border-[#333333] p-3 flex flex-col justify-between shadow-2xl"
      >
        <div className="flex items-center justify-between text-[9px] text-[#888888]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            INSPECTABLE
          </span>
          <span>CLICK TO EXPAND</span>
        </div>

        <div className="flex items-center justify-between text-xs text-white font-bold">
          <span>{folderName}</span>
          <ArrowRight className={`w-3.5 h-3.5 text-[#FFB000] transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
 * 6. VENGEANCE CAD NOTCH NAVBAR
 * Source: Vengeance UI `notch-navbar`
 * Description: Viewport header dock with geometric notch cutout, integrated
 *              system status LED, and tactile route markers.
 * ========================================================================= */

export interface NavRouteItem {
  id: string;
  tag: string;
  label: string;
  href: string;
}

export interface VengeanceCadNotchNavbarProps {
  routes?: NavRouteItem[];
  activeRoute?: string;
  onSelectRoute?: (route: NavRouteItem) => void;
  className?: string;
}

export const VengeanceCadNotchNavbar: React.FC<VengeanceCadNotchNavbarProps> = ({
  routes = [
    { id: 'tree', tag: '01', label: 'AST TREE', href: '#tree' },
    { id: 'metrics', tag: '02', label: 'CURISM METRICS', href: '#metrics' },
    { id: 'timeline', tag: '03', label: 'COMMIT SCRUBBER', href: '#timeline' },
    { id: 'audit', tag: '04', label: 'SYSTEM AUDIT', href: '#audit' },
  ],
  activeRoute = 'tree',
  onSelectRoute,
  className = '',
}) => {
  return (
    <header className={`fixed top-0 inset-x-0 z-50 flex justify-center p-3 font-mono text-xs ${className}`}>
      {/* Precision CAD Notched Container */}
      <div className="relative flex items-center gap-6 px-5 py-2 bg-[#0F0F0F]/90 backdrop-blur-md border border-[#262626] shadow-2xl">
        {/* Left System Badge with LED Diode */}
        <div className="flex items-center gap-2 pr-4 border-r border-[#222222]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
          <span className="font-bold text-white tracking-widest text-sm">TRACEON</span>
          <span className="text-[9px] text-[#FFB000] bg-[#FFB000]/10 border border-[#FFB000]/30 px-1 py-0.2">
            CAD_REV_4
          </span>
        </div>

        {/* Navigation Item Links */}
        <nav className="flex items-center gap-4">
          {routes.map((r) => {
            const isActive = r.id === activeRoute;

            return (
              <a
                key={r.id}
                href={r.href}
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectRoute) onSelectRoute(r);
                }}
                className={`
                  relative flex items-center gap-1.5 px-2.5 py-1 transition-colors duration-150 uppercase tracking-wider text-[11px]
                  ${isActive ? 'text-[#FFB000] font-bold' : 'text-[#888888] hover:text-white'}
                `}
              >
                <span className="text-[8px] opacity-60">[{r.tag}]</span>
                <span>{r.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="notch-nav-active-pill"
                    className="absolute inset-0 bg-[#FFB000]/10 border border-[#FFB000]/40 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Mil-Spec Telemetry Action */}
        <div className="pl-4 border-l border-[#222222]">
          <button className="px-3 py-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 transition-colors">
            <Cpu className="w-3 h-3 text-[#FFB000]" />
            RUN AUDIT
          </button>
        </div>
      </div>
    </header>
  );
};
