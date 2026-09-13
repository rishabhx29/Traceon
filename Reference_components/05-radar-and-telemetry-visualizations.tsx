/**
 * MASTER REFERENCE COMPONENT 05: RADAR & TELEMETRY VISUALIZATIONS
 * Sources: 21st.dev (LoadingRadar), Visx Radar Blossom, Mil-Spec Telemetry
 * Palette: Obsidian (#0A0A0A), Carbon (#121212), Steel (#262626),
 *          Phosphor Amber (#FFB000), Phosphor Emerald (#10B981), Laser Vermilion (#FF3333)
 *
 * PROMPT FOR SUBAGENTS:
 * "Render live AST sweeps and health diagnostics using the LoadingRadar Sweeper and the
 * 6-Axis Hexagonal CURISM Radar. Ensure pure SVG or canvas performance, continuous 360-degree
 * sweeping beams, coordinate reticles, and numeric readouts on every vertex."
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* =========================================================================
 * 1. 21ST.DEV LOADING RADAR SWEEPER
 * Source Inspiration: 21st.dev LoadingRadar / Mil-Spec Sonar Sweep
 * Description: 360-degree continuous angular sweep with distance rings,
 *              quadrant crosshairs, and pulsing anomaly blips.
 * ========================================================================= */

export interface RadarBlip {
  id: string;
  angle: number; // In degrees 0 - 360
  distance: number; // Normalized 0 to 1
  label: string;
  type: 'nominal' | 'warning' | 'alert';
}

export interface LoadingRadarSweeperProps {
  size?: number;
  blips?: RadarBlip[];
  sweepDuration?: number; // seconds per rotation
  className?: string;
}

export const LoadingRadarSweeper: React.FC<LoadingRadarSweeperProps> = ({
  size = 280,
  blips = [
    { id: 'b1', angle: 45, distance: 0.65, label: 'AUTH_LEAK', type: 'alert' },
    { id: 'b2', angle: 160, distance: 0.4, label: 'CYCLO_HIGH', type: 'warning' },
    { id: 'b3', angle: 280, distance: 0.8, label: 'MEM_STABLE', type: 'nominal' },
  ],
  sweepDuration = 4,
  className = '',
}) => {
  const center = size / 2;
  const radius = center - 16;

  const blipColors = {
    nominal: '#10B981',
    warning: '#FFB000',
    alert: '#FF3333',
  };

  return (
    <div
      className={`relative inline-block bg-[#0A0A0A] border border-[#262626] rounded-full p-2 font-mono select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        {/* Concentric Distance Calibration Rings */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <circle
            key={ratio}
            cx={center}
            cy={center}
            r={radius * ratio}
            fill="none"
            stroke="#222222"
            strokeWidth="1"
            strokeDasharray={ratio === 1 ? 'none' : '3 3'}
          />
        ))}

        {/* Quadrant Crosshairs */}
        <line x1={center} y1={16} x2={center} y2={size - 16} stroke="#222222" strokeWidth="1" />
        <line x1={16} y1={center} x2={size - 16} y2={center} stroke="#222222" strokeWidth="1" />

        {/* Radar Blips */}
        {blips.map((blip) => {
          const rad = (blip.angle * Math.PI) / 180;
          const bx = center + Math.cos(rad) * (radius * blip.distance);
          const by = center + Math.sin(rad) * (radius * blip.distance);
          const color = blipColors[blip.type];

          return (
            <g key={blip.id} className="cursor-pointer">
              {/* Pulsing ring */}
              <circle cx={bx} cy={by} r="7" fill="none" stroke={color} strokeWidth="1" opacity="0.4" className="animate-ping" />
              {/* Solid point */}
              <circle cx={bx} cy={by} r="3" fill={color} />
              {/* Micro label */}
              <text x={bx + 6} y={by - 4} fill={color} fontSize="8" fontFamily="monospace" fontWeight="bold">
                {blip.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Rotating Phosphor Sweep Beam */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: sweepDuration, ease: 'linear', repeat: Infinity }}
        style={{ width: size, height: size, transformOrigin: 'center center' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div
          className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left"
          style={{
            background: 'conic-gradient(from 0deg at 0% 100%, rgba(255, 176, 0, 0.25) 0deg, transparent 60deg)',
          }}
        />
        {/* Leading Laser Edge Line */}
        <div
          className="absolute top-0 right-1/2 w-[1px] h-1/2 bg-[#FFB000] shadow-[0_0_8px_#FFB000]"
          style={{ transformOrigin: 'bottom center' }}
        />
      </motion.div>

      {/* Center Radar Axis Diode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#FFB000] shadow-[0_0_8px_#FFB000]" />

      {/* Cardinal Labels */}
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-[#555555]">000° N</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-[#555555]">180° S</span>
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[8px] text-[#555555]">270° W</span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-[#555555]">090° E</span>
    </div>
  );
};

/* =========================================================================
 * 2. 6-AXIS HEXAGONAL CURISM RADAR CHART
 * Source Inspiration: Visx Radar Blossom / CAD Multi-Metric Polygon
 * Description: Pure SVG hexagonal radar evaluating Complexity, Coupling,
 *              Churn, Volume, Fan-Out, and Test Rigor.
 * ========================================================================= */

export interface CurismMetricAxis {
  key: string;
  name: string;
  value: number; // 0 to 100
  benchmark: number; // 0 to 100
}

export interface HexagonalCurismRadarProps {
  metrics: CurismMetricAxis[];
  size?: number;
  className?: string;
}

export const HexagonalCurismRadar: React.FC<HexagonalCurismRadarProps> = ({
  metrics = [
    { key: 'complexity', name: 'CYCLOMATIC', value: 85, benchmark: 40 },
    { key: 'halstead', name: 'HALSTEAD_EFFORT', value: 72, benchmark: 50 },
    { key: 'coupling', name: 'FAN_OUT_COUPLING', value: 90, benchmark: 35 },
    { key: 'churn', name: 'GIT_CHURN', value: 65, benchmark: 45 },
    { key: 'density', name: 'TOKEN_DENSITY', value: 80, benchmark: 60 },
    { key: 'tests', name: 'TEST_COVERAGE', value: 95, benchmark: 80 },
  ],
  size = 320,
  className = '',
}) => {
  const [activeAxis, setActiveAxis] = useState<CurismMetricAxis | null>(null);

  const center = size / 2;
  const radius = center - 48;
  const totalAxes = metrics.length;
  const angleStep = (2 * Math.PI) / totalAxes;

  // Calculate coordinates for a polygon given metric values
  const getCoordinates = (values: number[]) => {
    return values
      .map((val, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (val / 100) * radius;
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        return `${x},${y}`;
      })
      .join(' ');
  };

  const activePoints = getCoordinates(metrics.map((m) => m.value));
  const benchmarkPoints = getCoordinates(metrics.map((m) => m.benchmark));

  return (
    <div className={`p-4 bg-[#0D0D0D] border border-[#262626] rounded font-mono ${className}`}>
      {/* Title block */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1C1C1C] text-xs">
        <span className="text-white font-bold tracking-wider">CURISM 6-AXIS TELEMETRY</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#FFB000]" /> CURRENT
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#10B981]" /> BENCHMARK
          </span>
        </div>
      </div>

      <div className="relative flex justify-center">
        <svg width={size} height={size}>
          {/* Concentric Background Hexagons */}
          {[0.25, 0.5, 0.75, 1].map((scale) => {
            const hexPoints = Array.from({ length: totalAxes })
              .map((_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = radius * scale;
                return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
              })
              .join(' ');

            return (
              <polygon
                key={scale}
                points={hexPoints}
                fill="none"
                stroke="#222222"
                strokeWidth="1"
                strokeDasharray={scale === 1 ? 'none' : '2 2'}
              />
            );
          })}

          {/* Radiating Axis Lines */}
          {metrics.map((m, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + Math.cos(angle) * radius;
            const y = center + Math.sin(angle) * radius;
            const textX = center + Math.cos(angle) * (radius + 20);
            const textY = center + Math.sin(angle) * (radius + 16);

            return (
              <g key={m.key}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="#262626" strokeWidth="1" />
                <text
                  x={textX}
                  y={textY}
                  fill={activeAxis?.key === m.key ? '#FFB000' : '#888888'}
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="cursor-pointer select-none"
                  onMouseEnter={() => setActiveAxis(m)}
                  onMouseLeave={() => setActiveAxis(null)}
                >
                  {m.name}
                </text>
              </g>
            );
          })}

          {/* Benchmark Polygon (Emerald Hairline) */}
          <polygon
            points={benchmarkPoints}
            fill="rgba(16, 185, 129, 0.08)"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Current System Polygon (Amber Active) */}
          <motion.polygon
            points={activePoints}
            fill="rgba(255, 176, 0, 0.18)"
            stroke="#FFB000"
            strokeWidth="2"
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          />

          {/* Polygon Vertex Handle Dots */}
          {metrics.map((m, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const r = (m.value / 100) * radius;
            const vx = center + Math.cos(angle) * r;
            const vy = center + Math.sin(angle) * r;

            return (
              <circle
                key={m.key}
                cx={vx}
                cy={vy}
                r="3.5"
                fill="#FFB000"
                stroke="#0A0A0A"
                strokeWidth="1"
                className="cursor-pointer"
                onMouseEnter={() => setActiveAxis(m)}
                onMouseLeave={() => setActiveAxis(null)}
              />
            );
          })}
        </svg>

        {/* Hovered Axis Tooltip Overlay */}
        {activeAxis && (
          <div className="absolute bottom-2 right-2 p-2 bg-[#141414] border border-[#FFB000] text-[10px] shadow-lg">
            <div className="text-white font-bold">{activeAxis.name}</div>
            <div className="text-[#FFB000]">SCORE: {activeAxis.value} / 100</div>
            <div className="text-[#10B981]">BENCHMARK: {activeAxis.benchmark} / 100</div>
          </div>
        )}
      </div>
    </div>
  );
};
