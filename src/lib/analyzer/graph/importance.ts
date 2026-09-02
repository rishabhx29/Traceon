import type { IGraphEdge, IGraphNode } from '@/lib/db/models/AnalysisResult';

export interface ImportantNode {
    id: string;
    score: number;
    directDependents: number;
    transitiveDependents: number;
    reason: 'entry-point' | 'shared-dependency' | 'operational-config';
}

function isTestOrGeneratedFile(filePath: string): boolean {
    const normalized = `/${filePath.toLowerCase()}`;
    return /\/(?:__tests__|__mocks__|test|tests|spec|specs|fixtures|examples|coverage|dist|build)\//.test(normalized)
        || /\.(?:test|spec)\.[^/]+$/.test(normalized)
        || /(?:^|\/)generated(?:\/|\.)/.test(normalized);
}

function isOperationalConfig(filePath: string): boolean {
    const name = filePath.split('/').pop()?.toLowerCase() ?? '';
    return name === 'package.json'
        || name === 'dockerfile'
        || name === 'docker-compose.yml'
        || name === 'docker-compose.yaml'
        || /^(?:next|vite|webpack|tsconfig|eslint|prettier|jest|vitest|playwright|tailwind)\..+/.test(name)
        || name === 'middleware.ts'
        || name === 'middleware.js';
}

function reverseReach(nodeId: string, reverseEdges: Map<string, string[]>): number {
    const visited = new Set([nodeId]);
    const queue = [...(reverseEdges.get(nodeId) ?? [])];

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        queue.push(...(reverseEdges.get(current) ?? []));
    }

    return visited.size - 1;
}

/**
 * Rank files from observed graph evidence. It deliberately does not force a
 * percentage of files to be "critical": a disconnected file has no graph
 * evidence of being a shared dependency.
 */
export function rankImportantNodes(nodes: IGraphNode[], edges: IGraphEdge[]): ImportantNode[] {
    const totalNodes = Math.max(1, nodes.length - 1);
    const maxOutDegree = nodes.reduce((max, node) => Math.max(max, node.outDegree), 1);
    const reverseEdges = new Map<string, string[]>();

    for (const edge of edges) {
        const importers = reverseEdges.get(edge.target) ?? [];
        importers.push(edge.source);
        reverseEdges.set(edge.target, importers);
    }

    return nodes.map(node => {
        const transitiveDependents = reverseReach(node.id, reverseEdges);
        const directScore = Math.min(45, Math.log2(node.inDegree + 1) * 10 + (node.inDegree / totalNodes) * 45);
        const reachScore = (transitiveDependents / totalNodes) * 30;
        const coordinationScore = (node.outDegree / maxOutDegree) * 5;
        const entryScore = node.type === 'entry' ? 35 : 0;
        const configScore = isOperationalConfig(node.path) ? 15 : 0;
        let score = directScore + reachScore + coordinationScore + entryScore + configScore;

        // Test/build output is useful evidence, but should not become a production
        // hotspot merely because a test runner imports it broadly.
        if (isTestOrGeneratedFile(node.path)) score = Math.min(score, 15);

        const reason: ImportantNode['reason'] = node.type === 'entry'
            ? 'entry-point'
            : isOperationalConfig(node.path)
                ? 'operational-config'
                : 'shared-dependency';

        return {
            id: node.id,
            score: Math.round(Math.min(100, score) * 10) / 10,
            directDependents: node.inDegree,
            transitiveDependents,
            reason,
        };
    }).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

export function getCriticalModuleIds(nodes: IGraphNode[], edges: IGraphEdge[]): string[] {
    return rankImportantNodes(nodes, edges)
        .filter(node => node.score >= 35 && node.directDependents > 0)
        .map(node => node.id);
}
