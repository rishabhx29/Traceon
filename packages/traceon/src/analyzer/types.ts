/**
 * Shared graph / analysis types for the Traceon CLI.
 * These mirror the web app's DB model interfaces (IGraphNode, IGraphEdge,
 * IMetrics) so the same analyzer core logic works in both contexts.
 */

export interface IGraphNode {
    id: string;
    label: string;
    type: 'type' | 'entry' | 'module' | 'utility' | 'component' | 'config' | 'other';
    path: string;
    imports: string[];
    exports: string[];
    loc: number;
    inDegree: number;
    outDegree: number;
    packageName?: string;
}

export interface IGraphEdge {
    source: string;
    target: string;
    relationship: 'imports' | 'exports' | 'calls';
    weight: number;
}

export interface IWorkspacePackage {
    name: string;
    path: string;
    version?: string;
    dependencies: string[];
}

export interface IWorkspaceInfo {
    type: 'turborepo' | 'nx' | 'lerna' | 'pnpm' | 'npm' | 'yarn' | 'none';
    packages: IWorkspacePackage[];
    rootName?: string;
}

export interface IMetrics {
    totalFiles: number;
    totalDependencies: number;
    dependencyDensity: number;
    criticalModules: string[];
    circularDependencies: string[][];
    fileTypeDistribution: Record<string, number>;
    workspaceInfo?: IWorkspaceInfo;
}

export interface IFile {
    repositoryId?: string;
    path: string;
    name: string;
    extension: string;
    type: 'file' | 'directory';
    loc: number;
    imports: string[];
    exports: string[];
    functions: string[];
    classes: string[];
}

export interface GraphData {
    nodes: IGraphNode[];
    edges: IGraphEdge[];
    metrics: IMetrics;
}

export interface ImpactResult {
    targetNodeId: string;
    targetLabel: string;
    impactScore: number;
    riskLevel: 'low' | 'moderate' | 'critical';
    directDependents: string[];
    transitiveDependents: string[];
    totalAffected: number;
    affectedNodes: string[];
}
