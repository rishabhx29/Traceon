/**
 * Traceon CLI build script.
 *
 * Produces two artifacts in dist/:
 *  1. cli.js          — a single-file CommonJS bundle of the entire CLI
 *                       (analyzer core + server + embedded viewer HTML).
 *  2. viewer.js       — an IIFE bundle of the React Flow viewer, inlined by
 *                       build into the HTML template at cli.js build time.
 *
 * The CLI bundle externalizes nothing except node builtins, so the published
 * package has zero runtime dependency-install surprises (typescript,
 * fast-glob and get-tsconfig are bundled in; the package.json deps remain
 * for transparency / fallback).
 */
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

mkdirSync(distDir, { recursive: true });

// ---------------------------------------------------------------------------
// Step 1: Bundle the viewer (React + React Flow) as a self-contained IIFE
// ---------------------------------------------------------------------------
console.log('[traceon-build] Building viewer UI...');
await build({
  entryPoints: [path.join(__dirname, 'src/viewer/index.tsx')],
  bundle: true,
  format: 'iife',
  globalName: '__TRACEON_VIEWER__',
  target: ['es2020'],
  minify: true,
  sourcemap: false,
  jsx: 'automatic',
  alias: { '@traceon': path.join(__dirname, 'src') },
  outfile: path.join(distDir, 'viewer.js'),
  // React/ReactFlow/etc are all bundled — no externals. CSS is emitted inline
  // via a tiny runtime <style> injection in the viewer itself.
  logLevel: 'warning',
});

// ---------------------------------------------------------------------------
// Step 2: Build the CLI bundle, injecting the viewer bundle into the HTML
// template at build time so the published package is a single file.
// ---------------------------------------------------------------------------
console.log('[traceon-build] Building CLI...');

// Inline the viewer source into the CLI as a string module.
const viewerJs = readFileSync(path.join(distDir, 'viewer.js'), 'utf-8');
// Wrap as a CJS module exporting the string (JSON.stringify is the safest escape)
const viewerModule = `module.exports = ${JSON.stringify(viewerJs)};\n`;
writeFileSync(path.join(distDir, 'viewer-bundle.cjs'), viewerModule);

// ---------------------------------------------------------------------------
// Step 2b: Extract ReactFlow's stylesheet + the Traceon logo, so the CLI can
// serve them without any runtime file access beyond dist/.
// ---------------------------------------------------------------------------
console.log('[traceon-build] Embedding ReactFlow stylesheet + logo...');

// Locate @xyflow/react's css from the package root (monorepo root or local).
const cssCandidates = [
  path.join(__dirname, 'node_modules', '@xyflow', 'react', 'dist', 'style.css'),
  path.join(__dirname, '..', '..', 'node_modules', '@xyflow', 'react', 'dist', 'style.css'),
];
const cssPath = cssCandidates.find((p) => existsSync(p));
if (!cssPath) {
  throw new Error('[traceon-build] Could not find @xyflow/react/dist/style.css — run npm install first.');
}
const reactFlowCss = readFileSync(cssPath, 'utf-8');
writeFileSync(
  path.join(distDir, 'reactflow-styles.cjs'),
  `module.exports = ${JSON.stringify(reactFlowCss)};\n`
);

// Inline the Traceon logo (packages/traceon/assets/logo.png) as a data URI.
const logoCandidates = [
  path.join(__dirname, 'assets', 'logo.png'),
  path.join(__dirname, '..', '..', 'public', 'logo.png'),
];
const logoPath = logoCandidates.find((p) => existsSync(p));
const logoDataUri = logoPath
  ? `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`
  : null;
writeFileSync(
  path.join(distDir, 'logo-datauri.cjs'),
  `module.exports = ${JSON.stringify(logoDataUri)};\n`
);

await build({
  entryPoints: [path.join(__dirname, 'src/cli/index.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: ['node18'],
  minify: true,
  sourcemap: false,
  alias: { '@traceon': path.join(__dirname, 'src') },
  outfile: path.join(distDir, 'cli.js'),
  external: [
    // Node builtins must stay external in a platform:node bundle
    'node:*',
    'fs', 'path', 'os', 'url', 'http', 'crypto', 'child_process', 'util',
    'events', 'stream', 'zlib', 'buffer', 'worker_threads',
  ],
  logLevel: 'warning',
});

console.log('[traceon-build] Done.');
console.log(`  dist/cli.js   (${Math.round(existsSync(path.join(distDir, 'cli.js')) ? 1 : 0)} exists)`);
console.log('  dist/viewer.js');
