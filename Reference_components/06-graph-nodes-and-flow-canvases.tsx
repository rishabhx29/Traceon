/**
 * MASTER REFERENCE COMPONENT 06: GRAPH NODES & FLOW CANVASES
 * Sources: React Flow CAD Blueprint Architecture, AST DAG Graph Visualizer, Mil-Spec Wireframe
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Construct call graph nodes and module dependency canvases using CadGraphNode and PulsingBezierEdge.
 * Do not use rounded SaaS cloud bubbles. Nodes must be rectangular CAD units with input/output pin
 * handles, micro LED status diodes, and numeric cyclomatic/fan-out metrics."
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Cpu, Network, AlertTriangle, CheckCircle2, ArrowRight, X } from 'lucide-react';

/* =========================================================================
 * 1. CAD REACT FLOW CUSTOM NODE
 * Source Inspiration: React Flow Custom Node / CAD Schematics Component
 * Description: Rectangular micro-chassis node with input/output ports,
 *              execution latency, cyclomatic rank, and hotspot warning border.
 * ========================================================================= */

export interface CadNodeData {
  id: string;
  name: string;
  filePath: string;
  kind: 'function' | 'class' | 'module' | 'hook';
  cyclomaticComplexity: number;
  fanIn: number;
  fanOut: number;
  status: 'nominal' | 'warning' | 'critical';
  loc: number;
}

export interface CadGraphNodeProps {
  data: CadNodeData;
  selected?: boolean;
  onSelectNode?: (data: CadNodeData) => void;
}

export const CadGraphNode: React.FC<CadGraphNodeProps> = ({
  data,
  selected = false,
  onSelectNode,
}) => {
  const statusStyles = {
    nominal: {
      border: 'border-[#262626]',
      glow: '',
      led: 'bg-[#10B981] shadow-[0_0_6px_#10B981]',
      badge: 'text-[#10B981] bg-[#10B981]/10',
    },
    warning: {
      border: 'border-[#FFB000]',
      glow: 'shadow-[0_0_12px_rgba(255,176,0,0.2)]',
      led: 'bg-[#FFB000] shadow-[0_0_8px_#FFB000]',
      badge: 'text-[#FFB000] bg-[#FFB000]/10',
    },
    critical: {
      border: 'border-[#FF3333]',
      glow: 'shadow-[0_0_14px_rgba(255,51,51,0.3)]',
      led: 'bg-[#FF3333] shadow-[0_0_8px_#FF3333] animate-pulse',
      badge: 'text-[#FF3333] bg-[#FF3333]/10',
    },
  };

  const st = statusStyles[data.status];

  return (
    <div
      onClick={() => onSelectNode && onSelectNode(data)}
      className={`
        relative w-64 bg-[#121212] border font-mono select-none cursor-pointer transition-all duration-150
        ${st.border} ${st.glow}
        ${selected ? 'ring-1 ring-[#FFB000] bg-[#161616]' : 'hover:border-[#444444]'}
      `}
    >
      {/* Top Input Connection Port (Handle) */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A0A0A] border border-[#555555] rounded-none flex items-center justify-center">
        <div className="w-1 h-1 bg-[#888888]" />
      </div>

      {/* Header Bar */}
      <div className="flex items-center justify-between p-2.5 border-b border-[#1E1E1E] bg-[#0E0E0E]">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${st.led}`} />
          <span className="text-[11px] font-bold text-white tracking-wider truncate max-w-[140px]">
            {data.name}
          </span>
        </div>
        <span className={`text-[8px] px-1.5 py-0.5 uppercase font-bold border ${st.badge}`}>
          {data.kind}
        </span>
      </div>

      {/* Body Telemetry */}
      <div className="p-2.5 space-y-2 text-[10px]">
        <div className="text-[#666666] truncate text-[9px]">{data.filePath}</div>

        <div className="grid grid-cols-3 gap-1 pt-1 border-t border-[#1C1C1C] text-center">
          <div className="bg-[#0A0A0A] p-1 border border-[#1E1E1E]">
            <div className="text-[8px] text-[#555555]">CYCLO</div>
            <div className={`font-bold ${data.cyclomaticComplexity > 15 ? 'text-[#FF3333]' : 'text-white'}`}>
              {data.cyclomaticComplexity}
            </div>
          </div>
          <div className="bg-[#0A0A0A] p-1 border border-[#1E1E1E]">
            <div className="text-[8px] text-[#555555]">FAN-OUT</div>
            <div className="font-bold text-white">{data.fanOut}</div>
          </div>
          <div className="bg-[#0A0A0A] p-1 border border-[#1E1E1E]">
            <div className="text-[8px] text-[#555555]">LOC</div>
            <div className="font-bold text-white">{data.loc}</div>
          </div>
        </div>
      </div>

      {/* Bottom Output Connection Port (Handle) */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0A0A0A] border border-[#555555] rounded-none flex items-center justify-center">
        <div className="w-1 h-1 bg-[#888888]" />
      </div>
    </div>
  );
};

/* =========================================================================
 * 2. PULSING BEZIER DATA EDGE
 * Source Inspiration: CAD Schematics / Circuit Traces
 * Description: SVG Bezier connection between nodes with traveling phosphor
 *              photons illustrating function call traffic.
 * ========================================================================= */

export interface PulsingBezierEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  color?: string;
}

export const PulsingBezierEdge: React.FC<PulsingBezierEdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  active = true,
  color = '#FFB000',
}) => {
  // Cubic Bezier curve control points
  const deltaY = y2 - y1;
  const cx1 = x1;
  const cy1 = y1 + deltaY * 0.5;
  const cx2 = x2;
  const cy2 = y2 - deltaY * 0.5;

  const pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  return (
    <g>
      {/* Background Static Hairline Wire */}
      <path d={pathD} fill="none" stroke="#222222" strokeWidth="1.5" />

      {/* Active Glowing Flow Line */}
      {active && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="4 8"
          className="animate-[dash_1s_linear_infinite]"
        />
      )}
    </g>
  );
};

/* =========================================================================
 * 3. NODE DETAIL SIDECAR DRAWER
 * Source Inspiration: IDE Inspection Panel / CAD Property Sheet
 * Description: Slide-in docked telemetry drawer providing progressive
 *              disclosure of AST, caller hierarchy, and blame logs.
 * ========================================================================= */

export interface NodeDetailSidecarProps {
  node: CadNodeData | null;
  onClose: () => void;
}

export const NodeDetailSidecar: React.FC<NodeDetailSidecarProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 32 }}
        className="fixed top-0 right-0 bottom-0 w-96 bg-[#101010] border-l border-[#262626] shadow-2xl z-50 p-6 font-mono overflow-y-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#FFB000]" />
            <span className="text-white font-bold text-sm uppercase">INSPECT_NODE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1A1A1A] border border-[#2B2B2B] text-[#888888] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Node Profile Summary */}
        <div className="mt-4 space-y-4 text-xs">
          <div>
            <div className="text-[9px] text-[#555555] uppercase">SYMBOL ID</div>
            <div className="text-white font-bold text-base">{node.name}</div>
          </div>

          <div>
            <div className="text-[9px] text-[#555555] uppercase">FILE LOCATOR</div>
            <div className="text-[#AAAAAA] break-all bg-[#0A0A0A] p-2 border border-[#1A1A1A]">
              {node.filePath}
            </div>
          </div>

          {/* Metric Matrix */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-[#0D0D0D] p-3 border border-[#1F1F1F]">
              <div className="text-[9px] text-[#666666]">CYCLOMATIC</div>
              <div className="text-lg font-bold text-white">{node.cyclomaticComplexity}</div>
              <div className="text-[8px] text-[#FFB000]">HIGH RISK &gt; 15</div>
            </div>

            <div className="bg-[#0D0D0D] p-3 border border-[#1F1F1F]">
              <div className="text-[9px] text-[#666666]">FAN-OUT (COUPLING)</div>
              <div className="text-lg font-bold text-white">{node.fanOut}</div>
              <div className="text-[8px] text-[#10B981]">OPTIMAL &lt; 8</div>
            </div>
          </div>

          {/* Execution Trace Recommendations */}
          <div className="p-3 bg-[#15100B] border border-[#3D250C] rounded">
            <div className="text-[10px] text-[#FFB000] font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              ARCHITECTURAL RECOMMENDATION
            </div>
            <p className="text-[10px] text-[#CCA37A] mt-1 leading-relaxed">
              Extract stateful branch conditions into pure helper functions to decouple caller tree and
              reduce cyclomatic complexity below nominal threshold (10).
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
