import type { IGraphNode, IGraphEdge, ImpactResult } from '../types';

/**
 * Perform reverse BFS from a target node to find all dependents.
 * "Dependents" = files that import the target (directly or transitively).
 */
function reverseBFS(
    targetId: string,
    edges: IGraphEdge[]
): { direct: string[]; transitive: string[]; allAffected: string[] } {
    // Build reverse adjacency: target -> [sources that import target]
    const reverseAdj = new Map<string, string[]>();
    for (const edge of edges) {
        if (!reverseAdj.has(edge.target)) reverseAdj.set(edge.target, []);
        reverseAdj.get(edge.target)!.push(edge.source);
    }

    const visited = new Set<string>();
    const direct: string[] = [];
    const transitive: string[] = [];
    const queue: string[] = [];

    // Seed with the target node
    visited.add(targetId);
    const directSources = reverseAdj.get(targetId) || [];

    for (const src of directSources) {
        if (!visited.has(src)) {
            visited.add(src);
            direct.push(src);
            queue.push(src);
        }
    }

    // BFS for transitive dependents
    while (queue.length > 0) {
        const current = queue.shift()!;
        const neighbors = reverseAdj.get(current) || [];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                transitive.push(neighbor);
                queue.push(neighbor);
            }
        }
    }

    const allAffected = [...direct, ...transitive];
    return { direct, transitive, allAffected };
}

/**
 * Classify a file path to determine if it's a low-importance file type.
 * Config files, type declarations, and test files should not easily score critical.
 */
function isLowImportanceFile(filePath: string): boolean {
    const name = filePath.toLowerCase();
    return (
        name.includes('.test.') ||
        name.includes('.spec.') ||
        name.includes('__test') ||
        name.includes('__mock') ||
        name.includes('/fixtures/') ||
        name.includes('/generated/') ||
        name.includes('/dist/') ||
        name.includes('/build/')
    );
}

/**
 * Calculate an impact score for a given node.
 *
 * Score range: 0–100.
 */
function calculateImpactScore(
    targetNode: IGraphNode,
    directCount: number,
    transitiveCount: number,
    totalNodes: number,
    criticalModules: string[],
    affectedNodes: string[]
): number {
    if (directCount === 0 && transitiveCount === 0) return 0;

    const totalAffected = directCount + transitiveCount;

    // --- Component 1: Direct dependents ratio (0–35 pts) ---
    const directRatio = directCount / totalNodes;
    const directScore = Math.min(35, Math.log1p(directRatio * 100) / Math.log1p(100) * 35);

    // --- Component 2: Transitive spread (0–30 pts) ---
    const transitiveRatio = transitiveCount / totalNodes;
    const transitiveScore = Math.min(30, Math.sqrt(transitiveRatio) * 30);

    // --- Component 3: Overall reach fraction (0–25 pts) ---
    const reachRatio = totalAffected / totalNodes;
    const reachScore = Math.min(25, Math.log1p(reachRatio * 50) / Math.log1p(50) * 25);

    // --- Component 4: Critical module overlap (0–10 pts) ---
    const criticalAffected = affectedNodes.filter(id => criticalModules.includes(id)).length;
    const criticalScore = Math.min(10, criticalAffected * 2.5);

    let rawScore = directScore + transitiveScore + reachScore + criticalScore;

    // --- Dampening for low-importance file types ---
    if (isLowImportanceFile(targetNode.path)) {
        rawScore *= 0.5;
    }

    return Math.min(100, Math.round(rawScore * 10) / 10);
}

function getRiskLevel(score: number): 'low' | 'moderate' | 'critical' {
    if (score >= 60) return 'critical';
    if (score >= 30) return 'moderate';
    return 'low';
}

/**
 * Main entry: analyze the impact of changing a specific file.
 */
export function analyzeImpact(
    targetNodeId: string,
    nodes: IGraphNode[],
    edges: IGraphEdge[],
    criticalModules: string[]
): ImpactResult | null {
    const nodesMap = new Map<string, IGraphNode>();
    nodes.forEach((n) => nodesMap.set(n.id, n));

    const targetNode = nodesMap.get(targetNodeId);
    if (!targetNode) return null;

    const { direct, transitive, allAffected } = reverseBFS(targetNodeId, edges);

    const impactScore = calculateImpactScore(
        targetNode,
        direct.length,
        transitive.length,
        nodes.length,
        criticalModules,
        allAffected
    );
    const riskLevel = getRiskLevel(impactScore);

    return {
        targetNodeId,
        targetLabel: targetNode.label,
        impactScore,
        riskLevel,
        directDependents: direct,
        transitiveDependents: transitive,
        totalAffected: allAffected.length,
        affectedNodes: allAffected,
    };
}

/**
 * Generate full impact report for ALL nodes in the graph.
 * Returns sorted by impact score descending.
 */
export function generateFullImpactReport(
    nodes: IGraphNode[],
    edges: IGraphEdge[],
    criticalModules: string[]
): ImpactResult[] {
    const results: ImpactResult[] = [];

    for (const node of nodes) {
        const result = analyzeImpact(node.id, nodes, edges, criticalModules);
        if (result && result.totalAffected > 0) {
            results.push(result);
        }
    }

    // Sort by impact score descending
    results.sort((a, b) => b.impactScore - a.impactScore || a.targetNodeId.localeCompare(b.targetNodeId));
    return results;
}
