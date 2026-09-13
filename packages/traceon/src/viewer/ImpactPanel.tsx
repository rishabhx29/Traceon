import { Shield, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Zap, ArrowRight, X } from 'lucide-react';
import type { IGraphNode, ImpactResult } from '../analyzer/types';

interface ImpactPanelProps {
    node: IGraphNode | null;
    report: ImpactResult | null;
    fullReport: ImpactResult[];
    onHighlightNodes: (nodeIds: string[]) => void;
    onClearHighlight: () => void;
    onClose: () => void;
}

const RISK_CONFIG = {
    critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', label: 'Critical', icon: AlertTriangle },
    moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', label: 'Moderate', icon: Zap },
    low: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', label: 'Low', icon: Shield },
};

export default function ImpactPanel({
    node,
    report,
    fullReport,
    onHighlightNodes,
    onClearHighlight,
    onClose,
}: ImpactPanelProps) {
    const riskConfig = report ? RISK_CONFIG[report.riskLevel] : null;
    const RiskIcon = riskConfig?.icon;
    const summary = {
        critical: fullReport.filter(r => r.riskLevel === 'critical').length,
        moderate: fullReport.filter(r => r.riskLevel === 'moderate').length,
        low: fullReport.filter(r => r.riskLevel === 'low').length,
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: 64,
                right: 16,
                zIndex: 40,
                width: 320,
                maxHeight: 'calc(100vh - 84px)',
                overflowY: 'auto',
                borderRadius: 12,
                background: 'linear-gradient(180deg, #0d0d0d 0%, #111111 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} style={{ color: '#f59e0b' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Impact Analysis</span>
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close impact panel"
                    style={{
                        padding: 6,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        color: '#9ca3af',
                        display: 'flex',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ padding: 16 }}>
                {!node && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', textAlign: 'center' }}>
                        <Shield size={32} style={{ color: '#4b5563', marginBottom: 12 }} />
                        <p style={{ fontSize: 13, color: '#6b7280' }}>Click a node on the graph to analyze its impact</p>
                    </div>
                )}

                {node && report && riskConfig && RiskIcon && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* File header */}
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{node.label}</div>
                            <div style={{ fontSize: 10, color: '#6b7280', fontFamily: 'monospace', wordBreak: 'break-all' }}>{node.path}</div>
                        </div>

                        {/* Risk Badge */}
                        <div
                            style={{
                                borderRadius: 12,
                                padding: 16,
                                background: riskConfig.bg,
                                border: `1px solid ${riskConfig.border}`,
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <RiskIcon size={16} style={{ color: riskConfig.color }} />
                                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'wider', color: riskConfig.color }}>
                                    {riskConfig.label} Risk
                                </span>
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                                {report.impactScore.toFixed(1)}
                                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 400, marginLeft: 4 }}>/ 100</span>
                            </div>
                            <p style={{ fontSize: 11, color: '#9ca3af' }}>
                                Changing <span style={{ color: '#fff', fontWeight: 500 }}>{node.label}</span> would affect{' '}
                                <span style={{ fontWeight: 500, color: riskConfig.color }}>{report.totalAffected} files</span>
                            </p>
                        </div>

                        {/* Impact Score Bar */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#6b7280', marginBottom: 6 }}>
                                <span>Impact Score</span>
                                <span>{report.impactScore.toFixed(1)}%</span>
                            </div>
                            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                                <div
                                    style={{
                                        height: '100%',
                                        borderRadius: 999,
                                        width: `${report.impactScore}%`,
                                        background: `linear-gradient(90deg, ${riskConfig.color}80, ${riskConfig.color})`,
                                        transition: 'all 0.5s ease',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{report.directDependents.length}</div>
                                <div style={{ fontSize: 10, color: '#6b7280' }}>Direct</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 10, padding: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{report.transitiveDependents.length}</div>
                                <div style={{ fontSize: 10, color: '#6b7280' }}>Transitive</div>
                            </div>
                        </div>

                        {/* Highlight button */}
                        <button
                            onClick={() => onHighlightNodes(report.affectedNodes)}
                            style={{
                                width: '100%',
                                fontSize: 12,
                                fontWeight: 500,
                                padding: '10px 0',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                background: `${riskConfig.color}15`,
                                color: riskConfig.color,
                                border: `1px solid ${riskConfig.color}30`,
                                fontFamily: 'inherit',
                            }}
                        >
                            <Zap size={12} />
                            Highlight Affected on Graph
                        </button>

                        <button
                            onClick={onClearHighlight}
                            style={{
                                width: '100%',
                                fontSize: 12,
                                color: '#6b7280',
                                padding: '6px 0',
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#d1d5db')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
                        >
                            Clear Highlight
                        </button>

                        {/* Direct Dependents */}
                        {report.directDependents.length > 0 && (
                            <div>
                                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 'wider', color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>
                                    Direct Dependents ({report.directDependents.length})
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 120, overflowY: 'auto' }}>
                                    {report.directDependents.map((id) => (
                                        <div
                                            key={id}
                                            style={{
                                                fontSize: 11,
                                                fontFamily: 'monospace',
                                                color: 'rgba(52,211,153,0.8)',
                                                padding: '6px 10px',
                                                borderRadius: 6,
                                                background: 'rgba(255,255,255,0.02)',
                                                border: '1px solid rgba(255,255,255,0.03)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <ArrowRight size={10} style={{ color: '#4b5563', flexShrink: 0 }} />
                                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{id}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {node && fullReport.length > 0 && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 'wider', color: '#6b7280', fontWeight: 500, marginBottom: 8 }}>
                        All Files by Risk
                    </div>
                    {/* Summary */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                        {[
                            { label: 'Critical', count: summary.critical, color: '#ef4444' },
                            { label: 'Moderate', count: summary.moderate, color: '#f59e0b' },
                            { label: 'Low', count: summary.low, color: '#10b981' },
                        ].map(({ label, count, color }) => (
                            <div key={label} style={{ borderRadius: 10, padding: 10, textAlign: 'center', background: `${color}0f`, border: `1px solid ${color}26` }}>
                                <div style={{ fontSize: 16, fontWeight: 700, color }}>{count}</div>
                                <div style={{ fontSize: 9, textTransform: 'uppercase', color: `${color}99` }}>{label}</div>
                            </div>
                        ))}
                    </div>
                    {/* Top items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                        {fullReport
                            .slice()
                            .sort((a, b) => b.impactScore - a.impactScore)
                            .slice(0, 15)
                            .map((item) => {
                                const cfg = RISK_CONFIG[item.riskLevel];
                                return (
                                    <button
                                        key={item.targetNodeId}
                                        onClick={() => onHighlightNodes(item.affectedNodes)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 10,
                                            padding: '8px 12px',
                                            borderRadius: 10,
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.03)',
                                            fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 700,
                                                padding: '2px 6px',
                                                borderRadius: 4,
                                                background: cfg.bg,
                                                color: cfg.color,
                                                flexShrink: 0,
                                            }}
                                        >
                                            {item.impactScore.toFixed(0)}
                                        </span>
                                        <span style={{ flex: 1, minWidth: 0, fontSize: 12, color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.targetLabel}
                                        </span>
                                        <span style={{ fontSize: 10, color: '#6b7280', flexShrink: 0 }}>{item.totalAffected} affected</span>
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
