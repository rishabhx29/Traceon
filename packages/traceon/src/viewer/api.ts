import type { GraphData, ImpactResult } from '../analyzer/types';

export async function fetchGraph(): Promise<GraphData> {
    const res = await fetch('/api/graph');
    if (!res.ok) throw new Error(`Failed to fetch graph: ${res.status}`);
    return (await res.json()) as GraphData;
}

export async function fetchImpact(): Promise<ImpactResult[]> {
    const res = await fetch('/api/impact');
    if (!res.ok) throw new Error(`Failed to fetch impact: ${res.status}`);
    return (await res.json()) as ImpactResult[];
}

export async function fetchNodeImpact(nodeId: string): Promise<ImpactResult | null> {
    const res = await fetch(`/api/impact/${encodeURIComponent(nodeId)}`);
    if (!res.ok) return null;
    return (await res.json()) as ImpactResult | null;
}
