/**
 * MASTER REFERENCE COMPONENT 13: COLLECT UI SPECIALIZED PATTERNS
 * Sources: Collect UI (collectui.com - Curated Engineering & Telemetry UI Patterns)
 * Components Included:
 *   1. CollectUIMetricStatCard (Mil-spec analytics stat tile with SVG sparkline & tolerance bands)
 *   2. CollectUIPipelineStepper (Linear AST analysis stage stepper & status breadcrumb tracker)
 *   3. CollectUICodeDiffInspector (Split/unified high-density code differential inspector)
 *   4. CollectUIHexTelemetryCluster (Hexagonal multi-metric status cluster with SVG path rendering)
 *   5. CollectUINotificationDrawer (Tactile industrial alert toast with severity latch)
 *   6. CollectUIFilterFacetBar (Monospace facet filter bar with count badges and reset actuator)
 *
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use these Collect UI inspired patterns for telemetry tiles, pipeline workflow stages,
 * diff inspectors, and hexagonal status badges. Strictly maintain the TraceOn Obsidian
 * Industrial CAD theme with monospace readouts, 1px steel borders, and amber/emerald accents."
 */

import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =========================================================================
 * 1. COLLECT UI METRIC STAT CARD WITH SPARKLINE
 * Source Inspiration: Collect UI Analytics / Stat Tiles
 * Description: Precision CAD stat card featuring numerical readout, min/max
 *              tolerance indicator, delta badge, and smooth SVG sparkline.
 * ========================================================================= */

export interface CollectUIMetricStatCardProps {
  label: string; // e.g. "CYCLOMATIC_COMPLEXITY_INDEX"
  value: string | number; // e.g. "14.2"
  unit?: string; // e.g. "MGL"
  delta?: {
    value: string; // e.g. "-12.4%"
    type: 'positive' | 'negative' | 'neutral';
  };
  sparklineData?: number[]; // e.g. [12, 14, 18, 15, 22, 19, 14]
  tolerance?: {
    min: number;
    max: number;
    nominal: number;
  };
  status?: 'nominal' | 'warning' | 'critical';
  className?: string;
}

export const CollectUIMetricStatCard: React.FC<CollectUIMetricStatCardProps> = ({
  label,
  value,
  unit,
  delta,
  sparklineData = [10, 14, 12, 18, 16, 22, 19, 25, 21, 28],
  tolerance = { min: 5, max: 30, nominal: 15 },
  status = 'nominal',
  className = '',
}) => {
  const statusColors = {
    nominal: { text: 'text-[#10B981]', bg: 'bg-[#10B981]', stroke: '#10B981' },
    warning: { text: 'text-[#FFB000]', bg: 'bg-[#FFB000]', stroke: '#FFB000' },
    critical: { text: 'text-[#FF3333]', bg: 'bg-[#FF3333]', stroke: '#FF3333' },
  }[status];

  // SVG Sparkline normalization
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const range = maxVal - minVal || 1;
  const svgWidth = 140;
  const svgHeight = 36;

  const points = sparklineData
    .map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * svgWidth;
      const y = svgHeight - ((d - minVal) / range) * (svgHeight - 8) - 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div
      className={`relative p-4 bg-[#121212] border border-[#262626] rounded-sm font-mono overflow-hidden transition-all duration-200 hover:border-[#404040] ${className}`}
    >
      {/* CAD Corner Crosshairs */}
      <span className="absolute top-1 left-1 text-[8px] text-[#444444] select-none">┌</span>
      <span className="absolute top-1 right-1 text-[8px] text-[#444444] select-none">┐</span>
      <span className="absolute bottom-1 left-1 text-[8px] text-[#444444] select-none">└</span>
      <span className="absolute bottom-1 right-1 text-[8px] text-[#444444] select-none">┘</span>

      {/* Header Bar */}
      <div className="flex items-center justify-between text-[9px] tracking-wider text-[#737373] uppercase mb-2">
        <span className="truncate">{label}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.bg} animate-pulse`} />
          <span className={statusColors.text}>[{status}]</span>
        </div>
      </div>

      {/* Main Metric Readout */}
      <div className="flex items-baseline justify-between gap-2 my-1">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
          {unit && <span className="text-[10px] text-[#888888]">{unit}</span>}
        </div>

        {delta && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
              delta.type === 'positive'
                ? 'text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30'
                : delta.type === 'negative'
                ? 'text-[#FF3333] bg-[#FF3333]/10 border border-[#FF3333]/30'
                : 'text-[#888888] bg-[#222222] border border-[#333333]'
            }`}
          >
            {delta.value}
          </span>
        )}
      </div>

      {/* Sparkline & Tolerance Section */}
      <div className="mt-3 pt-2 border-t border-[#1C1C1C] flex items-center justify-between gap-4">
        <div className="text-[8px] text-[#555555] flex flex-col gap-0.5">
          <span>MIN: {tolerance.min}</span>
          <span>NOM: {tolerance.nominal}</span>
          <span>MAX: {tolerance.max}</span>
        </div>

        {/* SVG Sparkline */}
        <div className="w-28 h-8 shrink-0">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={statusColors.stroke}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
 * 2. COLLECT UI PIPELINE STEPPER
 * Source Inspiration: Collect UI Workflow / Process Steppers
 * Description: Linear CAD workflow breadcrumbs displaying active execution
 *              stages (PARSE -> RESOLVE -> CALL_GRAPH -> AUDIT -> EMIT).
 * ========================================================================= */

export interface PipelineStage {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  duration?: string;
  details?: string;
}

export interface CollectUIPipelineStepperProps {
  stages: PipelineStage[];
  activeStageId?: string;
  onSelectStage?: (stageId: string) => void;
  className?: string;
}

export const CollectUIPipelineStepper: React.FC<CollectUIPipelineStepperProps> = ({
  stages,
  activeStageId,
  onSelectStage,
  className = '',
}) => {
  return (
    <div className={`p-3 bg-[#0E0E0E] border border-[#262626] rounded-sm font-mono ${className}`}>
      <div className="flex items-center justify-between mb-3 text-[9px] text-[#666666] tracking-wider uppercase border-b border-[#1A1A1A] pb-2">
        <span>AST_EXECUTION_PIPELINE</span>
        <span>STATUS: {stages.find((s) => s.status === 'active')?.name ?? 'IDLE'}</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {stages.map((stage, idx) => {
          const isSelected = stage.id === activeStageId;
          const statusIcon = {
            completed: <span className="text-[#10B981]">✓</span>,
            active: <span className="text-[#FFB000] animate-spin">◒</span>,
            pending: <span className="text-[#555555]">○</span>,
            failed: <span className="text-[#FF3333]">✕</span>,
          }[stage.status];

          return (
            <React.Fragment key={stage.id}>
              {/* Stepper Node */}
              <button
                type="button"
                onClick={() => onSelectStage?.(stage.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-xs border transition-all text-left whitespace-nowrap cursor-pointer ${
                  stage.status === 'active'
                    ? 'border-[#FFB000] bg-[#FFB000]/10 text-white'
                    : stage.status === 'completed'
                    ? 'border-[#10B981]/40 bg-[#121212] text-[#CCCCCC]'
                    : stage.status === 'failed'
                    ? 'border-[#FF3333] bg-[#FF3333]/10 text-white'
                    : 'border-[#262626] bg-[#0A0A0A] text-[#666666]'
                } ${isSelected ? 'ring-1 ring-[#FFB000]' : ''}`}
              >
                <span className="text-[10px]">{statusIcon}</span>
                <div className="flex flex-col">
                  <span className="font-bold text-[11px] leading-tight">
                    {idx + 1}. {stage.name}
                  </span>
                  {stage.duration && (
                    <span className="text-[8px] text-[#737373]">{stage.duration}</span>
                  )}
                </div>
              </button>

              {/* Connecting CAD Line */}
              {idx < stages.length - 1 && (
                <div
                  className={`w-6 h-[1px] shrink-0 ${
                    stage.status === 'completed' ? 'bg-[#10B981]/50' : 'bg-[#262626]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 3. COLLECT UI CODE DIFF INSPECTOR
 * Source Inspiration: Collect UI Code Comparison / Diff Viewer
 * Description: Monospace split or unified code hunk viewer with line numbers,
 *              tactile addition/deletion blocks, and jump-to-hunk actions.
 * ========================================================================= */

export interface DiffLine {
  type: 'add' | 'remove' | 'context';
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

export interface CollectUICodeDiffInspectorProps {
  filename: string;
  hunkHeader?: string; // e.g. "@@ -42,7 +42,9 @@"
  lines: DiffLine[];
  additionsCount?: number;
  deletionsCount?: number;
  className?: string;
}

export const CollectUICodeDiffInspector: React.FC<CollectUICodeDiffInspectorProps> = ({
  filename,
  hunkHeader = '@@ -12,6 +12,8 @@ function resolveAstDependencies()',
  lines,
  additionsCount = 2,
  deletionsCount = 1,
  className = '',
}) => {
  return (
    <div className={`bg-[#0A0A0A] border border-[#262626] rounded-sm font-mono text-xs overflow-hidden ${className}`}>
      {/* File Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121212] border-b border-[#262626]">
        <div className="flex items-center gap-2">
          <span className="text-[#888888]">📄</span>
          <span className="text-white font-bold">{filename}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-[#10B981] font-semibold">+{additionsCount}</span>
          <span className="text-[#FF3333] font-semibold">-{deletionsCount}</span>
        </div>
      </div>

      {/* Hunk Header */}
      <div className="px-3 py-1 bg-[#161616] text-[#666666] text-[10px] border-b border-[#222222]">
        {hunkHeader}
      </div>

      {/* Diff Content */}
      <div className="divide-y divide-[#181818] overflow-x-auto">
        {lines.map((line, idx) => {
          const isAdd = line.type === 'add';
          const isRemove = line.type === 'remove';

          return (
            <div
              key={idx}
              className={`flex items-stretch font-mono leading-relaxed select-text ${
                isAdd
                  ? 'bg-[#10B981]/10 text-[#E0E0E0]'
                  : isRemove
                  ? 'bg-[#FF3333]/10 text-[#CCCCCC]'
                  : 'bg-transparent text-[#888888]'
              }`}
            >
              {/* Line Numbers */}
              <span className="w-9 px-1.5 py-0.5 text-right text-[10px] text-[#444444] select-none border-r border-[#1C1C1C]">
                {line.oldLineNumber ?? ''}
              </span>
              <span className="w-9 px-1.5 py-0.5 text-right text-[10px] text-[#444444] select-none border-r border-[#1C1C1C]">
                {line.newLineNumber ?? ''}
              </span>

              {/* Marker (+ / - / space) */}
              <span
                className={`w-5 py-0.5 text-center font-bold select-none ${
                  isAdd ? 'text-[#10B981]' : isRemove ? 'text-[#FF3333]' : 'text-transparent'
                }`}
              >
                {isAdd ? '+' : isRemove ? '-' : ' '}
              </span>

              {/* Line Content */}
              <pre className="px-2 py-0.5 flex-1 whitespace-pre overflow-x-visible font-mono text-[11px]">
                {line.content}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 4. COLLECT UI HEX TELEMETRY CLUSTER
 * Source Inspiration: Collect UI Geometric / Hex Status Badges
 * Description: Precision hexagonal vector cluster displaying multi-axis
 *              system health metrics with phosphor accent illumination.
 * ========================================================================= */

export interface HexMetric {
  label: string;
  value: string | number;
  status: 'nominal' | 'warning' | 'critical';
}

export interface CollectUIHexTelemetryClusterProps {
  metrics: [HexMetric, HexMetric, HexMetric]; // 3 Hexagons in a triangular CAD cluster
  className?: string;
}

export const CollectUIHexTelemetryCluster: React.FC<CollectUIHexTelemetryClusterProps> = ({
  metrics,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center p-4 bg-[#0D0D0D] border border-[#262626] rounded-sm font-mono ${className}`}>
      <div className="flex items-center gap-2">
        {metrics.map((m, idx) => {
          const color = {
            nominal: '#10B981',
            warning: '#FFB000',
            critical: '#FF3333',
          }[m.status];

          return (
            <div key={idx} className="relative w-24 h-28 flex flex-col items-center justify-center group">
              {/* Hexagon SVG Background */}
              <svg viewBox="0 0 100 115.47" className="absolute inset-0 w-full h-full pointer-events-none">
                <polygon
                  points="50 0, 100 28.87, 100 86.6, 50 115.47, 0 86.6, 0 28.87"
                  fill="#141414"
                  stroke="#262626"
                  strokeWidth="2"
                  className="transition-all duration-300 group-hover:stroke-[#FFB000]"
                />
                <polygon
                  points="50 8, 93 32.87, 93 82.6, 50 107.47, 7 82.6, 7 32.87"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.6"
                />
              </svg>

              {/* Inner Text Readout */}
              <div className="relative z-10 flex flex-col items-center text-center p-2">
                <span className="text-[7px] text-[#737373] tracking-widest uppercase mb-1">
                  {m.label}
                </span>
                <span className="text-sm font-bold text-white tracking-tight">{m.value}</span>
                <span className="text-[7px] mt-1" style={{ color }}>
                  ● [{m.status.toUpperCase()}]
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
 * 5. COLLECT UI NOTIFICATION DRAWER / TOAST
 * Source Inspiration: Collect UI Toast & Alert Drawers
 * Description: Tactile industrial alert bar with severity latch, monospace
 *              timestamp, dismiss actuator, and laser indicator.
 * ========================================================================= */

export interface CollectUINotificationDrawerProps {
  id: string;
  title: string;
  message: string;
  timestamp?: string;
  severity?: 'info' | 'warning' | 'alert';
  onDismiss?: (id: string) => void;
  className?: string;
}

export const CollectUINotificationDrawer: React.FC<CollectUINotificationDrawerProps> = ({
  id,
  title,
  message,
  timestamp = '11:28:44 UTC',
  severity = 'info',
  onDismiss,
  className = '',
}) => {
  const config = {
    info: { border: 'border-[#262626]', text: 'text-white', badge: 'text-[#10B981] bg-[#10B981]/10' },
    warning: { border: 'border-[#FFB000]/60', text: 'text-[#FFB000]', badge: 'text-[#FFB000] bg-[#FFB000]/10' },
    alert: { border: 'border-[#FF3333]/80', text: 'text-[#FF3333]', badge: 'text-[#FF3333] bg-[#FF3333]/10' },
  }[severity];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`relative p-3 bg-[#111111] border ${config.border} rounded-sm font-mono shadow-2xl max-w-sm ${className}`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1E1E1E] text-[8px] text-[#737373]">
        <span className="uppercase tracking-wider">ALERT_SYS_EVT // {id}</span>
        <span>{timestamp}</span>
      </div>

      {/* Body */}
      <div className="flex items-start gap-2.5">
        <span className={`text-[9px] font-bold px-1 py-0.5 rounded-xs uppercase ${config.badge}`}>
          {severity}
        </span>
        <div className="flex-1">
          <h4 className={`text-xs font-bold leading-tight ${config.text}`}>{title}</h4>
          <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-relaxed">{message}</p>
        </div>

        {/* Dismiss Latch */}
        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(id)}
            className="text-[10px] text-[#555555] hover:text-white px-1 cursor-pointer transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* =========================================================================
 * 6. COLLECT UI FILTER FACET BAR
 * Source Inspiration: Collect UI Filter & Tagging Bars
 * Description: Monospace facet filtering toolbar with count indicators,
 *              tag toggles, and reset actuator for AST symbol inspection.
 * ========================================================================= */

export interface FilterFacet {
  id: string;
  label: string;
  count: number;
}

export interface CollectUIFilterFacetBarProps {
  facets: FilterFacet[];
  activeFacetIds: string[];
  onToggleFacet: (id: string) => void;
  onReset?: () => void;
  className?: string;
}

export const CollectUIFilterFacetBar: React.FC<CollectUIFilterFacetBarProps> = ({
  facets,
  activeFacetIds,
  onToggleFacet,
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex items-center flex-wrap gap-2 p-2.5 bg-[#0C0C0C] border border-[#262626] rounded-sm font-mono text-xs ${className}`}>
      <span className="text-[9px] text-[#666666] uppercase tracking-wider mr-1 select-none">
        FILTER_BY:
      </span>

      {facets.map((facet) => {
        const isActive = activeFacetIds.includes(facet.id);

        return (
          <button
            key={facet.id}
            type="button"
            onClick={() => onToggleFacet(facet.id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-xs border text-[11px] cursor-pointer transition-all ${
              isActive
                ? 'bg-[#FFB000]/15 border-[#FFB000] text-white font-semibold'
                : 'bg-[#141414] border-[#222222] text-[#888888] hover:border-[#383838] hover:text-white'
            }`}
          >
            <span>{facet.label}</span>
            <span
              className={`text-[8px] px-1 py-0.2 rounded-xs ${
                isActive ? 'bg-[#FFB000] text-black font-bold' : 'bg-[#1E1E1E] text-[#666666]'
              }`}
            >
              {facet.count}
            </span>
          </button>
        );
      })}

      {onReset && activeFacetIds.length > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="text-[9px] text-[#FF3333] hover:underline uppercase ml-auto tracking-wider cursor-pointer"
        >
          [RESET_FILTERS]
        </button>
      )}
    </div>
  );
};
