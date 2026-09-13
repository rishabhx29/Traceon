<div align="center">

<img src="public/logo.png" alt="Traceon" width="120" />

# Traceon

[![npm version](https://img.shields.io/npm/v/traceon-analyzer?style=flat-square&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/traceon-analyzer)
[![npm downloads](https://img.shields.io/npm/dt/traceon-analyzer?style=flat-square&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/traceon-analyzer)
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/rishabhx29/Traceon?utm_source=oss&utm_medium=github&utm_campaign=rishabhx29%2FTraceon&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

**Two powerful lenses. One unified platform.**

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=flat-square&logo=react&logoColor=white)](https://reactflow.dev/)
[![Groq](https://img.shields.io/badge/Groq_Llama_3.3-F54E00?style=flat-square&logo=meta&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Features](#features) · [CLI](#traceon-cli) · [Getting Started](#getting-started) · [Architecture](#architecture) · [API Reference](#api-reference) · [Roadmap](#roadmap)

[Live Demo](https://traceon.vercel.app) · [npm Package](https://www.npmjs.com/package/traceon-analyzer) · [Report Bug](https://github.com/rishabhx29/Traceon/issues) · [Request Feature](https://github.com/rishabhx29/Traceon/issues)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the setup guide and contribution guidelines.

</div>

## About

You just joined a team, inherited a monorepo, or found an open-source project you want to contribute to. Step one is always the same: figure out what depends on what, which files are load-bearing, and whether the person who wrote it actually knows what they're doing. That usually takes days of reading code. Traceon does it in seconds.

It is a unified analysis platform that maps any codebase into an interactive dependency graph and decodes any GitHub developer's engineering capability through LLM-powered analysis — built for open-source contributors navigating unfamiliar repositories, developers onboarding onto new teams, engineering leads evaluating architecture health, and hiring managers who need signal beyond résumés and star counts.

It ships in two forms, sharing the same analysis core:

| | Traceon Web | Traceon CLI |
|---|---|---|
| **Install** | Hosted / self-hosted Next.js app | `npx traceon-analyzer` — nothing to install |
| **Input** | GitHub URL or ZIP upload | Any local directory |
| **Requires** | MongoDB, API keys (for full features) | Node.js ≥ 18 only |
| **Best for** | Persistent dashboards, history, Profile DNA, AI chat | One-shot local analysis, CI pipelines, offline use |
| **Privacy** | Code is cloned and parsed server-side | Code never leaves your machine |

### The three tools

**Repository Analyzer (web)** — Paste any GitHub URL (or upload a ZIP). Traceon clones the repository, spawns worker threads to parse every source file into an Abstract Syntax Tree via the TypeScript Compiler API, constructs a full dependency graph, and renders it as an interactive force-directed visualization in your browser. Select any node to see its impact score (0–100), blast radius, and circular dependency chains. Compare architectural snapshots across commit history with visual red/green diffs. Export the graph as PNG, SVG, PDF, or a standalone HTML viewer you can drop into a wiki.

**Traceon CLI — analyze any local codebase in seconds** — No signup, no database, no server required. Run one command inside any project:

```bash
npx traceon-analyzer
```

It scans your project, parses every source file into an AST, builds the dependency graph, and prints a metrics report — then launches a local interactive graph viewer in your browser. Everything runs 100% locally; your code never leaves your machine. Full usage in the [CLI section](#traceon-cli) below.

**Profile DNA Checker** — Enter any GitHub username. Traceon fetches their public repositories, language byte distributions, recent commits, and README samples — then feeds the raw telemetry into Groq's Llama 3.3 70B model with a rigorous staff-engineer rubric. The result is a multi-dimensional "Engineering DNA" dashboard: six scored axes (Reliability, Security, Maintainability, Uniqueness, Influence, Contribution), an archetype classification, a domain radar chart, a code quality report with strengths and weaknesses, and a Squad Matcher that lets you paste your team's required tech stack to get an instant compatibility percentage.

<div align="center">
  <img src="public/graph-demo.png" alt="Traceon — Interactive dependency graph with impact analysis" width="90%" />
  <br />
  <sub>Repository Analyzer — interactive dependency graph with impact analysis panel</sub>
</div>

---

## Traceon CLI

The fastest way to use Traceon — one command, zero install, zero config:

```bash
npx traceon-analyzer
```

Point it at any project directory. It analyzes the codebase locally (same scanner → parser → graph → impact core as the web app), prints a metrics report to your terminal, and opens an interactive graph viewer in your browser. **Your code never leaves your machine** — analysis runs entirely in local Node.js processes, and the viewer binds to `127.0.0.1` only.

### Usage

```bash
npx traceon-analyzer                       # analyze current directory + open viewer
npx traceon-analyzer ./packages/api        # analyze a subdirectory
npx traceon-analyzer --json > report.json  # machine-readable output for CI
npx traceon-analyzer --no-open --port 5000 # custom port, no auto browser open
npx traceon-analyzer --help                # all options
```

### Options

| Flag | Description |
|------|-------------|
| `path` | Directory to analyze (default: current directory) |
| `--json` | Print machine-readable JSON report to stdout and exit (no viewer) |
| `--no-open` | Start the viewer server but don't open the browser |
| `--port <n>` | Preferred port for the local viewer (default `4323`; auto-increments if busy) |
| `--help`, `-h` | Show help |

### What you get

**Terminal report** — file counts, dependency density, file type distribution, critical modules (most depended-upon files), and circular dependency chains — in under a second for small projects, seconds for large monorepos.

**Interactive viewer** (`http://localhost:4323`) — a local-only web app with:

- Force-directed dependency graph (React Flow, dark theme) with nodes color-coded by type
- Click any file to see its **impact score (0–100)**, risk level, and blast radius — every direct and transitive dependent lights up
- Search to filter files by name or path
- Circular dependency detection
- Workspace / monorepo package boundaries

### JSON mode (CI-friendly)

`--json` emits a single JSON document with the full graph — nodes (type, LOC, imports, exports, in/out degree), edges, and metrics (critical modules, circular cycles, file type distribution, workspace info). Ideal for CI pipelines and scripts:

```bash
npx traceon-analyzer --json > report.json
```

### Requirements & install

- Node.js ≥ 18
- Published as [`traceon-analyzer`](https://www.npmjs.com/package/traceon-analyzer) on npm — `npx` works with no install; `npm i -D traceon-analyzer` works for pinned CI usage

> [!TIP]
> The CLI lives in [`packages/traceon`](./packages/traceon) and is built with esbuild into a single bundled file — no transitive runtime deps for consumers. To build it from this repo: `npm run build:cli` at the root.

---

## Features

### Repository Analyzer

- **AST-powered analysis** — Uses the TypeScript Compiler API for proper AST parsing, not regex or string matching.
- **Interactive dependency graph** — Force-directed graph with zoom, pan, search, and filter via React Flow. Nodes are color-coded by type.
- **Impact analysis engine** — Select any file to see its impact score (0–100), risk level, direct/transitive dependents, and visual blast radius.
- **Circular dependency detection** — Automatically flags `A → B → C → A` loops that cause build issues.
- **Time Travel & Architectural Diffs** — View the graph at different commit hashes with visual red/green edge diffs.
- **Monorepo / Workspace Support** — Visualizes cross-package dependencies for Turborepo, Nx, and Lerna projects.
- **Traceon AI (Codebase Chat)** — Chat with your codebase architecture, ask about component relationships, and auto-generate architecture summaries.
- **High-Resolution & HTML Exports** — Export your graph as PNG, SVG, PDF, or a standalone interactive HTML viewer.
- **Multiple ingestion methods** — Paste a GitHub URL or upload a ZIP archive.
- **Dashboard & metrics** — Track analyzed repositories, file counts, dependency density, critical modules, and architectural heatmaps.

### Profile DNA Checker

- **Engineering DNA analysis** — Enter any GitHub username to decode true engineering capability from public commits — not self-reported skills.
- **LLM-powered assessment** — Raw GitHub telemetry is fed into Groq's Llama 3.3 70B model, which evaluates code against a rigorous staff-engineer rubric.
- **6-axis scoring radar** — Scores across Reliability, Security, Maintainability, Uniqueness, Influence, and Contribution (each 0–100), each with a one-sentence explanation.
- **Archetype classification** — Assigns a developer archetype (e.g., "Fullstack Architect", "Frontend Visionary", "Systems Engineer").
- **Domain DNA Map** — Visualizes capabilities across Frontend, Backend, DevOps, Data Science, and Security as an interactive radar chart.
- **Tech Stack Volumes** — Analyzes exact byte counts across languages for true proficiency signal instead of language listing.
- **Code Quality Report** — Detailed strengths/weaknesses and an Engineering DNA breakdown: Problem Solving, Architecture Maturity, and Documentation quality.
- **Squad Matcher** — Paste your team's required tech stack to get a % compatibility score showing verified capabilities and missing skills.
- **Commit Hygiene evaluation** — Inspects recent commit message quality and README clarity.
- **24-hour result caching** — Analysis results are cached in MongoDB, so repeat lookups on the same username are instant.
- **Trending profiles marquee** — Quick-launch analysis on prominent open-source developers.

### Traceon CLI

- **Zero-install usage** — `npx traceon-analyzer` works with nothing but Node.js ≥ 18.
- **100% local & offline** — analysis runs entirely on your machine; the viewer binds to `127.0.0.1` only.
- **Terminal metrics report** — file type distribution, critical modules, and circular dependency chains printed as ASCII charts.
- **Interactive local viewer** — same React Flow graph experience, served from a single bundled CLI file.
- **JSON export for CI** — `--json` emits the full graph for pipelines and scripts.
- **Monorepo-aware** — detects npm/pnpm/yarn workspaces and annotates package boundaries.

### Platform

- **Authentication** — Email/password, GitHub OAuth, Google OAuth, JWT sessions, and guest mode.
- **User profile settings** — Manage account details in the dedicated `/profile` settings page.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **MongoDB Atlas** cluster (free tier works)
- **Groq API Key** — free at [console.groq.com](https://console.groq.com) (required for Profile DNA)
- **Git** installed locally

### Setup

```bash
git clone https://github.com/rishabhx29/Traceon.git
cd Traceon
npm install
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/traceon

# NextAuth
NEXTAUTH_SECRET=your_random_secret_minimum_32_chars
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Groq (for Profile DNA analysis)
GROQ_API_KEY=your_groq_api_key

# GitHub Token (optional — raises API rate limits for Profile DNA and Repo cloning)
GITHUB_TOKEN=your_github_personal_access_token
```

> [!TIP]
> Generate a secure NextAuth secret with `openssl rand -base64 32`

> [!NOTE]
> `GITHUB_TOKEN` is optional but strongly recommended for production. Without it, GitHub's public API rate limit (60 req/hr) can block profile lookups for busy deployments.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (React)                          │
│  Landing Page → Analyzer UI → Graph Viewer → Profile DNA        │
├─────────────────────────────────────────────────────────────────┤
│                      Next.js App Router                         │
│  Server Components │ API Routes │ Server Actions                │
├──────────────────────────────┬──────────────────────────────────┤
│      Repository Pipeline     │       Profile DNA Pipeline       │
│  Clone → Scan → Parse (WT)   │  GitHub Fetch → LLM Analysis     │
│  → Build Graph               │  → Cache → DNA Dashboard         │
├──────────────────────────────┴──────────────────────────────────┤
│                           Data Layer                            │
│  MongoDB Atlas │ Mongoose ODM │ Connection Pooling              │
└─────────────────────────────────────────────────────────────────┘
```

### Repository Analysis pipeline

1. **Clone** — `simple-git` clones the repo to a temp directory.
2. **Scan** — Walks the file tree, filters source files, ignores `node_modules`.
3. **Parse** — Spawns worker threads for parallel AST parsing via the TypeScript Compiler API. Extracts imports, exports, functions, classes, and LOC.
4. **Build graph** — Resolves import paths into nodes + edges. Calculates dependency density, in/out degree, and critical modules. Detects circular dependencies via DFS.
5. **Visualize** — Renders with React Flow using Dagre layout, custom color-coded nodes, animated edges, and interactive inspection panels.

### Profile DNA pipeline

1. **GitHub Fetch** — Hits the GitHub REST API to collect repositories, language byte counts, recent commits, and README snippets.
2. **LLM Execution** — Sends a structured payload to Groq's `llama-3.3-70b-versatile` model with a detailed staff-engineer rubric prompt.
3. **Schema validation** — Parses and validates the JSON response against a strict Zod schema before persisting.
4. **Cache & serve** — Saves the result to MongoDB. Subsequent requests within 24 hours are served from cache instantly.

### Impact scoring

The impact engine uses reverse BFS traversal to quantify how much damage a change to any file could cause:

| Risk Level | Score  | Meaning                                 |
|------------|--------|-----------------------------------------|
| Critical   | 60–100 | Changing this file breaks many things   |
| Moderate   | 30–59  | Proceed with caution                    |
| Low        | 0–29   | Safe to modify                          |

---

## Tech Stack

| Layer      | Technology                     | Why                                              |
|------------|--------------------------------|--------------------------------------------------|
| Framework  | Next.js 16 (App Router)        | Server Components, API routes, streaming         |
| Language   | TypeScript 5                   | Type safety across the full stack                |
| Styling    | Tailwind CSS v4                | CSS-first config, custom design tokens           |
| Graph      | React Flow (@xyflow/react)     | Best-in-class graph rendering                    |
| Layout     | Dagre                          | Hierarchical graph layout algorithm              |
| Database   | MongoDB Atlas + Mongoose       | Flexible document model for graph & profile data |
| Auth       | NextAuth.js                    | GitHub, Google, Credentials providers            |
| Parsing    | TypeScript Compiler API        | Production-grade AST parsing                     |
| Cloning    | simple-git                     | Lightweight Git operations                       |
| LLM        | Groq Llama 3.3 70B (via Vercel AI SDK) | Fast, structured Profile DNA generation |
| Animation  | Framer Motion                  | Physics-based UI animations                      |
| Icons      | Lucide React                   | Clean, consistent icon set                       |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages & API routes
│   ├── page.tsx                  # Landing page
│   ├── analyze/                  # Repository analysis progress UI
│   ├── dashboard/                # User dashboard (protected)
│   ├── graph/[repoId]/           # Interactive graph viewer
│   ├── profile/                  # Profile settings (/profile) & DNA viewer (/profile/[username])
│   ├── profile-analytics/        # Profile analytics page
│   └── api/                      # REST endpoints
│       ├── analyze/              # Repository analysis routes
│       ├── profile/[username]/   # Profile DNA API
│       └── ...
│
├── components/
│   ├── graph/                    # Graph visualization (CustomNode, ImpactPanel, etc.)
│   ├── home/                     # Landing page sections (incl. InteractiveShowcase)
│   ├── profile/                  # All Profile DNA components
│   │   ├── ProfileLandingHero    # Username search entry point
│   │   ├── ProfileDashboardView  # Tabbed dashboard (Overview, Squad, Skills, …)
│   │   ├── DomainExpertise       # 6-axis radar / score cards
│   │   ├── SkillsGrid            # AI-extracted skills by domain
│   │   ├── TechStack             # Language breakdown with byte volumes
│   │   ├── EngineeringDNA        # Problem solving / architecture / docs narrative
│   │   ├── CodeQualityReport     # Strengths & weaknesses traits
│   │   ├── SquadMatcher          # Stack compatibility checker
│   │   └── RepositoriesList      # Top repositories browser
│   ├── dashboard/                # Dashboard widgets
│   └── layout/                   # Navbar, Footer, ErrorBoundary
│
├── lib/
│   ├── analyzer/                 # Clone, scan, parse, pipeline orchestration
│   │   └── graph/                # Graph builder + impact scoring
│   ├── profile/                  # Profile DNA logic
│   │   ├── githubFetcher.ts      # GitHub API data aggregation
│   │   ├── analyzer.ts           # Groq LLM prompt + Zod validation
│   │   └── service.ts            # Cache-aware orchestration service
│   ├── auth.ts                   # NextAuth configuration
│   └── db/                       # MongoDB connection + Mongoose models
│
└── workers/
    └── parse-worker.js           # Worker thread for CPU-intensive AST parsing

packages/
└── traceon/                      # Standalone CLI (npx traceon-analyzer)
    ├── src/cli/                  # CLI entry, arg parsing, terminal report
    ├── src/analyzer/             # Local analyzer core (scan → parse → graph → impact)
    ├── src/server/               # Local-only viewer server (port 4323)
    ├── src/viewer/               # Bundled React Flow viewer UI
    └── build.mjs                 # esbuild bundling (single-file CLI + embedded viewer)
```

---

## API Reference

### Repository Analysis

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/analyze` | Optional | Start repository analysis |
| `POST` | `/api/analyze/upload` | Optional | Upload ZIP for analysis |
| `GET`  | `/api/graph/:repoId` | Session | Fetch graph data |
| `GET`  | `/api/impact/:repoId` | Session | Fetch impact analysis |
| `GET`  | `/api/dashboard` | Required | User dashboard data |
| `GET`  | `/api/repository/:id` | Session | Repository status |

### Profile DNA

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/profile/:username` | Public | Run or retrieve cached DNA analysis |

### Auth & User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | Public | User registration |
| `GET`  | `/api/user/profile` | Required | Get user profile |
| `PUT`  | `/api/user/profile` | Required | Update user profile |

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Add all environment variables from `.env.example` (plus `GROQ_API_KEY` and optionally `GITHUB_TOKEN`) in project settings.
4. Deploy — Vercel auto-detects Next.js.

> [!IMPORTANT]
> Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access for Vercel's dynamic egress IPs.

> [!NOTE]
> Worker threads used by the repository parser are fully compatible with Vercel's Node.js runtime. No extra configuration is required.

---

## Roadmap

- [x] Repository cloning & file scanning
- [x] TypeScript AST parsing with Worker Threads
- [x] Dependency graph construction & rendering
- [x] Impact analysis engine
- [x] User dashboard with metrics
- [x] GitHub & Google OAuth
- [x] ZIP upload support
- [x] Circular dependency detection
- [x] Traceon AI (Codebase chat & refactoring suggestions)
- [x] Time-travel architectural commit history & diffs
- [x] Monorepo & workspace graph visualization
- [x] Export graph as PNG/SVG/PDF and Interactive HTML
- [x] **Profile DNA Checker** — LLM-powered engineering analysis from public GitHub data
- [x] **Squad Matcher** — Stack compatibility scoring for hiring & team-building
- [x] **Traceon CLI** — `npx traceon-analyzer` analyzes any local codebase offline with an interactive viewer
- [ ] VS Code extension
- [ ] Multi-language support (Python, Go, Rust)
- [ ] Team collaboration features

---

<div align="center">

**Built by [Rishabh](https://github.com/rishabhx29)**

*Traceon — Because understanding code, and the people who write it, shouldn't require reading all of it.*

</div>
