import type { IGraphNode, IGraphEdge, IMetrics } from '@/lib/db/models/AnalysisResult';
import { rankImportantNodes } from '@/lib/analyzer/graph/importance';

/** Generate a repeatable architecture summary from resolved graph evidence. */
export function generateArchitectureSummary(
    nodes: IGraphNode[],
    edges: IGraphEdge[],
    metrics: IMetrics,
    repoName?: string,
): string {
    const lines: string[] = [];
    const title = repoName || 'Repository';

    lines.push(`# Architecture Summary — ${title}`);
    lines.push('');
    lines.push('## Overview');
    lines.push(`This codebase contains **${metrics.totalFiles} files** with **${metrics.totalDependencies} resolved internal dependencies** (density: ${metrics.dependencyDensity.toFixed(2)} deps/file).`);
    lines.push('');

    lines.push('## File Type Distribution');
    for (const [ext, count] of Object.entries(metrics.fileTypeDistribution).sort(([, a], [, b]) => b - a)) {
        const pct = metrics.totalFiles ? ((count / metrics.totalFiles) * 100).toFixed(1) : '0.0';
        lines.push(`- **.${ext}**: ${count} files (${pct}%)`);
    }
    lines.push('');

    lines.push('## Architectural Layers');
    const layerCounts = nodes.reduce<Record<string, number>>((counts, node) => {
        counts[node.type] = (counts[node.type] || 0) + 1;
        return counts;
    }, {});
    for (const [layer, count] of Object.entries(layerCounts).sort(([aLayer, aCount], [bLayer, bCount]) => bCount - aCount || aLayer.localeCompare(bLayer))) {
        lines.push(`- **${layer}**: ${count} files`);
    }
    lines.push('');

    lines.push('## Critical Modules');
    lines.push('Files below have observed entry-point or dependency evidence; disconnected files are not promoted by rank alone.');
    lines.push('');
    const nodesById = new Map(nodes.map(node => [node.id, node]));
    const importantNodes = rankImportantNodes(nodes, edges)
        .filter(node => node.score >= 35 && node.directDependents > 0)
        .slice(0, 10);
    if (importantNodes.length === 0) {
        lines.push('- No file has enough resolved graph evidence to classify as critical.');
    }
    for (const important of importantNodes) {
        const node = nodesById.get(important.id)!;
        const evidence = important.reason === 'entry-point'
            ? 'runtime entry point'
            : `${important.directDependents} direct dependent${important.directDependents === 1 ? '' : 's'}`;
        lines.push(`- **\`${node.path}\`** — ${evidence}; ${node.outDegree} dependencies (${node.loc} LOC)`);
    }
    lines.push('');

    const entryPoints = nodes.filter(node => node.type === 'entry').sort((a, b) => a.path.localeCompare(b.path));
    if (entryPoints.length > 0) {
        lines.push('## Entry Points');
        for (const entryPoint of entryPoints.slice(0, 15)) {
            lines.push(`- \`${entryPoint.path}\` (${entryPoint.loc} LOC)`);
        }
        lines.push('');
    }

    if (metrics.circularDependencies.length > 0) {
        lines.push('## Circular Dependencies');
        for (const cycle of metrics.circularDependencies.slice(0, 5)) {
            lines.push(`- ${cycle.map(file => `\`${file}\``).join(' -> ')}`);
        }
        lines.push('');
    }

    const isolated = nodes.filter(node => node.inDegree === 0 && node.outDegree === 0).length;
    const consumers = nodes.filter(node => node.inDegree === 0 && node.outDegree > 0).length;
    const providers = nodes.filter(node => node.inDegree > 0 && node.outDegree === 0).length;
    const connectors = nodes.filter(node => node.inDegree > 0 && node.outDegree > 0).length;
    lines.push('## Dependency Flow');
    lines.push(`- **Isolated files**: ${isolated}`);
    lines.push(`- **Leaf consumers**: ${consumers}`);
    lines.push(`- **Pure providers**: ${providers}`);
    lines.push(`- **Connectors**: ${connectors}`);
    lines.push('');

    lines.push('## Directory Clusters');
    const directoryCounts = nodes.reduce<Record<string, number>>((counts, node) => {
        const directory = node.path.includes('/') ? node.path.split('/')[0] : '(root)';
        counts[directory] = (counts[directory] || 0) + 1;
        return counts;
    }, {});
    for (const [directory, count] of Object.entries(directoryCounts).sort(([aDirectory, aCount], [bDirectory, bCount]) => bCount - aCount || aDirectory.localeCompare(bDirectory)).slice(0, 15)) {
        lines.push(`- **${directory}/**: ${count} files`);
    }
    lines.push('');
    lines.push('---');
    lines.push('*Generated from the resolved dependency graph.*');

    return lines.join('\n');
}
