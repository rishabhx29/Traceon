import dagre from 'dagre';
import type { Edge, Node } from '@xyflow/react';
import type { GraphData, ImpactResult } from '../analyzer/types';

export type LayoutMode = 'hierarchical' | 'horizontal' | 'radial';

export interface BuiltGraph {
    flowNodes: Node[];
    flowEdges: Edge[];
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

function layoutDagre(nodes: Node[], edges: Edge[], direction: 'LR' | 'TB'): Map<string, { x: number; y: number }> {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80 });

    for (const node of nodes) {
        g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }
    for (const edge of edges) {
        g.setEdge(edge.source, edge.target);
    }
    dagre.layout(g);

    const positions = new Map<string, { x: number; y: number }>();
    for (const node of nodes) {
        const pos = g.node(node.id);
        if (pos) {
            positions.set(node.id, { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 });
        }
    }
    return positions;
}

function layoutRadial(nodes: Node[], edges: Edge[]): Map<string, { x: number; y: number }> {
    // Build adjacency for BFS
    const inDeg = new Map<string, number>();
    const adj = new Map<string, string[]>();
    nodes.forEach(n => { inDeg.set(n.id, 0); adj.set(n.id, []); });
    edges.forEach(e => {
        inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
        adj.get(e.source)?.push(e.target);
    });

    // BFS from entry nodes (inDegree === 0)
    const depth = new Map<string, number>();
    const queue: string[] = [];
    nodes.forEach(n => {
        if ((inDeg.get(n.id) || 0) === 0) {
            depth.set(n.id, 0);
            queue.push(n.id);
        }
    });
    if (queue.length === 0) {
        nodes.forEach(n => { depth.set(n.id, 0); queue.push(n.id); });
    }

    let head = 0;
    while (head < queue.length) {
        const curr = queue[head++];
        const d = depth.get(curr)!;
        for (const next of (adj.get(curr) || [])) {
            if (!depth.has(next)) {
                depth.set(next, d + 1);
                queue.push(next);
            }
        }
    }
    nodes.forEach(n => { if (!depth.has(n.id)) depth.set(n.id, 0); });

    // Group by depth into rings
    const rings = new Map<number, string[]>();
    nodes.forEach(n => {
        const d = depth.get(n.id)!;
        if (!rings.has(d)) rings.set(d, []);
        rings.get(d)!.push(n.id);
    });

    const RING_SPACING = 280;
    const positions = new Map<string, { x: number; y: number }>();
    const ringKeys = Array.from(rings.keys()).sort((a, b) => a - b);
    const maxRing = ringKeys.length > 0 ? ringKeys[ringKeys.length - 1] : 0;

    ringKeys.forEach((d, ringIndex) => {
        const ringNodes = rings.get(d)!;
        const radius = ringIndex === 0 ? 0 : ringIndex * RING_SPACING * 0.6;
        ringNodes.forEach((id, i) => {
            const angle = (2 * Math.PI * i) / ringNodes.length + (ringIndex * 0.5);
            positions.set(id, {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            });
        });
        void maxRing;
    });

    return positions;
}

export function buildFlowGraph(
    graphData: GraphData,
    impactById: Map<string, ImpactResult>,
    layoutMode: LayoutMode = 'horizontal'
): BuiltGraph {
    const criticalSet = new Set(graphData.metrics.criticalModules);

    const flowNodes: Node[] = graphData.nodes.map((n) => {
        const impact = impactById.get(n.id);
        const node: Node = {
            id: n.id,
            position: { x: 0, y: 0 },
            data: {
                label: n.label,
                nodeType: n.type,
                loc: n.loc,
                inDegree: n.inDegree,
                outDegree: n.outDegree,
                isCritical: criticalSet.has(n.id),
                impactScore: impact ? impact.impactScore : 0,
                riskLevel: impact ? impact.riskLevel : 'low',
                filePath: n.path,
                packageName: n.packageName,
            },
            type: 'traceon',
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        };
        return node;
    });

    const flowEdges: Edge[] = graphData.edges.map((e, i) => ({
        id: `e-${i}-${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: 'traceonEdge',
        animated: false,
    }));

    let positions: Map<string, { x: number; y: number }>;
    if (layoutMode === 'radial') {
        positions = layoutRadial(flowNodes, flowEdges);
    } else {
        positions = layoutDagre(flowNodes, flowEdges, layoutMode === 'horizontal' ? 'LR' : 'TB');
    }

    for (const node of flowNodes) {
        const pos = positions.get(node.id);
        if (pos) node.position = pos;
    }

    return { flowNodes, flowEdges };
}
