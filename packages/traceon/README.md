# traceon-analyzer

Analyze any codebase into an interactive dependency graph — right from your terminal. Zero config, 100% offline, no signup, no database, no server required.

```bash
npx traceon-analyzer
```

That's it. Traceon scans your project, parses every source file into an AST via the TypeScript Compiler API, builds the full dependency graph, prints a metrics report to your terminal, and launches an interactive graph viewer in your browser.

## What you get

**Terminal report** — file counts, dependency density, file type distribution, critical modules (most depended-upon files), and circular dependency chains:

```
  traceon - analyzed my-project in 1.2s
  --------------------------------------------------------------

  Files            1069
  Dependencies     336
  Density          0.31 edges / file

  File types
    ts     ######################## 412
    tsx    ###### 128
    ...

  Critical modules (most depended-upon files)
    lib/parser.ts                        23 importers
    lib/graph/builder.ts                 18 importers

  ! Circular dependencies (2)
    lib/a.ts -> lib/b.ts -> lib/a.ts
  --------------------------------------------------------------
```

**Interactive viewer** — a local-only web app at `http://localhost:4323` with:

- Force-directed dependency graph (React Flow, dark theme)
- Click any file to see its **impact score (0–100)**, risk level, and blast radius — every direct and transitive dependent lights up
- Search to filter files by name or path
- Circular dependency detection
- Workspace / monorepo (npm, pnpm, yarn, lerna) package boundaries

Your code never leaves your machine — analysis happens entirely in local Node.js processes, and the viewer binds to `127.0.0.1` only.

## Usage

```bash
npx traceon-analyzer                      # analyze current directory + open viewer
npx traceon-analyzer ./packages/api       # analyze a subdirectory
npx traceon-analyzer --json > report.json # machine-readable output for CI
npx traceon-analyzer --no-open --port 5000 # custom port, no auto browser open
npx traceon-analyzer --help               # all options
```

### Options

| Flag | Description |
| --- | --- |
| `path` | Directory to analyze (default: current directory) |
| `--json` | Print machine-readable JSON report to stdout and exit (no viewer) |
| `--no-open` | Start the viewer server but do not open the browser |
| `--port <n>` | Preferred port for the local viewer (default 4323; auto-increments if busy) |
| `--help`, `-h` | Show help |

### JSON mode

`--json` emits a single JSON document with the full graph — nodes (with type, LOC, imports, exports, in/out degree), edges, and metrics (critical modules, circular dependency cycles, file type distribution, workspace info). Ideal for CI pipelines, scripts, or piping into other tools.

## What it understands

- **Languages:** TypeScript, JavaScript, TSX/JSX, plus first-class support for Vue, Svelte, and Astro project structures
- **Import resolution:** relative paths, `@/` and `~/` aliases, `tsconfig.json` `paths` (via `get-tsconfig`), `index.*` files, extensionless and suffix-loader imports (`?url`, `?raw`)
- **Node classification:** entry points (`page.tsx`, `route.ts`, `layout.tsx`, `main.tsx`, …), components, types, utilities, config, and generic modules
- **Monorepos:** npm / pnpm / yarn / lerna workspaces — detects packages and annotates which package every file belongs to
- **Impact analysis:** for every file, computes direct dependents, transitive dependents, and a weighted impact score with risk levels (low / moderate / critical)

## Requirements

- Node.js >= 18

## Why

Most dependency-graph tools need a plugin, an IDE, or a signup. Traceon is a single command that works in any project in seconds — useful before a refactor ("what breaks if I change this file?"), during code review, or when you just want to finally see the shape of a codebase.

Part of the [Traceon](https://github.com/rishabhx29/Traceon) project — a web app for repository analysis, profile DNA checks, and squad matching. The CLI shares the same analysis core, runs fully offline.

## License

MIT
