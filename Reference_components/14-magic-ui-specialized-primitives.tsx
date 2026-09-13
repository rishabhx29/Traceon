/**
 * MASTER REFERENCE COMPONENT 14: MAGIC UI SPECIALIZED PRIMITIVES
 * Sources: Magic UI (magicui.design / dillionverma)
 * Components Included:
 *   1. MagicUIAnimatedBeam (Pulsating laser bezier path connecting node containers)
 *   2. MagicUIOrbitingCircles (Concentric CAD orbital rings with revolving module satellites)
 *   3. MagicUINumberTicker (Precision monospace spring-interpolated telemetry ticker)
 *   4. MagicUIBentoGrid & BentoCard (Industrial CAD bento layout with corner reticles)
 *   5. MagicUIMarquee (Hardware-accelerated infinite telemetry & commit log streamer)
 *   6. MagicUIHyperText (Alphanumeric cyber scramble & decrypt animation)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these Magic UI primitives for animated connection beams between AST nodes,
 * orbiting dependency rings, rolling telemetry counters, bento layouts, and continuous
 * log marquees. Strictly maintain the TraceOn Obsidian CAD design system with zero purple/blue."
 */

import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

/* =========================================================================
 * 1. MAGIC UI ANIMATED BEAM
 * Source Inspiration: Magic UI `Animated Beam`
 * Description: High-precision SVG cubic bezier path with a moving phosphor
 *              laser gradient connecting two DOM elements or custom coordinates.
 * ========================================================================= */

export interface MagicUIAnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  duration?: number;
  pathColor?: string;
  beamColor?: string;
  strokeWidth?: number;
  className?: string;
}

export const MagicUIAnimatedBeam: React.FC<MagicUIAnimatedBeamProps> = ({
  containerRef,
  fromRef,
  toRef,
  curvature = 40,
  reverse = false,
  duration = 2.5,
  pathColor = 'rgba(38, 38, 38, 0.6)',
  beamColor = '#FFB000',
  strokeWidth = 1.5,
  className = '',
}) => {
  const id = useId();
  const [d, setD] = useState('');

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2 - curvature;

      setD(`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    return () => window.removeEventListener('resize', updatePath);
  }, [containerRef, fromRef, toRef, curvature]);

  if (!d) return null;

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      fill="none"
    >
      {/* Background Static Hairline */}
      <path d={d} stroke={pathColor} strokeWidth={strokeWidth} strokeLinecap="round" />

      {/* Animated Laser Pulse */}
      <path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth * 1.5}
        strokeLinecap="round"
      />

      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: reverse ? '100%' : '0%',
            x2: reverse ? '120%' : '-20%',
          }}
          animate={{
            x1: reverse ? ['100%', '-20%'] : ['0%', '120%'],
            x2: reverse ? ['120%', '0%'] : ['-20%', '100%'],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <stop stopColor={beamColor} stopOpacity="0" />
          <stop stopColor={beamColor} stopOpacity="1" />
          <stop stopColor="#FFFFFF" stopOpacity="1" offset="0.5" />
          <stop stopColor={beamColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

/* =========================================================================
 * 2. MAGIC UI ORBITING CIRCLES
 * Source Inspiration: Magic UI `Orbiting Circles`
 * Description: Concentric CAD orbital tracks with satellites revolving around
 *              a central AST root nucleus at configurable speeds and radii.
 * ========================================================================= */

export interface OrbitingSatellite {
  id: string;
  label: string;
  icon?: React.ReactNode;
  speed?: number; // seconds per revolution
  radius: number; // distance in px from center
  reverse?: boolean;
}

export interface MagicUIOrbitingCirclesProps {
  centerContent?: React.ReactNode;
  satellites: OrbitingSatellite[];
  className?: string;
}

export const MagicUIOrbitingCircles: React.FC<MagicUIOrbitingCirclesProps> = ({
  centerContent = (
    <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#FFB000] flex items-center justify-center text-[10px] font-mono text-[#FFB000] font-bold shadow-[0_0_15px_rgba(255,176,0,0.2)]">
      AST_CORE
    </div>
  ),
  satellites,
  className = '',
}) => {
  // Unique radii for drawing track rings
  const trackRadii = Array.from(new Set(satellites.map((s) => s.radius)));

  return (
    <div className={`relative flex items-center justify-center w-80 h-80 select-none ${className}`}>
      {/* Concentric CAD Orbit Track Rings */}
      {trackRadii.map((radius, idx) => (
        <div
          key={idx}
          className="absolute rounded-full border border-dashed border-[#262626] pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
          }}
        />
      ))}

      {/* Central Nucleus */}
      <div className="relative z-10">{centerContent}</div>

      {/* Orbiting Satellites */}
      {satellites.map((satellite) => {
        const speed = satellite.speed || 12;
        const animationStyle: React.CSSProperties = {
          width: satellite.radius * 2,
          height: satellite.radius * 2,
          animation: `orbit-rotate ${speed}s linear infinite ${
            satellite.reverse ? 'reverse' : 'normal'
          }`,
        };

        return (
          <div
            key={satellite.id}
            className="absolute rounded-full pointer-events-none flex items-center justify-center"
            style={animationStyle}
          >
            {/* Satellite Badge positioned on track perimeter */}
            <div
              className="absolute -top-3.5 flex items-center gap-1 px-2 py-0.5 bg-[#121212] border border-[#2E2E2E] rounded-xs font-mono text-[9px] text-[#CCCCCC] shadow-lg pointer-events-auto hover:border-[#FFB000] transition-colors"
              style={{
                // Counter-rotate text so it stays upright
                animation: `orbit-rotate ${speed}s linear infinite ${
                  satellite.reverse ? 'normal' : 'reverse'
                }`,
              }}
            >
              {satellite.icon && <span>{satellite.icon}</span>}
              <span>{satellite.label}</span>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes orbit-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
 * 3. MAGIC UI NUMBER TICKER
 * Source Inspiration: Magic UI `Number Ticker`
 * Description: Monospace spring-interpolated numerical ticker smoothly
 *              interpolating integers and decimals (LOC, Halstead Volume).
 * ========================================================================= */

export interface MagicUINumberTickerProps {
  value: number;
  decimalPlaces?: number;
  direction?: 'up' | 'down';
  delay?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const MagicUINumberTicker: React.FC<MagicUINumberTickerProps> = ({
  value,
  decimalPlaces = 0,
  direction = 'up',
  delay = 0,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(direction === 'down' ? value : 0);
  const springVal = useSpring(motionVal, {
    damping: 30,
    stiffness: 120,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      motionVal.set(direction === 'down' ? 0 : value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [motionVal, value, direction, delay]);

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${latest.toLocaleString('en-US', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        })}${suffix}`;
      }
    });
    return () => unsubscribe();
  }, [springVal, decimalPlaces, prefix, suffix]);

  return (
    <span
      ref={ref}
      className={`inline-block font-mono tabular-nums font-bold tracking-tight text-white ${className}`}
    >
      {prefix}0{suffix}
    </span>
  );
};

/* =========================================================================
 * 4. MAGIC UI BENTO GRID & BENTO CARD
 * Source Inspiration: Magic UI `Bento Grid`
 * Description: High-density CAD Bento Grid system with 1px steel borders,
 *              corner reticle crosshairs, and hover spotlight reveal.
 * ========================================================================= */

export interface MagicUIBentoCardProps {
  tag?: string;
  title: string;
  description: string;
  graphic?: React.ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const MagicUIBentoGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 w-full font-mono ${className}`}>
      {children}
    </div>
  );
};

export const MagicUIBentoCard: React.FC<MagicUIBentoCardProps> = ({
  tag = 'NODE_CLUSTER',
  title,
  description,
  graphic,
  colSpan = 1,
  rowSpan = 1,
  ctaText = 'INSPECT_NODE →',
  onCtaClick,
  className = '',
}) => {
  const colSpanClasses = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }[colSpan];

  const rowSpanClasses = {
    1: 'md:row-span-1',
    2: 'md:row-span-2',
  }[rowSpan];

  return (
    <div
      className={`group relative flex flex-col justify-between p-5 bg-[#101010] border border-[#262626] rounded-sm overflow-hidden transition-all duration-200 hover:border-[#383838] ${colSpanClasses} ${rowSpanClasses} ${className}`}
    >
      {/* Corner Crosshairs */}
      <span className="absolute top-1 left-1 text-[8px] text-[#444444] select-none">┌</span>
      <span className="absolute top-1 right-1 text-[8px] text-[#444444] select-none">┐</span>
      <span className="absolute bottom-1 left-1 text-[8px] text-[#444444] select-none">└</span>
      <span className="absolute bottom-1 right-1 text-[8px] text-[#444444] select-none">┘</span>

      {/* Top Header Tag */}
      <div className="flex items-center justify-between text-[9px] text-[#737373] tracking-widest uppercase mb-3 relative z-10">
        <span>[{tag}]</span>
        <span className="w-1.5 h-1.5 bg-[#FFB000]" />
      </div>

      {/* Graphic Canvas / Visual Slot */}
      {graphic && (
        <div className="my-auto py-3 flex items-center justify-center relative z-10 overflow-hidden">
          {graphic}
        </div>
      )}

      {/* Text Info */}
      <div className="relative z-10 mt-auto pt-3 border-t border-[#1C1C1C]">
        <h3 className="text-sm font-bold text-white uppercase tracking-tight">{title}</h3>
        <p className="text-xs text-[#888888] mt-1 leading-relaxed">{description}</p>

        {/* Action Link */}
        {ctaText && (
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-3 inline-flex items-center text-[10px] text-[#FFB000] font-bold tracking-wider uppercase hover:underline cursor-pointer"
          >
            {ctaText}
          </button>
        )}
      </div>

      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB000]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

/* =========================================================================
 * 5. MAGIC UI MARQUEE (TELEMETRY & LOG STREAMER)
 * Source Inspiration: Magic UI `Marquee`
 * Description: Continuous hardware-accelerated horizontal or vertical stream
 *              for live AST warnings, git commits, or telemetry records.
 * ========================================================================= */

export interface MagicUIMarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // Duration in seconds
  pauseOnHover?: boolean;
  className?: string;
}

export const MagicUIMarquee: React.FC<MagicUIMarqueeProps> = ({
  children,
  direction = 'left',
  speed = 25,
  pauseOnHover = true,
  className = '',
}) => {
  return (
    <div
      className={`group flex overflow-hidden select-none gap-4 bg-[#0A0A0A] border-y border-[#262626] py-2 font-mono ${className}`}
    >
      <div
        className={`flex shrink-0 items-center justify-around gap-4 min-w-full ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: `marquee-scroll ${speed}s linear infinite ${
            direction === 'right' ? 'reverse' : 'normal'
          }`,
        }}
      >
        {children}
      </div>

      {/* Cloned Set for Seamless Infinite Loop */}
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-around gap-4 min-w-full ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
        style={{
          animation: `marquee-scroll ${speed}s linear infinite ${
            direction === 'right' ? 'reverse' : 'normal'
          }`,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

/* =========================================================================
 * 6. MAGIC UI HYPER TEXT (CYBER SCRAMBLE DECRYPTOR)
 * Source Inspiration: Magic UI `Hyper Text`
 * Description: Monospace string that scrambles rapidly through random glyphs
 *              and sequentially locks into target characters on hover/trigger.
 * ========================================================================= */

export interface MagicUIHyperTextProps {
  text: string;
  duration?: number;
  className?: string;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@$&*[]<>';

export const MagicUIHyperText: React.FC<MagicUIHyperTextProps> = ({
  text,
  duration = 800,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const steps = 12;
    const intervalTime = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const lockedCharsCount = Math.floor(progress * text.length);

      const scrambled = text
        .split('')
        .map((char, idx) => {
          if (char === ' ') return ' ';
          if (idx < lockedCharsCount) return text[idx];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (step >= steps) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, intervalTime);
  };

  return (
    <span
      onMouseEnter={scramble}
      className={`inline-block font-mono cursor-pointer transition-colors duration-150 ${
        isScrambling ? 'text-[#FFB000]' : 'text-white hover:text-[#FFB000]'
      } ${className}`}
    >
      {displayText}
    </span>
  );
};
