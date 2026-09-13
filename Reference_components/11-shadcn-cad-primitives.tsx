/**
 * MASTER REFERENCE COMPONENT 11: SHADCN INDUSTRIAL CAD PRIMITIVES
 * Sources: shadcn/ui (ui.shadcn.com) adapted to TraceOn Obsidian Industrial CAD
 * Components Included:
 *   1. CadCommandDialog (⌘K Command Center with keyboard navigation & filters)
 *   2. CadTabs (Industrial segmented telemetry view switcher with layoutId spring)
 *   3. CadAccordion (Collapsible metric & rule checklist inspection drawer)
 *   4. CadTelemetryTable (High-density sortable monospace data matrix)
 *   5. CadTooltip & CadPopover (Precision hover inspector with hairline crosshairs)
 *   6. CadResizablePanels (Draggable split-view layout for AST canvas & sidecar)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these shadcn CAD primitives whenever modals, tabs, tables, tooltips, or command bars
 * are required. Never use generic rounded shadcn pill styles or default slate/indigo colors.
 * Strict adherence to 1px steel borders, monospace typography, and Phosphor LED status diodes."
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  Check,
  X,
  Layers,
  Cpu,
  GitCommit,
  ShieldAlert,
  GripVertical,
} from 'lucide-react';

/* =========================================================================
 * 1. CAD COMMAND DIALOG (⌘K COMMAND CENTER)
 * Source Inspiration: shadcn/ui `Command` / `Dialog`
 * Description: High-contrast modal command palette with keyboard navigation,
 *              symbol search, filter categories, and shortcut badges.
 * ========================================================================= */

export interface CommandItem {
  id: string;
  category: 'AST' | 'METRICS' | 'COMMITS' | 'ACTIONS';
  title: string;
  subtitle?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  onSelect: () => void;
}

export interface CadCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export const CadCommandDialog: React.FC<CadCommandDialogProps> = ({ isOpen, onClose, items }) => {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null; // Toggle handled by parent
      }
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((prev) => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIdx]) {
          filteredItems[selectedIdx].onSelect();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIdx]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 font-mono select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl bg-[#0F0F0F] border border-[#262626] shadow-2xl overflow-hidden z-10"
      >
        {/* Corner Reticles (+) */}
        <span className="absolute top-1 left-1.5 text-[10px] text-[#555555] pointer-events-none">+</span>
        <span className="absolute top-1 right-1.5 text-[10px] text-[#555555] pointer-events-none">+</span>
        <span className="absolute bottom-1 left-1.5 text-[10px] text-[#555555] pointer-events-none">+</span>
        <span className="absolute bottom-1 right-1.5 text-[10px] text-[#555555] pointer-events-none">+</span>

        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#222222] bg-[#141414]">
          <Terminal className="w-4 h-4 text-[#FFB000] mr-2.5 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Type command, symbol or metric key..."
            className="flex-1 bg-transparent text-white placeholder-[#555555] outline-none text-xs font-mono"
          />
          <span className="px-1.5 py-0.5 bg-[#1C1C1C] border border-[#333333] text-[9px] text-[#777777]">
            ESC TO EXIT
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#555555]">NO MATCHING CAD SYMBOLS FOUND</div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIdx;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`
                    flex items-center justify-between px-3 py-2 text-xs rounded-sm cursor-pointer transition-colors
                    ${isSelected ? 'bg-[#1C1C1C] text-white border-l-2 border-[#FFB000]' : 'text-[#AAAAAA] hover:bg-[#141414]'}
                  `}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[9px] text-[#FFB000] bg-[#FFB000]/10 border border-[#FFB000]/20 px-1">
                      {item.category}
                    </span>
                    <span className="font-bold text-white truncate">{item.title}</span>
                    {item.subtitle && <span className="text-[#666666] text-[10px] truncate">{item.subtitle}</span>}
                  </div>

                  {item.shortcut && (
                    <span className="px-1.5 py-0.5 bg-[#161616] border border-[#2B2B2B] text-[9px] text-[#888888]">
                      {item.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#1C1C1C] bg-[#0C0C0C] text-[9px] text-[#555555]">
          <span>NAVIGATE: [↑↓]</span>
          <span>SELECT: [ENTER ↵]</span>
          <span>SYSTEM: TRACEON CAD RUNTIME</span>
        </div>
      </motion.div>
    </div>
  );
};

/* =========================================================================
 * 2. CAD TABS (INDUSTRIAL SEGMENTED SWITCHER)
 * Source Inspiration: shadcn/ui `Tabs`
 * Description: Rectangular mechanical tab switcher with spring layout highlight
 *              and micro LED diodes for active state.
 * ========================================================================= */

export interface CadTabItem {
  id: string;
  tag: string;
  label: string;
  badge?: string;
}

export interface CadTabsProps {
  tabs: CadTabItem[];
  activeTab: string;
  onChangeTab: (id: string) => void;
  className?: string;
}

export const CadTabs: React.FC<CadTabsProps> = ({ tabs, activeTab, onChangeTab, className = '' }) => {
  return (
    <div className={`inline-flex items-center bg-[#0C0C0C] border border-[#262626] p-1 font-mono text-xs select-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`
              relative flex items-center gap-2 px-4 py-1.5 transition-colors duration-150 uppercase tracking-wider text-[11px] font-medium outline-none
              ${isActive ? 'text-white font-bold' : 'text-[#777777] hover:text-[#CCCCCC]'}
            `}
          >
            {/* Active Highlight Spring Container */}
            {isActive && (
              <motion.div
                layoutId="active-cad-tab-pill"
                className="absolute inset-0 bg-[#1A1A1A] border border-[#333333] shadow-sm z-0"
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              />
            )}

            {/* Label and Tag */}
            <span className="relative z-10 text-[9px] text-[#FFB000]">{tab.tag}</span>
            <span className="relative z-10">{tab.label}</span>

            {tab.badge && (
              <span className="relative z-10 px-1 py-0.2 bg-[#0A0A0A] border border-[#333333] text-[8px] text-[#10B981]">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/* =========================================================================
 * 3. CAD ACCORDION (COLLAPSIBLE INSPECTION DRAWER)
 * Source Inspiration: shadcn/ui `Accordion`
 * Description: Monospace collapsible drawer with animated height expansion,
 *              hairline steel borders, and status LED indicator.
 * ========================================================================= */

export interface AccordionSection {
  id: string;
  tag: string;
  title: string;
  status?: 'NOMINAL' | 'EVAL' | 'CRITICAL';
  content: React.ReactNode;
}

export interface CadAccordionProps {
  sections: AccordionSection[];
  className?: string;
}

export const CadAccordion: React.FC<CadAccordionProps> = ({ sections, className = '' }) => {
  const [openIds, setOpenIds] = useState<string[]>([sections[0]?.id || '']);

  const toggleSection = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const statusColor = {
    NOMINAL: 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10',
    EVAL: 'text-[#FFB000] border-[#FFB000]/30 bg-[#FFB000]/10',
    CRITICAL: 'text-[#FF3333] border-[#FF3333]/30 bg-[#FF3333]/10',
  };

  return (
    <div className={`border border-[#262626] bg-[#0E0E0E] font-mono divide-y divide-[#1C1C1C] ${className}`}>
      {sections.map((sec) => {
        const isOpen = openIds.includes(sec.id);

        return (
          <div key={sec.id} className="overflow-hidden">
            <button
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between p-3 bg-[#111111] hover:bg-[#161616] text-left transition-colors"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[9px] text-[#666666]">[{sec.tag}]</span>
                <span className="text-white font-bold tracking-wider">{sec.title}</span>
              </div>

              <div className="flex items-center gap-3">
                {sec.status && (
                  <span className={`px-1.5 py-0.2 border text-[8px] font-bold uppercase ${statusColor[sec.status]}`}>
                    {sec.status}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-[#888888] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-[#0A0A0A] border-t border-[#1A1A1A] text-xs text-[#CCCCCC]"
                >
                  {sec.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================================
 * 4. CAD TELEMETRY TABLE (DATA MATRIX)
 * Source Inspiration: shadcn/ui `Table`
 * Description: Dense monospace engineering matrix with sortable headers,
 *              subtle row striping, and risk status badges.
 * ========================================================================= */

export interface TableRowData {
  id: string;
  symbol: string;
  file: string;
  cyclomatic: number;
  fanOut: number;
  churn: number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface CadTelemetryTableProps {
  rows: TableRowData[];
  className?: string;
  onSelectRow?: (row: TableRowData) => void;
}

export const CadTelemetryTable: React.FC<CadTelemetryTableProps> = ({ rows, className = '', onSelectRow }) => {
  const [sortField, setSortField] = useState<keyof TableRowData>('cyclomatic');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedRows = [...rows].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof TableRowData) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const statusBadge = {
    nominal: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
    warning: 'text-[#FFB000] bg-[#FFB000]/10 border-[#FFB000]/30',
    critical: 'text-[#FF3333] bg-[#FF3333]/10 border-[#FF3333]/30',
  };

  return (
    <div className={`overflow-x-auto border border-[#262626] bg-[#0D0D0D] font-mono text-xs ${className}`}>
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-[#222222] bg-[#141414] text-[9px] text-[#777777] uppercase tracking-wider">
            <th className="p-2.5 font-bold cursor-pointer" onClick={() => handleSort('symbol')}>
              <div className="flex items-center gap-1">
                SYMBOL <ArrowUpDown className="w-2.5 h-2.5" />
              </div>
            </th>
            <th className="p-2.5 font-bold">LOCATOR</th>
            <th className="p-2.5 font-bold cursor-pointer text-right" onClick={() => handleSort('cyclomatic')}>
              <div className="flex items-center justify-end gap-1">
                CYCLO <ArrowUpDown className="w-2.5 h-2.5" />
              </div>
            </th>
            <th className="p-2.5 font-bold cursor-pointer text-right" onClick={() => handleSort('fanOut')}>
              <div className="flex items-center justify-end gap-1">
                FAN-OUT <ArrowUpDown className="w-2.5 h-2.5" />
              </div>
            </th>
            <th className="p-2.5 font-bold cursor-pointer text-right" onClick={() => handleSort('churn')}>
              <div className="flex items-center justify-end gap-1">
                CHURN <ArrowUpDown className="w-2.5 h-2.5" />
              </div>
            </th>
            <th className="p-2.5 font-bold text-center">STATUS</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#1A1A1A]">
          {sortedRows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectRow && onSelectRow(row)}
              className="hover:bg-[#161616] cursor-pointer transition-colors"
            >
              <td className="p-2.5 font-bold text-white truncate max-w-[160px]">{row.symbol}</td>
              <td className="p-2.5 text-[#888888] truncate max-w-[200px] text-[10px]">{row.file}</td>
              <td className={`p-2.5 text-right font-bold ${row.cyclomatic > 15 ? 'text-[#FF3333]' : 'text-white'}`}>
                {row.cyclomatic}
              </td>
              <td className="p-2.5 text-right text-[#CCCCCC]">{row.fanOut}</td>
              <td className="p-2.5 text-right text-[#CCCCCC]">{row.churn}</td>
              <td className="p-2.5 text-center">
                <span className={`px-2 py-0.5 border text-[8px] uppercase font-bold ${statusBadge[row.status]}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* =========================================================================
 * 5. CAD TOOLTIP (PRECISION HOVER INSPECTOR)
 * Source Inspiration: shadcn/ui `Tooltip`
 * Description: Precision popover showing monospace property definitions
 *              and coordinate reticles upon cursor hover.
 * ========================================================================= */

export interface CadTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const CadTooltip: React.FC<CadTooltipProps> = ({
  content,
  children,
  side = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const sidePositions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={`relative inline-block ${className}`}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute ${sidePositions[side]} z-50 pointer-events-none p-2 bg-[#121212] border border-[#333333] shadow-xl text-white font-mono text-[10px] whitespace-nowrap`}
          >
            {/* Corner crosshairs */}
            <span className="absolute -top-1 -left-1 text-[7px] text-[#FFB000]">+</span>
            <span className="absolute -top-1 -right-1 text-[7px] text-[#FFB000]">+</span>
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================================
 * 6. CAD RESIZABLE PANELS
 * Source Inspiration: shadcn/ui `ResizablePanel`
 * Description: Split-view panel divider with draggable 1px steel bar, grip
 *              actuator, and percentage width constraints.
 * ========================================================================= */

export interface CadResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialSplit?: number; // 0 to 100 percentage (default 65)
  minSplit?: number;
  maxSplit?: number;
  className?: string;
}

export const CadResizablePanels: React.FC<CadResizablePanelsProps> = ({
  leftPanel,
  rightPanel,
  initialSplit = 65,
  minSplit = 30,
  maxSplit = 80,
  className = '',
}) => {
  const [splitPercent, setSplitPercent] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const rawPercent = (x / rect.width) * 100;
    const clamped = Math.max(minSplit, Math.min(maxSplit, rawPercent));
    setSplitPercent(clamped);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      className={`relative w-full h-full flex overflow-hidden font-mono select-none ${className}`}
    >
      {/* Left Panel Viewport */}
      <div style={{ width: `${splitPercent}%` }} className="h-full overflow-auto">
        {leftPanel}
      </div>

      {/* Draggable Divider Bar */}
      <div
        onMouseDown={() => setIsDragging(true)}
        className={`
          w-2 -ml-1 h-full cursor-col-resize flex items-center justify-center z-30 transition-colors
          ${isDragging ? 'bg-[#FFB000]' : 'hover:bg-[#333333] bg-[#1E1E1E]'}
        `}
      >
        <div className="w-[1px] h-6 bg-[#666666]" />
      </div>

      {/* Right Panel Viewport */}
      <div style={{ width: `${100 - splitPercent}%` }} className="h-full overflow-auto">
        {rightPanel}
      </div>
    </div>
  );
};
