import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import type { IWorkspaceInfo, IWorkspacePackage } from './types';

/**
 * Detect monorepo workspace structure by reading config files.
 * Supports: Turborepo, Nx, Lerna, pnpm workspaces, npm/yarn workspaces.
 */
export async function detectWorkspaces(repoPath: string): Promise<IWorkspaceInfo> {
    const normalizedPath = repoPath.replace(/\\/g, '/');

    // Try each detection strategy in order of specificity
    const detectors: Array<() => Promise<IWorkspaceInfo | null>> = [
        () => detectTurborepo(normalizedPath),
        () => detectNx(normalizedPath),
        () => detectLerna(normalizedPath),
        () => detectPnpmWorkspaces(normalizedPath),
        () => detectNpmYarnWorkspaces(normalizedPath),
    ];

    for (const detect of detectors) {
        try {
            const result = await detect();
            if (result && result.packages.length > 0) {
                // Resolve internal cross-package dependencies
                await resolveCrossPackageDeps(result, normalizedPath);
                return result;
            }
        } catch (e) {
            console.warn('[Traceon] Workspace detection error:', e instanceof Error ? e.message : e);
        }
    }

    return { type: 'none', packages: [] };
}

async function detectTurborepo(repoPath: string): Promise<IWorkspaceInfo | null> {
    try {
        await fs.access(path.join(repoPath, 'turbo.json'));
    } catch {
        return null;
    }

    const baseInfo = await detectNpmYarnWorkspaces(repoPath) || await detectPnpmWorkspaces(repoPath);
    if (!baseInfo || baseInfo.packages.length === 0) return null;

    return { ...baseInfo, type: 'turborepo' };
}

async function detectNx(repoPath: string): Promise<IWorkspaceInfo | null> {
    let nxConfig: { projects?: Record<string, string> };
    try {
        const raw = await fs.readFile(path.join(repoPath, 'nx.json'), 'utf-8');
        nxConfig = JSON.parse(raw);
    } catch {
        return null;
    }

    const packages: IWorkspacePackage[] = [];

    if (nxConfig.projects) {
        for (const [name, projPath] of Object.entries(nxConfig.projects)) {
            packages.push({
                name,
                path: typeof projPath === 'string' ? projPath : name,
                dependencies: [],
            });
        }
    }

    if (packages.length === 0) {
        const projectJsonFiles = await fg('**/project.json', {
            cwd: repoPath,
            ignore: ['**/node_modules/**'],
            deep: 3,
        });

        for (const pjFile of projectJsonFiles) {
            try {
                const raw = await fs.readFile(path.join(repoPath, pjFile), 'utf-8');
                const proj = JSON.parse(raw);
                const projDir = path.dirname(pjFile).replace(/\\/g, '/');
                packages.push({
                    name: proj.name || path.basename(projDir),
                    path: projDir,
                    dependencies: [],
                });
            } catch { /* skip */ }
        }
    }

    if (packages.length === 0) {
        const wsInfo = await detectNpmYarnWorkspaces(repoPath);
        if (wsInfo) return { ...wsInfo, type: 'nx' };
    }

    if (packages.length === 0) return null;

    return { type: 'nx', packages };
}

async function detectLerna(repoPath: string): Promise<IWorkspaceInfo | null> {
    let lernaConfig: { packages?: string[] };
    try {
        const raw = await fs.readFile(path.join(repoPath, 'lerna.json'), 'utf-8');
        lernaConfig = JSON.parse(raw);
    } catch {
        return null;
    }

    const globs = lernaConfig.packages || ['packages/*'];
    const packages = await resolveWorkspaceGlobs(repoPath, globs);

    if (packages.length === 0) return null;
    return { type: 'lerna', packages };
}

async function detectPnpmWorkspaces(repoPath: string): Promise<IWorkspaceInfo | null> {
    let content: string;
    try {
        content = await fs.readFile(path.join(repoPath, 'pnpm-workspace.yaml'), 'utf-8');
    } catch {
        return null;
    }

    // Simple YAML parsing for the packages array (avoid heavy yaml dep)
    const globs: string[] = [];
    const lines = content.split('\n');
    let inPackages = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('packages:')) {
            inPackages = true;
            continue;
        }
        if (inPackages) {
            if (trimmed.startsWith('-')) {
                const glob = trimmed.replace(/^-\s*['"]?/, '').replace(/['"]?\s*$/, '');
                if (glob) globs.push(glob);
            } else if (trimmed && !trimmed.startsWith('#')) {
                break; // No longer in packages block
            }
        }
    }

    if (globs.length === 0) return null;
    const packages = await resolveWorkspaceGlobs(repoPath, globs);
    if (packages.length === 0) return null;

    return { type: 'pnpm', packages };
}

async function detectNpmYarnWorkspaces(repoPath: string): Promise<IWorkspaceInfo | null> {
    let pkg: { name?: string; workspaces?: string[] | { packages: string[] } };
    try {
        const raw = await fs.readFile(path.join(repoPath, 'package.json'), 'utf-8');
        pkg = JSON.parse(raw);
    } catch {
        return null;
    }

    if (!pkg.workspaces) return null;

    const globs = Array.isArray(pkg.workspaces)
        ? pkg.workspaces
        : pkg.workspaces.packages || [];

    if (globs.length === 0) return null;
    const packages = await resolveWorkspaceGlobs(repoPath, globs);
    if (packages.length === 0) return null;

    // Detect yarn via yarn.lock
    let type: IWorkspaceInfo['type'] = 'npm';
    try {
        await fs.access(path.join(repoPath, 'yarn.lock'));
        type = 'yarn';
    } catch { /* npm */ }

    return { type, packages, rootName: pkg.name };
}

async function resolveWorkspaceGlobs(repoPath: string, globs: string[]): Promise<IWorkspacePackage[]> {
    const packages: IWorkspacePackage[] = [];
    const seen = new Set<string>();

    for (const glob of globs) {
        const pattern = glob.endsWith('/*') || glob.endsWith('/**')
            ? `${glob.replace(/\/\*\*?$/, '')}/*/package.json`
            : `${glob}/package.json`;

        const matches = await fg(pattern, {
            cwd: repoPath,
            ignore: ['**/node_modules/**'],
            absolute: false,
        });

        for (const match of matches) {
            const pkgDir = path.dirname(match).replace(/\\/g, '/');
            if (seen.has(pkgDir)) continue;
            seen.add(pkgDir);

            try {
                const raw = await fs.readFile(path.join(repoPath, match), 'utf-8');
                const pkgJson = JSON.parse(raw);
                packages.push({
                    name: pkgJson.name || path.basename(pkgDir),
                    path: pkgDir,
                    version: pkgJson.version,
                    dependencies: [],
                });
            } catch {
                packages.push({
                    name: path.basename(pkgDir),
                    path: pkgDir,
                    dependencies: [],
                });
            }
        }
    }

    return packages;
}

async function resolveCrossPackageDeps(info: IWorkspaceInfo, repoPath: string): Promise<void> {
    const packageNames = new Set(info.packages.map(p => p.name));

    for (const pkg of info.packages) {
        try {
            const pkgJsonPath = path.join(repoPath, pkg.path, 'package.json');
            const raw = await fs.readFile(pkgJsonPath, 'utf-8');
            const pkgJson = JSON.parse(raw);

            const allDeps = {
                ...pkgJson.dependencies,
                ...pkgJson.devDependencies,
                ...pkgJson.peerDependencies,
            };

            for (const depName of Object.keys(allDeps)) {
                if (packageNames.has(depName)) {
                    pkg.dependencies.push(depName);
                }
            }
        } catch { /* skip */ }
    }
}
