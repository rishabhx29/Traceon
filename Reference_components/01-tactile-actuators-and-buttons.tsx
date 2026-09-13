/**
 * MASTER REFERENCE COMPONENT 01: TACTILE ACTUATORS & BUTTONS
 * Sources: Vengeance UI (vengenceui.com), Mil-Spec Industrial CAD
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Implement tactile mechanical actuators instead of generic pill buttons. Use 1px steel hairline
 * borders, physical keycap depth (active:translate-y-[2px]), CAD corner reticles (+), and real
 * phosphor LED indicator diodes. Adhere strictly to the Obsidian Industrial palette."
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, ArrowRight, Check, Power } from 'lucide-react';

/* =========================================================================
 * 1. VENGEANCE POP ACTUATOR
 * Source Inspiration: Vengeance UI Pop Button
 * Description: Mechanical keycap button with spring physics, sub-millimeter
 *              tactile depression, carbon chassis, and live phosphor LED diode.
 * ========================================================================= */

export interface PopActuatorProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'nominal' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  ledStatus?: 'active' | 'nominal' | 'alert' | 'standby';
  icon?: React.ReactNode;
}

export const VengeancePopActuator: React.FC<PopActuatorProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ledStatus = 'active',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Mechanical Spring Configurations
  const springTransition = {
    type: 'spring',
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs tracking-wider gap-2',
    md: 'px-5 py-2.5 text-sm tracking-wide gap-2.5',
    lg: 'px-7 py-3.5 text-base tracking-wide gap-3',
  };

  const variantStyles = {
    primary: {
      chassis: 'bg-[#121212] border-[#262626] shadow-[0_4px_0_0_#0A0A0A]',
      pressedChassis: 'shadow-[0_1px_0_0_#0A0A0A] translate-y-[3px]',
      keycap: 'bg-[#1A1A1A] border-[#333333] text-white hover:bg-[#222222]',
      accent: '#FFB000',
    },
    secondary: {
      chassis: 'bg-[#0F0F0F] border-[#222222] shadow-[0_3px_0_0_#050505]',
      pressedChassis: 'shadow-[0_1px_0_0_#050505] translate-y-[2px]',
      keycap: 'bg-[#141414] border-[#262626] text-[#CCCCCC] hover:text-white',
      accent: '#737373',
    },
    nominal: {
      chassis: 'bg-[#101914] border-[#133E2B] shadow-[0_4px_0_0_#050A07]',
      pressedChassis: 'shadow-[0_1px_0_0_#050A07] translate-y-[3px]',
      keycap: 'bg-[#13271C] border-[#1B4D36] text-[#10B981] hover:bg-[#183324]',
      accent: '#10B981',
    },
    alert: {
      chassis: 'bg-[#210D0D] border-[#4A1616] shadow-[0_4px_0_0_#0C0404]',
      pressedChassis: 'shadow-[0_1px_0_0_#0C0404] translate-y-[3px]',
      keycap: 'bg-[#2E1212] border-[#5E1E1E] text-[#FF3333] hover:bg-[#3D1818]',
      accent: '#FF3333',
    },
  };

  const ledColorMap = {
    active: 'bg-[#FFB000] shadow-[0_0_8px_#FFB000]',
    nominal: 'bg-[#10B981] shadow-[0_0_8px_#10B981]',
    alert: 'bg-[#FF3333] shadow-[0_0_8px_#FF3333]',
    standby: 'bg-[#404040]',
  };

  const current = variantStyles[variant];

  return (
    <div className={`relative inline-block select-none ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
      {/* Mechanical Button Frame / Chassis */}
      <motion.button
        disabled={disabled}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        transition={springTransition}
        className={`
          relative flex items-center justify-center font-mono font-medium uppercase
          border rounded transition-all duration-75 outline-none
          ${current.chassis}
          ${isPressed ? current.pressedChassis : ''}
          ${sizeClasses[size]}
          ${className}
        `}
        {...(props as any)}
      >
        {/* Phosphor Micro LED Status Diode */}
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1 transition-colors duration-200 ${ledColorMap[ledStatus]}`}
          aria-hidden="true"
        />

        {/* Optional Icon */}
        {icon && <span className="inline-flex items-center justify-center">{icon}</span>}

        {/* Action Label */}
        <span className="tracking-widest font-semibold">{children}</span>

        {/* Micro Bevel Top Highlight Line */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 pointer-events-none" />
      </motion.button>
    </div>
  );
};

/* =========================================================================
 * 2. CAD CORNER RETICLE BUTTON
 * Source Inspiration: Industrial Blueprint Crosshair Controls
 * Description: Precision border button with calibrated '+' crosshairs at
 *              all four corners and a linear laser sweep upon hover.
 * ========================================================================= */

export interface CadCornerReticleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  tag?: string; // e.g. "ACT-01", "RUN", "DIFF"
  glowColor?: 'amber' | 'emerald' | 'vermilion' | 'white';
}

export const CadCornerReticleButton: React.FC<CadCornerReticleButtonProps> = ({
  children,
  tag = 'SYS-REQ',
  glowColor = 'amber',
  className = '',
  ...props
}) => {
  const [hovered, setHovered] = useState(false);

  const glowStyles = {
    amber: 'group-hover:border-[#FFB000] group-hover:text-[#FFB000]',
    emerald: 'group-hover:border-[#10B981] group-hover:text-[#10B981]',
    vermilion: 'group-hover:border-[#FF3333] group-hover:text-[#FF3333]',
    white: 'group-hover:border-white group-hover:text-white',
  };

  const sweepStyles = {
    amber: 'from-transparent via-[#FFB000]/20 to-transparent',
    emerald: 'from-transparent via-[#10B981]/20 to-transparent',
    vermilion: 'from-transparent via-[#FF3333]/20 to-transparent',
    white: 'from-transparent via-white/20 to-transparent',
  };

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative px-6 py-3 font-mono text-xs uppercase tracking-widest
        bg-[#0D0D0D] text-[#CCCCCC] border border-[#262626] transition-colors duration-200
        hover:bg-[#141414] ${glowStyles[glowColor]} ${className}
      `}
      {...props}
    >
      {/* 4 CAD Hairline Corner Reticles (+) */}
      <span className="absolute -top-[5px] -left-[5px] font-mono text-[10px] text-[#555555] group-hover:text-[#FFB000] transition-colors pointer-events-none">+</span>
      <span className="absolute -top-[5px] -right-[5px] font-mono text-[10px] text-[#555555] group-hover:text-[#FFB000] transition-colors pointer-events-none">+</span>
      <span className="absolute -bottom-[5px] -left-[5px] font-mono text-[10px] text-[#555555] group-hover:text-[#FFB000] transition-colors pointer-events-none">+</span>
      <span className="absolute -bottom-[5px] -right-[5px] font-mono text-[10px] text-[#555555] group-hover:text-[#FFB000] transition-colors pointer-events-none">+</span>

      {/* Engineering Tag Monospace Header */}
      <span className="block text-[8px] text-[#666666] tracking-tighter mb-0.5 pointer-events-none">
        [{tag}]
      </span>

      {/* Button Content */}
      <span className="flex items-center justify-center gap-2 font-bold">
        {children}
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
      </span>

      {/* Hover Laser Scan Beam Sweep */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className={`absolute inset-y-0 w-24 bg-gradient-to-r ${sweepStyles[glowColor]} pointer-events-none`}
          />
        )}
      </AnimatePresence>
    </button>
  );
};

/* =========================================================================
 * 3. LASER ABORT ACTUATOR (MIL-SPEC GUARDED BUTTON)
 * Source Inspiration: Nuclear/Aerospace Guarded Emergency Abort Controls
 * Description: Striped caution boundary, dual safety-slide latch,
 *              high-contrast vermilion execution triggers.
 * ========================================================================= */

export interface LaserAbortActuatorProps {
  label: string;
  onExecute: () => void;
  countdownSeconds?: number;
}

export const LaserAbortActuator: React.FC<LaserAbortActuatorProps> = ({
  label,
  onExecute,
  countdownSeconds = 3,
}) => {
  const [armed, setArmed] = useState(false);
  const [timer, setTimer] = useState(countdownSeconds);

  const toggleArm = () => {
    if (!armed) {
      setArmed(true);
      setTimer(countdownSeconds);
    } else {
      setArmed(false);
    }
  };

  return (
    <div className="p-3 border border-[#331111] bg-[#140808] rounded flex items-center justify-between gap-4 font-mono text-xs">
      <div className="flex items-center gap-3">
        <ShieldAlert className={`w-5 h-5 ${armed ? 'text-[#FF3333] animate-pulse' : 'text-[#773333]'}`} />
        <div>
          <div className="font-bold text-white uppercase tracking-wider">{label}</div>
          <div className="text-[10px] text-[#AA5555]">
            {armed ? `WARNING: ARMED. PRESS EXECUTE TO COMMIT.` : 'SYSTEM GUARD ACTIVE. UNLATCH TO ARM.'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Safety Interlock Latch Toggle */}
        <button
          onClick={toggleArm}
          className={`
            px-3 py-1.5 border text-[10px] tracking-widest uppercase transition-all
            ${armed ? 'bg-[#FFB000] text-black border-[#FFB000] font-bold' : 'bg-[#1C1C1C] text-[#888888] border-[#333333] hover:text-white'}
          `}
        >
          {armed ? 'DISARM' : 'ARM SYSTEM'}
        </button>

        {/* Execution Trigger Button */}
        <button
          disabled={!armed}
          onClick={() => {
            if (armed) {
              onExecute();
              setArmed(false);
            }
          }}
          className={`
            px-4 py-1.5 border uppercase font-bold tracking-wider text-[11px] transition-all
            ${
              armed
                ? 'bg-[#FF3333] text-white border-[#FF3333] shadow-[0_0_12px_#FF3333] hover:bg-[#FF4D4D] active:translate-y-0.5'
                : 'bg-[#1A1A1A] text-[#444444] border-[#282828] cursor-not-allowed'
            }
          `}
        >
          EXECUTE
        </button>
      </div>
    </div>
  );
};
