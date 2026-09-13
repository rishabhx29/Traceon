#!/usr/bin/env node
/**
 * Traceon CLI
 *
 * Analyzes the codebase in the current directory (or a given path) and:
 *  1. Prints a metrics report to the terminal.
 *  2. Starts a local-only HTTP server serving the interactive dependency
 *     graph viewer, then opens it in the default browser.
 *
 * Usage:
 *   npx traceon-analyzer [path] [--json] [--no-open] [--port N]
 */
import path from 'node:path';
import fs from 'node:fs';
import { extractGraphData } from '../analyzer/extractor';
import { generateFullImpactReport } from '../analyzer/graph/impact';
import { startServer } from '../server/server';
import type { GraphData } from '../analyzer/types';

interface CliArgs {
    targetPath: string;
    json: boolean;
    open: boolean;
    port?: number;
    help: boolean;
}

function parseArgs(argv: string[]): CliArgs {
    const args: CliArgs = { targetPath: process.cwd(), json: false, open: true, help: false };
    const rest: string[] = [];

    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--json') args.json = true;
        else if (a === '--no-open') args.open = false;
        else if (a === '--port') {
            const v = argv[++i];
            if (v) args.port = parseInt(v, 10);
        } else if (a === '--help' || a === '-h') {
            args.help = true;
        } else if (!a.startsWith('--')) {
            rest.push(a);
        }
    }

    if (rest.length > 0) {
        args.targetPath = path.resolve(rest[0]);
    }
    return args;
}

function printHelp(): void {
    const text = [
        '',
        '  traceon - analyze any codebase into an interactive dependency graph',
        '',
        '  USAGE',
        '    npx traceon-analyzer [path] [options]',
        '',
        '  ARGS',
        '    path                Directory to analyze (default: current directory)',
        '',
        '  OPTIONS',
        '    --json              Print machine-readable JSON report to stdout and exit',
        '    --no-open           Do not open the browser automatically',
        '    --port <n>          Preferred port for the local viewer (default 4323)',
        '    --help, -h          Show this help',
        '',
        '  EXAMPLES',
        '    npx traceon-analyzer                    Analyze the project in the current directory',
        '    npx traceon-analyzer ./packages/api     Analyze a subdirectory',
        '    npx traceon-analyzer --json > report.json',
        '',
    ].join('\n');
    console.log(text);
}

const C = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function hr(width = 62): string {
    return '-'.repeat(width);
}

function printReport(graphData: GraphData, durationMs: number, repoName: string): void {
    const { nodes, edges, metrics } = graphData;
    const out: string[] = [];

    out.push('');
    out.push('  ' + C.bold + C.green + 'traceon' + C.reset + C.dim + ' - analyzed ' + repoName + ' in ' + (durationMs / 1000).toFixed(1) + 's' + C.reset);
    out.push('  ' + hr());
    out.push('');

    out.push('  ' + C.bold + 'Files' + C.reset + '            ' + metrics.totalFiles);
    out.push('  ' + C.bold + 'Dependencies' + C.reset + '     ' + metrics.totalDependencies);
    out.push('  ' + C.bold + 'Density' + C.reset + '          ' + metrics.dependencyDensity.toFixed(2) + ' edges / file');
    out.push('');

    // File type distribution (top 8)
    out.push('  ' + C.bold + 'File types' + C.reset);
    const dist = Object.entries(metrics.fileTypeDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    const maxCount = dist.length > 0 ? dist[0][1] : 1;
    for (const entry of dist) {
        const ext = entry[0];
        const count = entry[1];
        const barLen = Math.max(1, Math.round((count / maxCount) * 24));
        const bar = '#'.repeat(barLen);
        out.push('    ' + ext.padEnd(6) + ' ' + C.green + bar + C.reset + ' ' + count);
    }
    out.push('');

    // Critical modules (top 8 by in-degree)
    out.push('  ' + C.bold + 'Critical modules' + C.reset + C.dim + ' (most depended-upon files)' + C.reset);
    if (metrics.criticalModules.length === 0) {
        out.push('    ' + C.dim + 'None detected' + C.reset);
    } else {
        const inDegreeById = new Map<string, number>();
        for (const n of nodes) inDegreeById.set(n.id, n.inDegree);
        const top = metrics.criticalModules
            .map((id) => ({ id: id, inDeg: inDegreeById.get(id) || 0 }))
            .sort((a, b) => b.inDeg - a.inDeg)
            .slice(0, 8);
        for (const item of top) {
            out.push('    ' + C.yellow + item.id.padEnd(46) + C.reset + ' ' + item.inDeg + ' importers');
        }
    }
    out.push('');

    // Circular dependencies
    if (metrics.circularDependencies.length > 0) {
        out.push('  ' + C.bold + C.red + '! Circular dependencies' + C.reset + C.dim + ' (' + metrics.circularDependencies.length + ')' + C.reset);
        for (const cycle of metrics.circularDependencies.slice(0, 5)) {
            out.push('    ' + C.red + cycle.join(' -> ') + C.reset);
        }
        if (metrics.circularDependencies.length > 5) {
            out.push('    ' + C.dim + '+' + (metrics.circularDependencies.length - 5) + ' more cycles' + C.reset);
        }
        out.push('');
    }

    // Workspace
    if (metrics.workspaceInfo && metrics.workspaceInfo.type !== 'none') {
        out.push('  ' + C.bold + 'Workspace' + C.reset + '         ' + metrics.workspaceInfo.type + ' with ' + metrics.workspaceInfo.packages.length + ' packages');
        out.push('');
    }

    out.push('  ' + hr());
    out.push('');
    console.log(out.join('\n'));
}

function openBrowser(url: string): void {
    // Lazy require so --json runs never touch child_process
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const spawn = require('node:child_process').spawn;
    const plat = process.platform;
    try {
        if (plat === 'darwin') {
            spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
        } else if (plat === 'win32') {
            spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
        } else {
            spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
        }
    } catch {
        // non-fatal
    }
}

async function main(): Promise<void> {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        printHelp();
        return;
    }

    const targetPath = args.targetPath;

    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isDirectory()) {
        console.error('  ' + C.red + 'error:' + C.reset + ' path does not exist or is not a directory: ' + targetPath);
        process.exit(1);
    }

    const repoName = path.basename(path.resolve(targetPath));

    if (args.json) {
        const result = await extractGraphData(targetPath);
        const payload = {
            repository: repoName,
            analyzedAt: new Date().toISOString(),
            graph: result.graphData,
        };
        process.stdout.write(JSON.stringify(payload, null, 2) + '\n');
        return;
    }

    console.log('');
    console.log('  ' + C.green + 'o' + C.reset + ' ' + C.bold + 'traceon' + C.reset + C.dim + ' - analyzing ' + repoName + '...' + C.reset);
    console.log('');

    const started = Date.now();
    const result = await extractGraphData(targetPath);
    const durationMs = Date.now() - started;

    const impactReport = generateFullImpactReport(
        result.graphData.nodes,
        result.graphData.edges,
        result.graphData.metrics.criticalModules
    );

    printReport(result.graphData, durationMs, repoName);

    console.log('  ' + C.dim + 'Starting local viewer...' + C.reset);
    const server = await startServer(result.graphData, repoName, args.port);
    const url = 'http://localhost:' + server.port;

    console.log('');
    console.log('  ' + C.green + 'o' + C.reset + ' ' + C.bold + 'Viewer ready' + C.reset + ' ' + C.dim + '->' + C.reset + ' ' + C.cyan + url + C.reset);
    console.log('  ' + C.dim + 'Press Ctrl+C to stop.' + C.reset);
    console.log('');

    if (args.open) openBrowser(url);

    process.on('SIGINT', () => {
        server.close();
        process.exit(0);
    });
}

main().catch((err) => {
    console.error('  ' + C.red + 'error:' + C.reset, err instanceof Error ? err.message : err);
    process.exit(1);
});
