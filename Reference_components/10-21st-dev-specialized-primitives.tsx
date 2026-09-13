/**
 * MASTER REFERENCE COMPONENT 10: 21ST.DEV SPECIALIZED PRIMITIVES
 * Sources: 21st.dev (Living Component Library - community.21st.dev)
 * Components Included:
 *   1. CadAnimatedFileTree (Interactive IDE AST & file explorer with SVG branch lines)
 *   2. CadTerminalSimulator (Simulated CLI with animated stdout, tabs, and ANSI styling)
 *   3. CadCircularGauge (Precision 270-degree metric arc with segmented ticks)
 *   4. CadBrailleSpinner (Monospace terminal activity spinner for background analysis)
 *   5. CadActivityHeatmapMatrix (Temporal commit frequency & code churn heatmap)
 *   6. CadMilSpecPromptInput (Command palette bar with keyboard shortcuts and execution trigger)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these 21st.dev specialized primitives for repository exploration, CLI command demonstrations,
 * live telemetry gauges, and background task progress. Avoid generic OS styles; use strict CAD hairline
 * borders, monospace readouts, and Phosphor LED indicators."
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FolderOpen, FileCode, ChevronRight, ChevronDown, Terminal, Copy, Check, Play, CornerDownLeft, GitCommit } from 'lucide-react';

/* =========================================================================
 * 1. CAD ANIMATED FILE TREE
 * Source Inspiration: 21st.dev File Tree / IDE Recursive Explorer
 * Description: Interactive collapsible file hierarchy with SVG tree branch
 *              connectors, risk badges, and line count indicators.
 * ========================================================================= */

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  loc?: number;
  risk?: 'nominal' | 'warning' | 'critical';
}

export interface CadAnimatedFileTreeProps {
  data: TreeNode[];
  activeFileId?: string;
  onSelectFile?: (node: TreeNode) => void;
  className?: string;
}

export const CadAnimatedFileTree: React.FC<CadAnimatedFileTreeProps> = ({
  data,
  activeFileId,
  onSelectFile,
  className = '',
}) => {
  return (
    <div className={`p-3 bg-[#0E0E0E] border border-[#262626] rounded font-mono text-xs select-none ${className}`}>
      <div className="text-[9px] text-[#666666] uppercase tracking-widest pb-2 mb-2 border-b border-[#1C1C1C] flex items-center justify-between">
        <span>REPOSITORY AST EXPLORER</span>
        <span className="text-[#FFB000]">READY</span>
      </div>

      <div className="space-y-0.5">
        {data.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            depth={0}
            activeFileId={activeFileId}
            onSelectFile={onSelectFile}
          />
        ))}
      </div>
    </div>
  );
};

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  activeFileId?: string;
  onSelectFile?: (node: TreeNode) => void;
}

const TreeItem: React.FC<TreeItemProps> = ({ node, depth, activeFileId, onSelectFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = activeFileId === node.id;

  const riskBadge = {
    nominal: 'text-[#10B981] border-[#10B981]/40 bg-[#10B981]/10',
    warning: 'text-[#FFB000] border-[#FFB000]/40 bg-[#FFB000]/10',
    critical: 'text-[#FF3333] border-[#FF3333]/40 bg-[#FF3333]/10',
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else if (onSelectFile) {
      onSelectFile(node);
    }
  };

  return (
    <div>
      <div
        onClick={handleToggle}
        style={{ paddingLeft: `${depth * 14 + 4}px` }}
        className={`
          flex items-center justify-between py-1 px-2 rounded-sm cursor-pointer transition-colors
          ${isSelected ? 'bg-[#1C1C1C] text-white border-l-2 border-[#FFB000]' : 'text-[#AAAAAA] hover:bg-[#141414] hover:text-white'}
        `}
      >
        <div className="flex items-center gap-1.5 truncate">
          {node.type === 'folder' ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#888888] shrink-0" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#888888] shrink-0" />
              )}
              {isOpen ? (
                <FolderOpen className="w-3.5 h-3.5 text-[#FFB000] shrink-0" />
              ) : (
                <Folder className="w-3.5 h-3.5 text-[#FFB000] shrink-0" />
              )}
            </>
          ) : (
            <>
              <span className="w-3.5 h-3.5 shrink-0" />
              <FileCode className="w-3.5 h-3.5 text-[#888888] shrink-0" />
            </>
          )}

          <span className="truncate text-[11px]">{node.name}</span>
        </div>

        {node.type === 'file' && (
          <div className="flex items-center gap-2 text-[9px] shrink-0">
            {node.loc && <span className="text-[#666666]">{node.loc}L</span>}
            {node.risk && (
              <span className={`px-1 py-0.2 border text-[8px] uppercase font-bold ${riskBadge[node.risk]}`}>
                {node.risk[0]}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Recursive Children with AnimatePresence */}
      {node.type === 'folder' && isOpen && node.children && (
        <div className="border-l border-[#222222] ml-2">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              activeFileId={activeFileId}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
 * 2. CAD TERMINAL SIMULATOR
 * Source Inspiration: 21st.dev Interactive Terminal
 * Description: High-contrast monospace terminal with animated typing, stdout
 *              streams, tabbed execution views, and copy action.
 * ========================================================================= */

export interface TerminalEntry {
  command: string;
  output: string[];
  durationMs?: number;
}

export interface CadTerminalSimulatorProps {
  entries?: TerminalEntry[];
  title?: string;
  className?: string;
}

export const CadTerminalSimulator: React.FC<CadTerminalSimulatorProps> = ({
  entries = [
    {
      command: 'traceon analyze --target src/core/ast.ts --curism',
      output: [
        '[INFO] Parsing AST hierarchy (2,412 nodes identified)...',
        '[EVAL] Computing Halstead Metric: Volume=4,120, Difficulty=24.8',
        '[WARN] Cyclomatic Hotspot detected: ast.ts:142:parseBranch() (V(G)=18)',
        '[SUCCESS] CURISM Composite Score: 88.4 / 100 (Pass)',
      ],
      durationMs: 412,
    },
  ],
  title = 'TRACEON_TERMINAL_V4',
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OUTPUT' | 'RAW_AST' | 'METRICS'>('OUTPUT');

  const handleCopy = () => {
    const text = entries.map((e) => `${e.command}\n${e.output.join('\n')}`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-[#0A0A0A] border border-[#262626] rounded font-mono text-xs shadow-2xl overflow-hidden ${className}`}>
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121212] border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FF3333]" />
          <div className="w-2 h-2 rounded-full bg-[#FFB000]" />
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] text-[#888888] font-bold tracking-wider ml-2">{title}</span>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#181818] border border-[#2B2B2B] p-0.5 rounded text-[9px]">
            {(['OUTPUT', 'RAW_AST', 'METRICS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-0.5 transition-colors ${activeTab === tab ? 'bg-[#FFB000] text-black font-bold' : 'text-[#888888] hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="p-1 hover:bg-[#1E1E1E] border border-[#2B2B2B] text-[#888888] hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="p-4 space-y-4 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed">
        {entries.map((entry, idx) => (
          <div key={idx} className="space-y-1.5">
            {/* Prompt Line */}
            <div className="flex items-center gap-2 text-white">
              <span className="text-[#FFB000] font-bold">&gt;</span>
              <span className="text-[#888888]">traceon:~$</span>
              <span className="font-bold">{entry.command}</span>
            </div>

            {/* Output Lines */}
            <div className="pl-4 space-y-0.5 text-[#CCCCCC]">
              {entry.output.map((line, lineIdx) => {
                let textColor = 'text-[#CCCCCC]';
                if (line.includes('[WARN]')) textColor = 'text-[#FFB000]';
                if (line.includes('[SUCCESS]')) textColor = 'text-[#10B981]';
                if (line.includes('[ERROR]')) textColor = 'text-[#FF3333]';

                return (
                  <div key={lineIdx} className={textColor}>
                    {line}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Live Blinking Cursor */}
        <div className="flex items-center gap-1.5 text-[#FFB000] pt-1">
          <span className="font-bold">&gt;</span>
          <span className="inline-block w-2 h-3.5 bg-[#FFB000] animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
 * 3. CAD CIRCULAR TELEMETRY GAUGE
 * Source Inspiration: 21st.dev Gauge Line / Industrial Tachometer
 * Description: 270-degree radial gauge with precision ticks, spring needle,
 *              and color threshold zones.
 * ========================================================================= */

export interface CadCircularGaugeProps {
  value: number; // Current value
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  thresholds?: { warning: number; critical: number };
  size?: number;
  className?: string;
}

export const CadCircularGauge: React.FC<CadCircularGaugeProps> = ({
  value,
  min = 0,
  max = 100,
  label,
  unit = '',
  thresholds = { warning: 50, critical: 80 },
  size = 180,
  className = '',
}) => {
  const center = size / 2;
  const radius = center - 20;

  // Gauge spans from 135 deg to 405 deg (270 degree arc)
  const startAngle = 135;
  const endAngle = 405;
  const totalAngle = endAngle - startAngle;

  const normalizedVal = Math.max(min, Math.min(max, value));
  const percentage = (normalizedVal - min) / (max - min);
  const needleAngle = startAngle + percentage * totalAngle;

  const getColor = () => {
    if (value >= thresholds.critical) return '#FF3333';
    if (value >= thresholds.warning) return '#FFB000';
    return '#10B981';
  };

  const currentColor = getColor();

  return (
    <div className={`inline-flex flex-col items-center bg-[#0C0C0C] border border-[#262626] p-4 rounded font-mono select-none ${className}`}>
      <div className="relative">
        <svg width={size} height={size}>
          {/* Background Outer Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#1C1C1C"
            strokeWidth="8"
            strokeDasharray={`${radius * Math.PI * 1.5} ${radius * Math.PI * 2}`}
            strokeDashoffset={0}
            style={{ transform: `rotate(135deg)`, transformOrigin: 'center' }}
          />

          {/* Active Arc Fill */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={currentColor}
            strokeWidth="8"
            strokeDasharray={`${radius * Math.PI * 1.5 * percentage} ${radius * Math.PI * 2}`}
            strokeDashoffset={0}
            style={{ transform: `rotate(135deg)`, transformOrigin: 'center' }}
            className="transition-all duration-300"
          />

          {/* Calibrated Tick Marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = (startAngle + (i / 10) * totalAngle) * (Math.PI / 180);
            const x1 = center + Math.cos(angle) * (radius - 12);
            const y1 = center + Math.sin(angle) * (radius - 12);
            const x2 = center + Math.cos(angle) * (radius - 6);
            const y2 = center + Math.sin(angle) * (radius - 6);

            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#444444" strokeWidth="1.5" />;
          })}
        </svg>

        {/* Needle Line with Spring Rotation */}
        <motion.div
          animate={{ rotate: needleAngle - 90 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ width: size, height: size, transformOrigin: 'center' }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            style={{ height: radius - 8, backgroundColor: currentColor }}
            className="w-[2px] -translate-y-1/2 shadow-[0_0_8px_currentColor]"
          />
        </motion.div>

        {/* Center Diode Hub */}
        <div
          style={{ backgroundColor: currentColor }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#0A0A0A] shadow"
        />
      </div>

      {/* Numeric Value Readout */}
      <div className="mt-2 text-center">
        <div className="text-xl font-bold text-white tracking-wider">
          {value} {unit}
        </div>
        <div className="text-[9px] text-[#777777] uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
};

/* =========================================================================
 * 4. CAD BRAILLE SPINNER
 * Source Inspiration: 21st.dev CLI Spinner Loader
 * Description: Monospace terminal spinner using braille character frames
 *              for asynchronous code evaluation and git diff tracking.
 * ========================================================================= */

const BRAILLE_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export interface CadBrailleSpinnerProps {
  label?: string;
  speed?: number; // ms per frame
  color?: 'amber' | 'emerald' | 'vermilion' | 'white';
}

export const CadBrailleSpinner: React.FC<CadBrailleSpinnerProps> = ({
  label = 'PROCESSING AST...',
  speed = 80,
  color = 'amber',
}) => {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % BRAILLE_FRAMES.length);
    }, speed);
    return () => clearInterval(timer);
  }, [speed]);

  const colorMap = {
    amber: 'text-[#FFB000]',
    emerald: 'text-[#10B981]',
    vermilion: 'text-[#FF3333]',
    white: 'text-white',
  };

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs select-none">
      <span className={`text-sm font-bold ${colorMap[color]}`}>{BRAILLE_FRAMES[frameIdx]}</span>
      <span className="text-[#AAAAAA] tracking-wider text-[11px]">{label}</span>
    </div>
  );
};

/* =========================================================================
 * 5. CAD ACTIVITY HEATMAP MATRIX
 * Source Inspiration: 21st.dev Activity Grid / Churn Matrix
 * Description: Commit & code churn activity calendar showing temporal hotspot
 *              intensity across repository branches.
 * ========================================================================= */

export interface CadActivityHeatmapMatrixProps {
  weeks?: number; // Number of columns (default 24)
  label?: string;
  className?: string;
}

export const CadActivityHeatmapMatrix: React.FC<CadActivityHeatmapMatrixProps> = ({
  weeks = 20,
  label = 'TEMPORAL CHURN & COMMIT FREQUENCY',
  className = '',
}) => {
  // Deterministic sample data generator
  const levels = [
    'bg-[#141414]', // 0: none
    'bg-[#0D261A]', // 1: low
    'bg-[#134D2E]', // 2: med
    'bg-[#10B981]', // 3: nominal peak
    'bg-[#FFB000]', // 4: churn warning
  ];

  return (
    <div className={`p-4 bg-[#0E0E0E] border border-[#262626] rounded font-mono ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1C1C1C] text-xs">
        <span className="text-white font-bold tracking-wider">{label}</span>
        <div className="flex items-center gap-1 text-[9px] text-[#666666]">
          <span>LOW</span>
          {levels.map((lvl, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-none border border-[#222222] ${lvl}`} />
          ))}
          <span>HIGH</span>
        </div>
      </div>

      {/* Grid of 7 days x N weeks */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {Array.from({ length: weeks }).map((_, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              // Deterministic pseudo level
              const seed = (weekIdx * 7 + dayIdx) % 19;
              let levelIdx = 0;
              if (seed % 3 === 0) levelIdx = 1;
              if (seed % 5 === 0) levelIdx = 2;
              if (seed % 7 === 0) levelIdx = 3;
              if (seed === 14) levelIdx = 4; // High churn hotspot

              return (
                <div
                  key={dayIdx}
                  className={`w-3 h-3 rounded-none border border-[#1C1C1C] ${levels[levelIdx]} hover:border-[#FFB000] cursor-pointer transition-colors`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
 * 6. CAD MIL-SPEC PROMPT INPUT BAR
 * Source Inspiration: 21st.dev AI Input Prompt Bar
 * Description: Command bar with terminal prompt glyph, shortcut indicator,
 *              target AST selector, and tactile execute keycap.
 * ========================================================================= */

export interface CadMilSpecPromptInputProps {
  placeholder?: string;
  onExecute?: (command: string) => void;
  className?: string;
}

export const CadMilSpecPromptInput: React.FC<CadMilSpecPromptInputProps> = ({
  placeholder = 'Query AST symbol or run metric audit...',
  onExecute,
  className = '',
}) => {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onExecute && inputVal.trim()) {
      onExecute(inputVal);
      setInputVal('');
    }
  };

  return (
    <div className={`relative flex items-center bg-[#0F0F0F] border border-[#262626] font-mono text-xs shadow-xl ${className}`}>
      {/* Terminal Prompt Glyph */}
      <div className="flex items-center gap-1.5 px-3 py-2.5 text-[#FFB000] border-r border-[#222222] select-none">
        <Terminal className="w-3.5 h-3.5" />
        <span className="font-bold">&gt;_</span>
      </div>

      {/* Main Text Input */}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-3 py-2.5 text-white placeholder-[#555555] outline-none font-mono text-xs"
      />

      {/* Keyboard Shortcut Indicator */}
      <div className="px-2 py-1 bg-[#181818] border border-[#2A2A2A] text-[9px] text-[#777777] rounded-none mr-2 select-none">
        [ENTER ↵]
      </div>

      {/* Execute Actuator Button */}
      <button
        onClick={() => {
          if (onExecute && inputVal.trim()) {
            onExecute(inputVal);
            setInputVal('');
          }
        }}
        className="px-3 py-2 bg-[#1C1C1C] hover:bg-[#252525] border-l border-[#262626] text-[#FFB000] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors"
      >
        <Play className="w-3 h-3 fill-current" />
        RUN
      </button>
    </div>
  );
};
