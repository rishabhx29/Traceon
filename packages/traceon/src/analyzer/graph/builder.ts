import path from 'node:path';
import type { IGraphNode, IGraphEdge, IMetrics, IFile } from '../types';
import type { IWorkspaceInfo } from '../types';
import { getCriticalModuleIds } from './importance';

export function determineNodeType(filePath: string): IGraphNode['type'] {
    const name = path.basename(filePath).toLowerCase();
    const fullPath = filePath.toLowerCase();

    // 1. Next.js / React Entry Points
    if (
        name === 'page.tsx' || name === 'page.jsx' || name === 'page.js' ||
        name === 'layout.tsx' || name === 'layout.jsx' || name === 'layout.js' ||
        name === 'route.ts' || name === 'route.js' ||
        name === 'template.tsx' || name.startsWith('app.') || name === 'main.tsx' ||
        name === 'main.ts' || name === 'server.ts' || name === 'server.js' ||
        (name.startsWith('index.') && !fullPath.includes('/components/') && !fullPath.includes('/lib/') && !fullPath.includes('/utils/') && !fullPath.includes('/types/'))
    ) {
        return 'entry';
    }

    // 2. Components / UI
    if (
        fullPath.includes('/components/') || fullPath.includes('/ui/') || fullPath.includes('/views/') ||
        fullPath.includes('/pages/') || name.endsWith('component.ts') || name.endsWith('.tsx') || name.endsWith('.jsx') || name.endsWith('.vue') || name.endsWith('.svelte') || name.endsWith('.astro')
    ) {
        return 'component';
    }

    // 3. Types / Interfaces
    if (
        fullPath.includes('/types/') || fullPath.includes('/interfaces/') || name.endsWith('.d.ts') || name.includes('types.ts')
    ) {
        return 'type';
    }

    // 4. Utilities / Lib
    if (
        fullPath.includes('/utils/') || fullPath.includes('/lib/') || fullPath.includes('/helpers/') ||
        fullPath.includes('/services/') || fullPath.includes('/hooks/') || fullPath.includes('/context/') ||
        fullPath.includes('/store/') || fullPath.includes('/actions/') || fullPath.includes('/controllers/')
    ) {
        return 'utility';
    }

    // 5. Config
    if (
        name.includes('config') || name.endsWith('.json') || name.includes('setup') || name === '.env' || name.includes('middleware') || name.includes('theme')
    ) {
        return 'config';
    }

    return 'module';
}

export function resolveImportPath(
    importerPath: string,
    rawImport: string,
    existingFiles: Map<string, IFile>,
    pathsMatcher?: ((id: string, basePath?: string) => string[] | null) | null,
    repoPath?: string
): string | null {
    // Strip out suffix loaders (e.g. import logo from './logo.svg?url')
    let cleanImport = rawImport.split('?')[0];

    // Strip out extensions inside the import string to normalize attempts
    cleanImport = cleanImport.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, '');

    const dir = path.dirname(importerPath);
    const attemptPaths: string[] = [];

    // 1. Precise Alias resolution using get-tsconfig if available
    let wasResolvedByTsConfig = false;
    if (pathsMatcher && repoPath) {
        const absoluteImporterPath = path.join(repoPath, importerPath);
        const tsconfigMatches = pathsMatcher(rawImport, absoluteImporterPath);
        if (tsconfigMatches && tsconfigMatches.length > 0) {
            for (const absoluteMatch of tsconfigMatches) {
                const relFromRoot = path.relative(repoPath, absoluteMatch).replace(/\\/g, '/');
                const strippedRel = relFromRoot.replace(/\.(ts|tsx|js|jsx)$/, '');
                attemptPaths.push(strippedRel);
                wasResolvedByTsConfig = true;
            }
        }
    }

    if (!wasResolvedByTsConfig) {
        if (cleanImport.startsWith('@/') || cleanImport.startsWith('~/')) {
            // Very common aliases for 'src/' or root
            const stripped = cleanImport.substring(2);
            attemptPaths.push(`src/${stripped}`);
            attemptPaths.push(`app/${stripped}`);
            attemptPaths.push(stripped); // From root
        } else if (cleanImport.startsWith('/')) {
            attemptPaths.push(cleanImport.substring(1)); // Absolute to root
        } else if (cleanImport.startsWith('.')) {
            // Relative imports
            attemptPaths.push(path.join(dir, cleanImport).replace(/\\/g, '/'));
        } else {
            // A bare specifier is external unless tsconfig/workspace resolution
            // proved otherwise. Guessing a src/ path produces false graph edges.
            return null;
        }
    }

    // Try many extension combinations for EVERY attempt path
    const candidates = new Set<string>();

    for (const baseAttempt of attemptPaths) {
        candidates.add(baseAttempt);
        candidates.add(`${baseAttempt}.ts`);
        candidates.add(`${baseAttempt}.tsx`);
        candidates.add(`${baseAttempt}.js`);
        candidates.add(`${baseAttempt}.jsx`);
        candidates.add(`${baseAttempt}.mjs`);
        candidates.add(`${baseAttempt}.cjs`);
        candidates.add(`${baseAttempt}.d.ts`);
        candidates.add(`${baseAttempt}/index.ts`);
        candidates.add(`${baseAttempt}/index.tsx`);
        candidates.add(`${baseAttempt}/index.js`);
        candidates.add(`${baseAttempt}/index.jsx`);
        candidates.add(`${baseAttempt}/index.mjs`);
        candidates.add(`${baseAttempt}/index.cjs`);
        candidates.add(`${baseAttempt}.json`);
        candidates.add(`${baseAttempt}.css`); // For style imports
        candidates.add(`${baseAttempt}.scss`);
        candidates.add(`${baseAttempt}.vue`);
        candidates.add(`${baseAttempt}.svelte`);
        candidates.add(`${baseAttempt}.astro`);
        candidates.add(`${baseAttempt}.svg`);
        candidates.add(`${baseAttempt}.py`);
        candidates.add(`${baseAttempt}.go`);
        candidates.add(`${baseAttempt}.java`);
        candidates.add(`${baseAttempt}.kt`);
        candidates.add(`${baseAttempt}.rs`);
        candidates.add(`${baseAttempt}.rb`);
        candidates.add(`${baseAttempt}.php`);
        candidates.add(`${baseAttempt}.cs`);
        candidates.add(`${baseAttempt}.swift`);
    }

    for (const attempt of candidates) {
        if (existingFiles.has(attempt)) {
            return attempt;
        }
    }

    // A suffix match is safe only when it has exactly one candidate. Choosing the
    // first match made duplicate filenames connect to unrelated files.
    if (cleanImport.length > 2) {
        const fuzzyTarget = cleanImport.startsWith('@/') || cleanImport.startsWith('~/')
            ? cleanImport.substring(2)
            : cleanImport;

        const isExternalLike = !rawImport.startsWith('.') && !rawImport.startsWith('/') && !rawImport.startsWith('@/') && !rawImport.startsWith('~/');
        const hasPathChars = fuzzyTarget.includes('/');

        if (!isExternalLike || hasPathChars) {
            const matches: string[] = [];
            for (const [existingPath] of existingFiles.entries()) {
                const existingNoExt = existingPath.replace(/\.[^/.]+$/, "");

                if (
                    existingNoExt === fuzzyTarget ||
                    existingPath === fuzzyTarget ||
                    existingNoExt.endsWith(`/${fuzzyTarget}`) ||
                    existingPath.endsWith(`/${fuzzyTarget}`)
                ) {
                    matches.push(existingPath);
                }
            }
            if (matches.length === 1) return matches[0];
        }
    }

    return null;
}

export function calculateGraph(
    files: IFile[],
    pathsMatcher?: ((id: string, basePath?: string) => string[] | null) | null,
    repoPath?: string,
    workspaceInfo?: IWorkspaceInfo | null
): { nodes: IGraphNode[]; edges: IGraphEdge[]; metrics: IMetrics } {
    const existingMap = new Map<string, IFile>();
    files.forEach(f => existingMap.set(f.path, f));

    const nodesMap = new Map<string, IGraphNode>();
    const edges: IGraphEdge[] = [];

    let totalDependencies = 0;

    // 1. Build Base Nodes
    for (const file of files) {
        // Determine which workspace package this file belongs to
        let packageName: string | undefined;
        if (workspaceInfo && workspaceInfo.packages.length > 0) {
            for (const pkg of workspaceInfo.packages) {
                if (file.path.startsWith(pkg.path + '/') || file.path === pkg.path) {
                    packageName = pkg.name;
                    break;
                }
            }
            if (!packageName) {
                packageName = workspaceInfo.rootName || '(root)';
            }
        }

        nodesMap.set(file.path, {
            id: file.path,
            label: path.basename(file.path),
            type: determineNodeType(file.path),
            path: file.path,
            imports: file.imports,
            exports: file.exports,
            loc: file.loc,
            inDegree: 0,
            outDegree: 0,
            ...(packageName ? { packageName } : {}),
        });
    }

    // 2. Resolve Edges & Update Degrees
    for (const file of files) {
        const sourceId = file.path;

        const uniqueTargets = new Set<string>();

        for (const rawImport of file.imports) {
            const targetPath = resolveImportPath(sourceId, rawImport, existingMap, pathsMatcher, repoPath);

            if (targetPath && targetPath !== sourceId) {
                uniqueTargets.add(targetPath);
            }
        }

        for (const targetId of uniqueTargets) {
            edges.push({
                source: sourceId,
                target: targetId,
                relationship: 'imports',
                weight: 1
            });
            totalDependencies++;

            const sourceNode = nodesMap.get(sourceId);
            const targetNode = nodesMap.get(targetId);

            if (sourceNode) sourceNode.outDegree += 1;
            if (targetNode) targetNode.inDegree += 1;
        }
    }

    const nodes = Array.from(nodesMap.values());

    // Only mark modules with observed entry-point or dependency evidence.
    const criticalModules = getCriticalModuleIds(nodes, edges);

    // 4. File Type Distribution
    const distribution: Record<string, number> = {};
    for (const file of files) {
        let ext = file.extension || 'none';
        if (ext.startsWith('.')) ext = ext.substring(1);
        if (!ext) ext = 'none';

        distribution[ext] = (distribution[ext] || 0) + 1;
    }

    // 5. Detect Circular Dependencies (DFS)
    const circularDependencies: string[][] = [];
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const dfsPathArr: string[] = [];

    const adjMap = new Map<string, string[]>();
    for (const edge of edges) {
        if (!adjMap.has(edge.source)) adjMap.set(edge.source, []);
        adjMap.get(edge.source)!.push(edge.target);
    }

    function dfs(nodeId: string) {
        if (recStack.has(nodeId)) {
            const cycleStartIndex = dfsPathArr.indexOf(nodeId);
            if (cycleStartIndex !== -1) {
                const cycle = dfsPathArr.slice(cycleStartIndex).concat(nodeId);
                circularDependencies.push(cycle);
            }
            return;
        }

        if (visited.has(nodeId)) return;

        visited.add(nodeId);
        recStack.add(nodeId);
        dfsPathArr.push(nodeId);

        const neighbors = adjMap.get(nodeId) || [];
        for (const neighbor of neighbors) {
            dfs(neighbor);
        }

        dfsPathArr.pop();
        recStack.delete(nodeId);
    }

    for (const node of nodes) {
        if (!visited.has(node.id)) {
            dfs(node.id);
        }
    }

    // Keep top max 20 unique cycles to prevent payload blowup
    const uniqueCyclesMap = new Map<string, string[]>();
    for (const cycle of circularDependencies) {
        const key = [...new Set(cycle)].sort().join('|');
        if (!uniqueCyclesMap.has(key)) {
            uniqueCyclesMap.set(key, cycle);
        }
        if (uniqueCyclesMap.size >= 20) break;
    }
    const finalCycles = Array.from(uniqueCyclesMap.values());

    const metrics: IMetrics = {
        totalFiles: nodes.length,
        totalDependencies,
        dependencyDensity: nodes.length ? totalDependencies / nodes.length : 0,
        criticalModules,
        circularDependencies: finalCycles,
        fileTypeDistribution: distribution,
        ...(workspaceInfo && workspaceInfo.type !== 'none' ? { workspaceInfo } : {}),
    };

    return { nodes, edges, metrics };
}
