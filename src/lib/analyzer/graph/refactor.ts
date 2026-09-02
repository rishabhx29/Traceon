import type { IGraphNode, IGraphEdge, IMetrics } from '@/lib/db/models/AnalysisResult';

export interface GodObject {
    nodeId: string;
    label: string;
    path: string;
    nodeType: string;
    inDegree: number;
    outDegree: number;
    totalDegree: number;
    loc: number;
    severity: 'warning' | 'critical';
    reason: string;
    suggestion: string;
    dependents: string[];
    dependencies: string[];
}

export interface RefactoringSummary {
    godObjects: GodObject[];
    highCouplingPairs: { source: string; target: string; sharedDeps: number }[];
    totalIssues: number;
    healthScore: number;
}

function detectGodObjects(nodes: IGraphNode[], edges: IGraphEdge[]): GodObject[] {
    if (nodes.length === 0) return [];

    const degrees = nodes.map(node => node.inDegree + node.outDegree);
    const mean = degrees.reduce((sum, degree) => sum + degree, 0) / degrees.length;
    const variance = degrees.reduce((sum, degree) => sum + (degree - mean) ** 2, 0) / degrees.length;
    const threshold = Math.max(6, mean + 1.5 * Math.sqrt(variance));
    const dependentsOf = new Map<string, string[]>();
    const dependenciesOf = new Map<string, string[]>();

    for (const edge of edges) {
        dependentsOf.set(edge.target, [...(dependentsOf.get(edge.target) ?? []), edge.source]);
        dependenciesOf.set(edge.source, [...(dependenciesOf.get(edge.source) ?? []), edge.target]);
    }

    return nodes.flatMap(node => {
        const totalDegree = node.inDegree + node.outDegree;
        const extension = node.path.split('.').pop()?.toLowerCase() ?? '';
        const isNonRuntimeFile = ['json', 'css', 'scss', 'svg', 'md'].includes(extension)
            || node.path.includes('.test.')
            || node.path.includes('.spec.')
            || node.path.includes('/types/');
        const fanOutSmell = node.outDegree >= 8 && node.loc >= 150;
        const mixedResponsibilitySmell = node.inDegree >= 5 && node.outDegree >= 5 && node.loc >= 200;
        const oversizedHubSmell = node.inDegree >= 8 && node.loc >= 400;

        if (isNonRuntimeFile || totalDegree < threshold || (!fanOutSmell && !mixedResponsibilitySmell && !oversizedHubSmell)) {
            return [];
        }

        const severity: GodObject['severity'] = node.loc >= 500 && (node.outDegree >= 12 || totalDegree > mean + 3 * Math.sqrt(variance))
            ? 'critical'
            : 'warning';
        const reason = fanOutSmell
            ? `This ${node.loc}-LOC file imports ${node.outDegree} internal modules, which is concrete evidence that it coordinates several concerns.`
            : `This ${node.loc}-LOC file has ${node.inDegree} dependents and ${node.outDegree} dependencies, combining a broad change surface with multiple responsibilities.`;
        const suggestion = fanOutSmell
            ? 'Split only along existing responsibilities visible in the import groups; keep the current file as a thin orchestrator if callers need its public API.'
            : 'Extract one independently testable responsibility at a time, preserving the public API until callers have migrated.';

        return [{
            nodeId: node.id,
            label: node.label,
            path: node.path,
            nodeType: node.type,
            inDegree: node.inDegree,
            outDegree: node.outDegree,
            totalDegree,
            loc: node.loc,
            severity,
            reason,
            suggestion,
            dependents: [...(dependentsOf.get(node.id) ?? [])].sort(),
            dependencies: [...(dependenciesOf.get(node.id) ?? [])].sort(),
        }];
    }).sort((a, b) => (a.severity === b.severity ? b.totalDegree - a.totalDegree || a.path.localeCompare(b.path) : a.severity === 'critical' ? -1 : 1));
}

function calculateHealthScore(metrics: IMetrics, godObjectCount: number): number {
    let score = 100;
    score -= Math.min(25, metrics.circularDependencies.length * 5);
    score -= Math.min(30, godObjectCount * 6);
    return Math.max(0, Math.round(score));
}

/**
 * Generate high-confidence refactoring suggestions. Shared imports are not
 * reported as a smell because they do not prove duplicate logic or coupling.
 */
export function generateRefactoringSuggestions(
    nodes: IGraphNode[],
    edges: IGraphEdge[],
    metrics: IMetrics,
): RefactoringSummary {
    const godObjects = detectGodObjects(nodes, edges);
    const highCouplingPairs: { source: string; target: string; sharedDeps: number }[] = [];

    return {
        godObjects,
        highCouplingPairs,
        totalIssues: godObjects.length,
        healthScore: calculateHealthScore(metrics, godObjects.length),
    };
}
