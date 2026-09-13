/**
 * MASTER REFERENCE COMPONENT 04: SLIDERS & COMMIT SCRUBBERS
 * Sources: React Bits (Elastic Slider), Git Interactive Rebase Tooling, CAD Calibration Scrubber
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Graphite (#1E1E1E), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Use tactile spring-snapping scrubbers for navigating git history, timeline replays, and
 * metric threshold filters. Include discrete commit stop ticks, live commit hash tooltips,
 * and immediate diff statistics (+add / -del) without generic OS range sliders."
 */

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { GitCommit, GitBranch, Clock, ChevronRight } from 'lucide-react';

/* =========================================================================
 * 1. ELASTIC COMMIT SCRUBBER (REACT BITS SPRING TIMELINE)
 * Source Inspiration: React Bits Elastic Slider / Git DAG Rebase View
 * Description: Tactile timeline scrubber with spring elasticity, discrete
 *              commit magnetic stops, and real-time metadata badge.
 * ========================================================================= */

export interface CommitNode {
  hash: string;
  message: string;
  author: string;
  timestamp: string;
  curismScore: number;
  insertions: number;
  deletions: number;
}

export interface ElasticCommitScrubberProps {
  commits: CommitNode[];
  selectedIndex: number;
  onSelectCommit: (index: number) => void;
  className?: string;
}

export const ElasticCommitScrubber: React.FC<ElasticCommitScrubberProps> = ({
  commits,
  selectedIndex,
  onSelectCommit,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const totalCommits = Math.max(commits.length, 1);

  const activeCommit = commits[selectedIndex] || commits[0];

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetIdx = Math.round(ratio * (totalCommits - 1));
    onSelectCommit(targetIdx);
  };

  const currentPercent = (selectedIndex / (totalCommits - 1)) * 100;

  return (
    <div className={`p-4 bg-[#0F0F0F] border border-[#262626] rounded font-mono ${className}`}>
      {/* Active Commit Telemetry Readout */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1C1C1C] text-xs">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[#FFB000]" />
          <span className="text-white font-bold tracking-wider">{activeCommit.hash}</span>
          <span className="text-[#888888] truncate max-w-[200px]">{activeCommit.message}</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-[#10B981]">+{activeCommit.insertions}</span>
          <span className="text-[#FF3333]">-{activeCommit.deletions}</span>
          <span className="px-1.5 py-0.5 bg-[#1A1A1A] border border-[#333333] text-[#FFB000]">
            CURISM: {activeCommit.curismScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Elastic Timeline Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        className="relative h-6 flex items-center cursor-pointer select-none group"
      >
        {/* Background Hairline Rail */}
        <div className="absolute inset-x-0 h-[2px] bg-[#222222]" />

        {/* Active Filled Progress Rail */}
        <div
          className="absolute left-0 h-[2px] bg-[#FFB000] transition-all duration-150"
          style={{ width: `${currentPercent}%` }}
        />

        {/* Discrete Commit Stop Ticks */}
        <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1">
          {commits.map((c, i) => {
            const isSelected = i === selectedIndex;
            const isPast = i < selectedIndex;

            return (
              <div key={c.hash} className="relative flex flex-col items-center">
                {/* Vertical Hash Tick Mark */}
                <div
                  className={`w-[1px] h-3 transition-colors duration-200 ${
                    isSelected
                      ? 'bg-[#FFB000] scale-y-125'
                      : isPast
                      ? 'bg-[#888888]'
                      : 'bg-[#333333]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Spring Snapping Keycap Actuator Thumb */}
        <motion.div
          animate={{ left: `${currentPercent}%` }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="absolute -ml-2.5 w-5 h-5 bg-[#1C1C1C] border-2 border-[#FFB000] rounded-sm shadow-[0_0_10px_#FFB000] flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
        >
          <div className="w-1.5 h-1.5 bg-[#FFB000]" />
        </motion.div>
      </div>

      {/* Scrubber Navigation Footnote */}
      <div className="flex items-center justify-between pt-2 text-[9px] text-[#555555]">
        <span>HEAD~{totalCommits - 1 - selectedIndex}</span>
        <span>DRAG OR CLICK TO TIME-TRAVEL</span>
        <span>{activeCommit.timestamp}</span>
      </div>
    </div>
  );
};

/* =========================================================================
 * 2. CAD CALIBRATION RANGE SCRUBBER
 * Source Inspiration: CAD Parameter Slider / Industrial Potentiometer
 * Description: Continuous precision metric range slider with dual readouts
 *              and phosphor amber active fill.
 * ========================================================================= */

export interface CadRangeScrubberProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  onChange: (val: number) => void;
  className?: string;
}

export const CadRangeScrubber: React.FC<CadRangeScrubberProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  unit = '',
  onChange,
  className = '',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[#888888] uppercase tracking-wider">{label}</span>
        <span className="text-[#FFB000] font-bold">
          {value} {unit}
        </span>
      </div>

      <div className="relative h-4 flex items-center">
        {/* Rail */}
        <div className="w-full h-1 bg-[#222222] rounded-none overflow-hidden">
          <div className="h-full bg-[#FFB000]" style={{ width: `${percentage}%` }} />
        </div>

        {/* Native Input Layer (Invisible Overlay for full accessibility) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Visual CAD Custom Thumb */}
        <div
          style={{ left: `${percentage}%` }}
          className="absolute -ml-1.5 w-3 h-3 bg-[#111111] border border-[#FFB000] pointer-events-none shadow-[0_0_6px_#FFB000]"
        />
      </div>
    </div>
  );
};
