import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
    Box,
    Layout,
    Wrench,
    FileCode2,
    Settings,
    File,
    FolderTree,
    Braces,
    type LucideIcon,
} from 'lucide-react';

const TYPE_CONFIG: Record<string, { color: string; bg: string; border: string; icon: LucideIcon }> = {
    entry: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.35)', icon: Box },
    component: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.35)', icon: Layout },
    utility: { color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.35)', icon: Wrench },
    module: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.35)', icon: FileCode2 },
    type: { color: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.35)', icon: Braces },
    config: { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.35)', icon: Settings },
    other: { color: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.35)', icon: File },
};

const RISK_COLORS: Record<string, string> = {
    critical: '#ef4444',
    moderate: '#f59e0b',
    low: '#10b981',
};

export interface TraceonNodeData extends Record<string, unknown> {
    label: string;
    nodeType: string;
    loc: number;
    inDegree: number;
    outDegree: number;
    isCritical: boolean;
    impactScore: number;
    riskLevel: 'low' | 'moderate' | 'critical';
    filePath: string;
    packageName?: string;
    isHighlighted?: boolean;
    isHeatmap?: boolean;
    dimmed?: boolean;
    blastRadius?: boolean;
    searchMatch?: boolean;
}

function TraceonNode({ data, selected }: { data: TraceonNodeData; selected?: boolean }) {
    const config = TYPE_CONFIG[data.nodeType] || TYPE_CONFIG.other;
    const Icon = config.icon;
    const isCritical = data.isCritical;
    const isHighlighted = data.isHighlighted || data.blastRadius;
    const isHeatmap = data.isHeatmap;

    // Complexity score (mirrors the web app)
    const rawScore = (data.loc / 300) + (data.inDegree * 0.1) + (data.outDegree * 0.1);
    const score = Math.min(1, Math.max(0, rawScore));

    // Hot gradient: blue -> green -> yellow -> red
    const heatmapColor = `hsl(${((1 - score) * 240).toFixed(0)}, 80%, 50%)`;
    let activeColor = isHeatmap ? heatmapColor : config.color;
    let activeBg = isHeatmap ? `${heatmapColor.slice(0, -1)}, 0.15)` : config.bg;
    const activeHighlightBg = isHeatmap ? `${heatmapColor.slice(0, -1)}, 0.25)` : config.bg;
    let activeBorder = isHeatmap ? `${heatmapColor.slice(0, -1)}, 0.4)` : config.border;

    // Blast radius tint
    if (data.blastRadius) {
        activeColor = RISK_COLORS[data.riskLevel] || '#34d399';
        activeBg = `rgba(16,185,129,0.10)`;
        activeBorder = RISK_COLORS[data.riskLevel] || 'rgba(52,211,153,0.7)';
    }

    const glowColor = activeColor.startsWith('hsl')
        ? activeColor.replace('hsl', 'hsla').replace(')', ', 0.3)')
        : `${activeColor}55`;

    return (
        <div
            style={{
                position: 'relative',
                opacity: data.dimmed ? 0.25 : 1,
                background: isHighlighted ? activeHighlightBg : activeBg,
                border: `1.5px solid ${selected || isHighlighted ? activeBorder : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '10px',
                padding: '10px 14px',
                minWidth: '140px',
                maxWidth: '220px',
                cursor: 'pointer',
                transition: 'opacity 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                boxShadow: selected
                    ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
                    : isCritical
                        ? '0 0 12px rgba(239,68,68,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.3)',
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: activeColor, border: 'none', width: 6, height: 6 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div
                    style={{
                        background: activeBg,
                        border: `1px solid ${activeBorder}`,
                        borderRadius: '6px',
                        padding: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.4s ease',
                    }}
                >
                    <Icon size={12} style={{ color: activeColor }} />
                </div>
                <span
                    style={{
                        color: '#e2e8f0',
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 150,
                    }}
                    title={data.filePath}
                >
                    {data.label}
                </span>
            </div>

            <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#94a3b8', alignItems: 'center' }}>
                <span>{data.loc} LOC</span>
                <span>↓{data.inDegree}</span>
                <span>↑{data.outDegree}</span>
                {data.impactScore > 0 && (
                    <span style={{ color: RISK_COLORS[data.riskLevel] || '#10b981', fontWeight: 600 }}>
                        {Math.round(data.impactScore)}
                    </span>
                )}
            </div>

            {data.packageName && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <FolderTree size={8} style={{ color: '#94a3b8', flexShrink: 0 }} />
                    <span
                        style={{
                            fontSize: 8,
                            fontFamily: 'monospace',
                            color: '#94a3b8',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: 150,
                        }}
                    >
                        {data.packageName}
                    </span>
                </div>
            )}

            {isCritical && (
                <div
                    title="Critical Module"
                    style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#ef4444',
                        border: '2px solid #0f0f0f',
                    }}
                />
            )}

            <Handle
                type="source"
                position={Position.Right}
                style={{ background: activeColor, border: 'none', width: 6, height: 6 }}
            />
        </div>
    );
}

export default memo(TraceonNode);
