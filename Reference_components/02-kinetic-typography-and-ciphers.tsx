/**
 * MASTER REFERENCE COMPONENT 02: KINETIC TYPOGRAPHY & CIPHERS
 * Sources: Aceternity UI (Split-Flap Display), React Bits (Variable Proximity & Text Scramble)
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Steel (#262626), Stark White (#FFFFFF),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981)
 *
 * PROMPT FOR SUBAGENTS:
 * "Replace standard static headers and badges with mechanical kinetic typography. Use the Split-Flap
 * mechanical display for git commit hashes and system counters, the Monospace Decryption Cipher for
 * telemetry telemetry readouts, and Variable Proximity for interactive CAD section labels."
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =========================================================================
 * 1. ACETERNITY MECHANICAL SPLIT-FLAP DISPLAY
 * Source Inspiration: Aceternity UI / Solari mechanical split-flap boards
 * Description: Tactile mechanical split-flap board that flips top-to-bottom
 *              with realistic 3D perspective and horizontal flap seam.
 * ========================================================================= */

interface SplitFlapCharProps {
  targetChar: string;
  delay?: number;
}

const CHAR_SET = ' 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_:-/[]';

export const SplitFlapChar: React.FC<SplitFlapCharProps> = ({ targetChar, delay = 0 }) => {
  const [currentChar, setCurrentChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    let timeoutId: any;
    const normalizedTarget = targetChar.toUpperCase();

    timeoutId = setTimeout(() => {
      let currentIndex = CHAR_SET.indexOf(currentChar);
      const targetIndex = CHAR_SET.indexOf(normalizedTarget);

      if (currentIndex === -1) currentIndex = 0;
      if (targetIndex === -1) {
        setCurrentChar(normalizedTarget);
        return;
      }

      // Step through characters toward target
      const stepInterval = setInterval(() => {
        setIsFlipping(true);
        setCurrentChar((prev) => {
          const idx = CHAR_SET.indexOf(prev);
          if (idx === targetIndex) {
            clearInterval(stepInterval);
            setIsFlipping(false);
            return prev;
          }
          const nextIdx = (idx + 1) % CHAR_SET.length;
          return CHAR_SET[nextIdx];
        });
      }, 45);

      return () => clearInterval(stepInterval);
    }, delay * 1000);

    return () => clearTimeout(timeoutId);
  }, [targetChar, delay]);

  return (
    <div
      className="relative w-7 h-10 bg-[#121212] border border-[#262626] rounded-sm overflow-hidden flex flex-col items-center justify-center font-mono select-none"
      style={{ perspective: '300px' }}
    >
      {/* Top Half Flap */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[#1A1A1A] border-b border-[#0A0A0A] flex items-end justify-center overflow-hidden">
        <span className="text-white text-base font-bold translate-y-[50%]">{currentChar}</span>
      </div>

      {/* Bottom Half Flap */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#141414] flex items-start justify-center overflow-hidden">
        <span className="text-white text-base font-bold -translate-y-[50%]">{currentChar}</span>
      </div>

      {/* Flipping Leaf Animation */}
      <AnimatePresence>
        {isFlipping && (
          <motion.div
            key={currentChar}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeIn' }}
            style={{ transformOrigin: 'bottom', backfaceVisibility: 'hidden' }}
            className="absolute inset-x-0 top-0 h-1/2 bg-[#222222] border-b border-[#0A0A0A] flex items-end justify-center overflow-hidden z-10"
          >
            <span className="text-[#FFB000] text-base font-bold translate-y-[50%]">{currentChar}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flap Horizontal Seam Line */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#0A0A0A] z-20 shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export interface SplitFlapBoardProps {
  text: string;
  stagger?: number;
  label?: string;
}

export const SplitFlapBoard: React.FC<SplitFlapBoardProps> = ({
  text,
  stagger = 0.08,
  label = 'SYSTEM_HASH',
}) => {
  const characters = text.split('');

  return (
    <div className="inline-block p-2 bg-[#0A0A0A] border border-[#222222] rounded shadow-inner">
      {label && (
        <div className="font-mono text-[9px] text-[#666666] uppercase tracking-widest mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
        </div>
      )}
      <div className="flex items-center gap-1">
        {characters.map((char, index) => (
          <SplitFlapChar key={index} targetChar={char} delay={index * stagger} />
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
 * 2. MONOSPACE DECRYPTION CIPHER (TEXT SCRAMBLER)
 * Source Inspiration: React Bits / Hacker Decryption Animation
 * Description: Random mechanical cryptographic cipher that settles
 *              into final text character-by-character.
 * ========================================================================= */

const CIPHER_GLYPHS = '0123456789ABCDEF!@#$%^&*<>[]_=+~';

export interface DecryptionCipherProps {
  text: string;
  speed?: number; // ms per frame
  scrambleRounds?: number;
  triggerOnHover?: boolean;
  className?: string;
  phosphorAccent?: boolean;
}

export const MonospaceDecryptionCipher: React.FC<DecryptionCipherProps> = ({
  text,
  speed = 30,
  scrambleRounds = 3,
  triggerOnHover = false,
  className = '',
  phosphorAccent = false,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = useRef(text);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let frame = 0;
    const totalFrames = text.length * scrambleRounds;

    const interval = setInterval(() => {
      frame++;
      const revealedLength = Math.floor(frame / scrambleRounds);

      const scrambled = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < revealedLength) return char;
          return CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
        })
        .join('');

      setDisplayText(scrambled);

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (!triggerOnHover) {
      startScramble();
    }
  }, [text]);

  return (
    <span
      onMouseEnter={() => {
        if (triggerOnHover) startScramble();
      }}
      className={`font-mono transition-colors duration-150 select-none ${
        isScrambling
          ? phosphorAccent
            ? 'text-[#FFB000]'
            : 'text-[#10B981]'
          : 'text-white'
      } ${className}`}
    >
      {displayText}
    </span>
  );
};

/* =========================================================================
 * 3. VARIABLE PROXIMITY KINETIC TEXT
 * Source Inspiration: React Bits Variable Proximity
 * Description: Font weight & letter spacing morph dynamically as cursor
 *              nears the target letters.
 * ========================================================================= */

export interface VariableProximityTextProps {
  label: string;
  radius?: number; // Distance in px where proximity activates
  className?: string;
}

export const VariableProximityText: React.FC<VariableProximityTextProps> = ({
  label,
  radius = 120,
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
      className={`inline-flex items-center select-none font-mono ${className}`}
    >
      {label.split('').map((char, i) => (
        <LetterProximitySpan
          key={i}
          char={char}
          mousePos={mousePos}
          radius={radius}
        />
      ))}
    </div>
  );
};

interface LetterSpanProps {
  char: string;
  mousePos: { x: number; y: number };
  radius: number;
}

const LetterProximitySpan: React.FC<LetterSpanProps> = ({ char, mousePos, radius }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [weight, setWeight] = useState(400);
  const [color, setColor] = useState('#CCCCCC');

  useEffect(() => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);

    if (dist < radius) {
      const factor = 1 - dist / radius; // 0 to 1
      const targetWeight = Math.round(400 + factor * 500); // 400 -> 900
      setWeight(targetWeight);
      setColor(factor > 0.6 ? '#FFB000' : '#FFFFFF');
    } else {
      setWeight(400);
      setColor('#CCCCCC');
    }
  }, [mousePos, radius]);

  return (
    <span
      ref={spanRef}
      style={{ fontWeight: weight, color }}
      className="transition-all duration-100 ease-out"
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  );
};
