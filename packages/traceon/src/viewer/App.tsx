import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
    type Node,
    type Edge,
} from '@xyflow/react';
import { Search, LayoutGrid, GitBranch, Circle, Flame } from 'lucide-react';
import type { GraphData, ImpactResult } from '../analyzer/types';
import { fetchGraph, fetchImpact } from './api';
import { buildFlowGraph, type LayoutMode } from './layout';
import TraceonNode, { type TraceonNodeData } from './CustomNode';
import TraceonEdge from './CustomEdge';
import Legend from './Legend';
import ImpactPanel from './ImpactPanel';

const nodeTypes = { traceon: TraceonNode };
const edgeTypes = { traceonEdge: TraceonEdge };

const NODE_COLORS: Record<string, string> = {
    entry: '#f59e0b',
    component: '#8b5cf6',
    utility: '#06b6d4',
    module: '#10b981',
    type: '#eab308',
    config: '#f97316',
    other: '#64748b',
};

/** Repo name + logo are injected by the server into the HTML shell. */
function getInjected(key: string): string | null {
    if (typeof window !== 'undefined') {
        const w = window as unknown as Record<string, string | null | undefined>;
        return w[key] || null;
    }
    return null;
}

export default function App() {
    const [graph, setGraph] = useState<GraphData | null>(null);
    const [impact, setImpact] = useState<ImpactResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const constSearchRef = useRef(search);
    constSearchRef.current = search;
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
    const [isHeatmap, setIsHeatmap] = useState(false);
    const [showImpactPanel, setShowImpactPanel] = useState(false);
    const [highlightSet, setHighlightSet] = useState<string[] | null>(null);

    const reactFlow = useReactFlow();

    useEffect(() => {
        Promise.all([fetchGraph(), fetchImpact()])
            .then(([g, i]) => {
                setGraph(g);
                setImpact(i);
            })
            .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    }, []);

    const impactById = useMemo(() => {
        const m = new Map<string, ImpactResult>();
        for (const r of impact) m.set(r.targetNodeId, r);
        return m;
    }, [impact]);

    const built = useMemo(() => {
        if (!graph) return null;
        return buildFlowGraph(graph, impactById, layoutMode);
    }, [graph, impactById, layoutMode]);

    const [nodes, setNodes, onNodesChange] = useNodesState((built?.flowNodes ?? []) as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState((built?.flowEdges ?? []) as Edge[]);

    // Re-lay out when graph data or layout mode changes, then fit view
    useEffect(() => {
        if (!built) return;
        setNodes(built.flowNodes as Node[]);
        setEdges(built.flowEdges as Edge[]);
        // Fit the view to the new layout after React Flow renders it
        const t = window.setTimeout(() => {
            reactFlow.fitView({ padding: 0.25, duration: 400 });
        }, 50);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [built]);

    /** Apply visual state (search dim, highlight, blast radius, heatmap) to nodes */
    const refreshVisuals = useCallback(
        (opts: { hovered?: string | null; selected?: string | null; highlights?: string[] | null; heatmap?: boolean; search?: string }) => {
            const hovered = opts.hovered !== undefined ? opts.hovered : hoveredId;
            const selected = opts.selected !== undefined ? opts.selected : selectedId;
            const highlights = opts.highlights !== undefined ? opts.highlights : highlightSet;
            const heatmap = opts.heatmap !== undefined ? opts.heatmap : isHeatmap;
            const q = (opts.search !== undefined ? opts.search : constSearchRef.current).toLowerCase();

            setNodes((ns) =>
                ns.map((n) => {
                    const d = n.data as TraceonNodeData;
                    let dimmed = false;
                    let blastRadius = false;
                    let isHighlighted = false;

                    if (q) {
                        const match = d.filePath.toLowerCase().includes(q) || d.label.toLowerCase().includes(q);
                        dimmed = !match;
                    }

                    if (highlights) {
                        const inSet = highlights.includes(n.id);
                        isHighlighted = inSet;
                        dimmed = !inSet;
                    }

                    if (selected) {
                        const report = impactById.get(selected);
                        const affected = new Set(report ? [selected, ...report.affectedNodes] : [selected]);
                        blastRadius = affected.has(n.id);
                        dimmed = !affected.has(n.id);
                    }

                    if (hovered) {
                        const report = impactById.get(hovered);
                        const affected = new Set(report ? [hovered, ...report.affectedNodes] : [hovered]);
                        if (affected.has(n.id)) isHighlighted = true;
                    }

                    return {
                        ...n,
                        data: {
                            ...d,
                            dimmed,
                            blastRadius,
                            isHighlighted,
                            isHeatmap: heatmap,
                        },
                    };
                })
            );
        },
        [setNodes, hoveredId, selectedId, highlightSet, isHeatmap, impactById]
    );

    // Keep visuals in sync with every interaction state change
    useEffect(() => {
        refreshVisuals({});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hoveredId, selectedId, highlightSet, isHeatmap, search, refreshVisuals]);

    // Edge highlighting follows hover/selection
    useEffect(() => {
        setEdges((es) =>
            es.map((e) => {
                const connected =
                    (hoveredId && (e.source === hoveredId || e.target === hoveredId)) ||
                    (selectedId && (e.source === selectedId || e.target === selectedId));
                return {
                    ...e,
                    data: { ...e.data, isHighlighted: !!connected },
                };
            })
        );
    }, [hoveredId, selectedId, setEdges]);

    const onNodeClick = useCallback(
        (_evt: unknown, node: Node) => {
            const next = node.id === selectedId ? null : node.id;
            setSelectedId(next);
            setShowImpactPanel(true);
        },
        [selectedId]
    );

    const onNodeMouseEnter = useCallback((_evt: unknown, node: Node) => setHoveredId(node.id), []);
    const onNodeMouseLeave = useCallback(() => setHoveredId(null), []);

    const onPaneClick = useCallback(() => {
        setSelectedId(null);
        setHighlightSet(null);
    }, []);

    const handleHighlightFromPanel = useCallback((ids: string[]) => {
        setHighlightSet(ids);
    }, []);

    const handleClearHighlight = useCallback(() => {
        setHighlightSet(null);
        setSelectedId(null);
    }, []);

    if (error) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ color: '#ef4444', fontFamily: 'monospace' }}>Error: {error}</div>
            </div>
        );
    }

    if (!graph) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 12 }}>
                <div style={{ width: 24, height: 24, border: '2px solid rgba(16,185,129,0.3)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ color: '#10b981', fontFamily: 'monospace', fontSize: 14 }}>Loading graph…</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const m = graph.metrics;
    const selectedReport = (selectedId ? impactById.get(selectedId) : null) ?? null;
    const selectedNode = (selectedId ? graph.nodes.find((n) => n.id === selectedId) : null) ?? null;
    const repoName = getInjected('__TRACEON_REPO_NAME__') || 'Untitled';
    const logoDataUri = getInjected('__TRACEON_LOGO__');

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            {/* ─── Toolbar ─────────────────────────────────────────── */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: 'rgba(13,13,13,0.9)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(12px)',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
            >
                {/* Logo + repo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    {logoDataUri ? (
                        <img src={logoDataUri} alt="Traceon" style={{ width: 24, height: 24, borderRadius: 6 }} />
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    )}
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#10b981', letterSpacing: 0.5 }}>traceon</span>
                    <span style={{ fontSize: 12, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        — {repoName}
                    </span>
                </div>

                {/* Metrics */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Metric value={String(m.totalFiles)} label="Files" />
                    <Metric value={String(m.totalDependencies)} label="Deps" />
                    <Metric value={String(m.circularDependencies.length)} label="Cycles" danger={m.circularDependencies.length > 0} />
                    <Metric value={String(m.criticalModules.length)} label="Critical" danger={m.criticalModules.length > 0} />
                </div>

                {/* Right controls */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search files…"
                        style={{
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            color: '#e5e5e5',
                            fontSize: 12,
                            padding: '6px 10px 6px 28px',
                            outline: 'none',
                            width: 180,
                            fontFamily: 'inherit',
                        }}
                    />
                    <div style={{ position: 'relative' }}>
                        <Search size={12} style={{ position: 'absolute', left: 8, top: 8, color: '#6b7280', pointerEvents: 'none' }} />
                    </div>

                    <ToolButton
                        active={isHeatmap}
                        onClick={() => setIsHeatmap(!isHeatmap)}
                        title="Toggle complexity heatmap"
                    >
                        <Flame size={14} />
                    </ToolButton>

                    {/* Layout switcher */}
                    <div
                        style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 8,
                            overflow: 'hidden',
                        }}
                    >
                        {([
                            { mode: 'horizontal' as LayoutMode, icon: <LayoutGrid size={12} />, title: 'Horizontal layout' },
                            { mode: 'hierarchical' as LayoutMode, icon: <GitBranch size={12} />, title: 'Hierarchical (top-down)' },
                            { mode: 'radial' as LayoutMode, icon: <Circle size={12} />, title: 'Radial layout' },
                        ]).map(({ mode, icon, title }) => (
                            <button
                                key={mode}
                                onClick={() => setLayoutMode(mode)}
                                title={title}
                                style={{
                                    padding: '6px 10px',
                                    background: layoutMode === mode ? 'rgba(16,185,129,0.15)' : 'transparent',
                                    border: 'none',
                                    borderRight: '1px solid rgba(255,255,255,0.06)',
                                    color: layoutMode === mode ? '#10b981' : '#6b7280',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Graph canvas ────────────────────────────────────── */}
            <div style={{ width: '100%', height: '100%', paddingTop: 50 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    onNodeMouseEnter={onNodeMouseEnter}
                    onNodeMouseLeave={onNodeMouseLeave}
                    onPaneClick={onPaneClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.3 }}
                    minZoom={0.1}
                    maxZoom={2}
                    nodesDraggable
                    proOptions={{ hideAttribution: true }}
                >
                    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.03)" />
                    <Controls
                        showInteractive={false}
                        style={{
                            bottom: 16,
                            left: 16,
                            background: 'rgba(13,13,13,0.9)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 10,
                        }}
                    />
                    <MiniMap
                        pannable
                        zoomable
                        style={{
                            background: 'rgba(13,13,13,0.9)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 10,
                            bottom: 16,
                            right: 16,
                        }}
                        maskColor="rgba(0,0,0,0.7)"
                        nodeColor={(n) => {
                            const d = n.data as TraceonNodeData;
                            return NODE_COLORS[d.nodeType] || '#64748b';
                        }}
                    />
                </ReactFlow>
            </div>

            {/* ─── Legend ──────────────────────────────────────────── */}
            <Legend />

            {/* ─── Impact panel ────────────────────────────────────── */}
            {showImpactPanel && (
                <ImpactPanel
                    node={selectedNode}
                    report={selectedReport}
                    fullReport={impact}
                    onHighlightNodes={handleHighlightFromPanel}
                    onClearHighlight={handleClearHighlight}
                    onClose={() => setShowImpactPanel(false)}
                />
            )}
        </div>
    );
}

function Metric({ value, label, danger }: { value: string; label: string; danger?: boolean }) {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: danger ? '#ef4444' : '#fff' }}>{value}</div>
            <div style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
        </div>
    );
}

function ToolButton({
    active,
    onClick,
    title,
    children,
}: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            style={{
                padding: '6px 10px',
                background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 8,
                color: active ? '#10b981' : '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            {children}
        </button>
    );
}
