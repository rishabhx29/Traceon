// src/lib/profile/manifestClassifier.ts
// Dependency Manifest & Ecosystem Classifier
import type { DomainSkill } from './types';

export interface TaxonomyEntry {
  canonicalName: string;
  domain: string;
}

/**
 * Parses package.json content safely and extracts dependencies and devDependencies keys.
 */
export function parsePackageJson(content: string): string[] {
  if (!content || typeof content !== 'string') return [];
  try {
    const parsed = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return [];

    const deps = new Set<string>();
    const depKeys = [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
    ];

    for (const key of depKeys) {
      const section = parsed[key];
      if (section && typeof section === 'object' && !Array.isArray(section)) {
        for (const pkg of Object.keys(section)) {
          if (typeof pkg === 'string' && pkg.trim()) {
            deps.add(pkg.trim());
          }
        }
      }
    }

    return Array.from(deps);
  } catch {
    return [];
  }
}

/**
 * Parses Python requirements.txt safely, stripping version pins, comments, options, and extras.
 */
export function parseRequirementsTxt(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const deps = new Set<string>();
  const lines = content.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Handle egg fragments in git/vcs URLs, e.g. git+https://...#egg=black
    const eggMatch = line.match(/#egg=([a-zA-Z0-9_\-.]+)/i);
    if (eggMatch && eggMatch[1]) {
      deps.add(eggMatch[1].toLowerCase());
      continue;
    }

    // Strip inline comments
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }
    if (!line) continue;

    // Ignore options and flags (-r, -i, --extra-index-url, -f, etc.)
    if (line.startsWith('-')) continue;

    // Strip environment markers (e.g. ; python_version >= '3.8')
    const semiIdx = line.indexOf(';');
    if (semiIdx !== -1) {
      line = line.substring(0, semiIdx).trim();
    }
    if (!line) continue;

    // Strip direct URL references (e.g. pkg @ https://...)
    const atIdx = line.indexOf('@');
    if (atIdx !== -1) {
      line = line.substring(0, atIdx).trim();
    }
    if (!line) continue;

    // Strip version specifiers (==, >=, <=, ~=, !=, ===, <, >, ~)
    const namePart = line.split(/[=<>!~]/)[0].trim();

    // Strip extras, e.g. celery[redis,auth] -> celery
    const cleanName = namePart.replace(/\[.*?\]/g, '').trim();

    // Validate standard Python package identifier
    if (/^[a-zA-Z0-9_\-.]+$/.test(cleanName)) {
      deps.add(cleanName.toLowerCase());
    }
  }

  return Array.from(deps);
}

/**
 * Extracts module name from a Go module path.
 * Strips version suffixes like /v2, /v3.
 */
function extractGoModuleName(rawPath: string): string | null {
  const cleaned = rawPath.replace(/["']/g, '').trim();
  if (!cleaned) return null;
  const segments = cleaned.split('/');
  let last = segments[segments.length - 1];
  if (/^v\d+$/i.test(last) && segments.length > 1) {
    last = segments[segments.length - 2];
  }
  return last || cleaned;
}

/**
 * Parses go.mod safely, extracting module paths from single and multiline require blocks.
 */
export function parseGoMod(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const deps = new Set<string>();
  const lines = content.split(/\r?\n/);
  let inRequireBlock = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Strip comments
    const commentIdx = line.indexOf('//');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }
    if (!line) continue;

    // Multiline require block start
    if (/^require\s*\(/i.test(line)) {
      inRequireBlock = true;
      continue;
    }

    if (inRequireBlock) {
      if (line.startsWith(')')) {
        inRequireBlock = false;
        continue;
      }
      const tokens = line.split(/\s+/);
      if (tokens.length > 0 && tokens[0]) {
        const rawMod = tokens[0].replace(/['"]/g, '').trim();
        if (rawMod) {
          const shortMod = extractGoModuleName(rawMod);
          deps.add(shortMod || rawMod);
        }
      }
      continue;
    }

    // Single-line require
    const singleMatch = line.match(/^require\s+([^\s(]+)/i);
    if (singleMatch && singleMatch[1]) {
      const rawMod = singleMatch[1].replace(/['"]/g, '').trim();
      if (rawMod) {
        const shortMod = extractGoModuleName(rawMod);
        deps.add(shortMod || rawMod);
      }
    }
  }

  return Array.from(deps);
}

/**
 * Parses Cargo.toml safely, extracting crate names under [dependencies], [dev-dependencies], [build-dependencies].
 */
export function parseCargoToml(content: string): string[] {
  if (!content || typeof content !== 'string') return [];

  const deps = new Set<string>();
  const lines = content.split(/\r?\n/);
  let inDepsSection = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Strip comments
    if (line.startsWith('#')) continue;
    const commentIdx = line.indexOf('#');
    if (commentIdx !== -1) {
      line = line.substring(0, commentIdx).trim();
    }
    if (!line) continue;

    // Match TOML section headers: [dependencies], [target.*.dependencies], [dependencies.tokio], etc.
    const sectionMatch = line.match(/^\[\s*([a-zA-Z0-9_\-.'"\s]+)\s*\]/);
    if (sectionMatch) {
      const sec = sectionMatch[1].toLowerCase().replace(/['"]/g, '').trim();

      // Check table-header dependency (e.g. [dependencies.tokio] or [dev-dependencies.serde])
      const tableMatch = sec.match(/^(?:workspace\.|target\.[^.]+\.)?(dependencies|dev-dependencies|build-dependencies)\.([a-zA-Z0-9_\-]+)$/i);
      if (tableMatch && tableMatch[2]) {
        deps.add(tableMatch[2]);
        inDepsSection = false;
        continue;
      }

      inDepsSection = (
        sec === 'dependencies' ||
        sec === 'dev-dependencies' ||
        sec === 'build-dependencies' ||
        sec === 'workspace.dependencies' ||
        sec.endsWith('.dependencies') ||
        sec.endsWith('.dev-dependencies') ||
        sec.endsWith('.build-dependencies')
      );
      continue;
    }

    if (inDepsSection) {
      // Matches: crate_name = ... or crate-name = ... or crate.workspace = ...
      const keyMatch = line.match(/^([a-zA-Z0-9_\-]+)(?:\.[a-zA-Z0-9_\-]+)?\s*=/);
      if (keyMatch && keyMatch[1]) {
        deps.add(keyMatch[1]);
      }
    }
  }

  return Array.from(deps);
}

/**
 * Dispatches to the appropriate parser based on manifest filename.
 */
export function extractDependenciesFromManifest(filename: string, content: string): string[] {
  if (!filename || !content) return [];

  const lower = filename.toLowerCase();
  const base = lower.split(/[/\\]/).pop() || '';

  if (base === 'package.json') {
    return parsePackageJson(content);
  }
  if (base === 'requirements.txt' || (lower.endsWith('.txt') && lower.includes('requirement'))) {
    return parseRequirementsTxt(content);
  }
  if (base === 'go.mod') {
    return parseGoMod(content);
  }
  if (base === 'cargo.toml') {
    return parseCargoToml(content);
  }

  return [];
}

// ─── TAXONOMY DICTIONARY (200+ Packages across 8 Technical Domains) ───

export const PACKAGE_TAXONOMY: Record<string, TaxonomyEntry> = {
  // ─── Frontend & UI ───
  'react': { canonicalName: 'React', domain: 'Frontend & UI' },
  'react-dom': { canonicalName: 'React', domain: 'Frontend & UI' },
  'next': { canonicalName: 'Next.js', domain: 'Frontend & UI' },
  'vue': { canonicalName: 'Vue.js', domain: 'Frontend & UI' },
  'vuex': { canonicalName: 'Vuex', domain: 'Frontend & UI' },
  'pinia': { canonicalName: 'Pinia', domain: 'Frontend & UI' },
  'nuxt': { canonicalName: 'Nuxt.js', domain: 'Frontend & UI' },
  'svelte': { canonicalName: 'Svelte', domain: 'Frontend & UI' },
  '@sveltejs/kit': { canonicalName: 'SvelteKit', domain: 'Frontend & UI' },
  '@angular/core': { canonicalName: 'Angular', domain: 'Frontend & UI' },
  '@angular/common': { canonicalName: 'Angular', domain: 'Frontend & UI' },
  'angular': { canonicalName: 'Angular', domain: 'Frontend & UI' },
  'solid-js': { canonicalName: 'SolidJS', domain: 'Frontend & UI' },
  'preact': { canonicalName: 'Preact', domain: 'Frontend & UI' },
  'astro': { canonicalName: 'Astro', domain: 'Frontend & UI' },
  'gatsby': { canonicalName: 'Gatsby', domain: 'Frontend & UI' },
  'remix': { canonicalName: 'Remix', domain: 'Frontend & UI' },
  '@remix-run/react': { canonicalName: 'Remix', domain: 'Frontend & UI' },
  '@remix-run/node': { canonicalName: 'Remix', domain: 'Frontend & UI' },
  'tailwindcss': { canonicalName: 'Tailwind CSS', domain: 'Frontend & UI' },
  '@tailwindcss/postcss': { canonicalName: 'Tailwind CSS', domain: 'Frontend & UI' },
  'framer-motion': { canonicalName: 'Framer Motion', domain: 'Frontend & UI' },
  'redux': { canonicalName: 'Redux', domain: 'Frontend & UI' },
  '@reduxjs/toolkit': { canonicalName: 'Redux', domain: 'Frontend & UI' },
  'react-redux': { canonicalName: 'Redux', domain: 'Frontend & UI' },
  'zustand': { canonicalName: 'Zustand', domain: 'Frontend & UI' },
  '@tanstack/react-query': { canonicalName: 'TanStack Query', domain: 'Frontend & UI' },
  'react-query': { canonicalName: 'TanStack Query', domain: 'Frontend & UI' },
  '@tanstack/react-table': { canonicalName: 'TanStack Table', domain: 'Frontend & UI' },
  '@mui/material': { canonicalName: 'Material UI', domain: 'Frontend & UI' },
  '@material-ui/core': { canonicalName: 'Material UI', domain: 'Frontend & UI' },
  '@chakra-ui/react': { canonicalName: 'Chakra UI', domain: 'Frontend & UI' },
  'antd': { canonicalName: 'Ant Design', domain: 'Frontend & UI' },
  '@mantine/core': { canonicalName: 'Mantine', domain: 'Frontend & UI' },
  '@headlessui/react': { canonicalName: 'Headless UI', domain: 'Frontend & UI' },
  'styled-components': { canonicalName: 'Styled Components', domain: 'Frontend & UI' },
  '@emotion/react': { canonicalName: 'Emotion', domain: 'Frontend & UI' },
  '@emotion/styled': { canonicalName: 'Emotion', domain: 'Frontend & UI' },
  'sass': { canonicalName: 'Sass', domain: 'Frontend & UI' },
  'node-sass': { canonicalName: 'Sass', domain: 'Frontend & UI' },
  'less': { canonicalName: 'Less', domain: 'Frontend & UI' },
  'postcss': { canonicalName: 'PostCSS', domain: 'Frontend & UI' },
  'bootstrap': { canonicalName: 'Bootstrap', domain: 'Frontend & UI' },
  'lucide-react': { canonicalName: 'Lucide Icons', domain: 'Frontend & UI' },
  'lucide-vue-next': { canonicalName: 'Lucide Icons', domain: 'Frontend & UI' },
  'react-icons': { canonicalName: 'React Icons', domain: 'Frontend & UI' },
  'reactflow': { canonicalName: 'React Flow', domain: 'Frontend & UI' },
  '@xyflow/react': { canonicalName: 'React Flow', domain: 'Frontend & UI' },
  'recharts': { canonicalName: 'Recharts', domain: 'Frontend & UI' },
  'chart.js': { canonicalName: 'Chart.js', domain: 'Frontend & UI' },
  'react-chartjs-2': { canonicalName: 'Chart.js', domain: 'Frontend & UI' },
  'd3': { canonicalName: 'D3.js', domain: 'Frontend & UI' },
  'three': { canonicalName: 'Three.js', domain: 'Frontend & UI' },
  '@react-three/fiber': { canonicalName: 'Three.js', domain: 'Frontend & UI' },
  'swr': { canonicalName: 'SWR', domain: 'Frontend & UI' },
  'recoil': { canonicalName: 'Recoil', domain: 'Frontend & UI' },
  'jotai': { canonicalName: 'Jotai', domain: 'Frontend & UI' },
  'mobx': { canonicalName: 'MobX', domain: 'Frontend & UI' },
  'xstate': { canonicalName: 'XState', domain: 'Frontend & UI' },
  'react-hook-form': { canonicalName: 'React Hook Form', domain: 'Frontend & UI' },
  'formik': { canonicalName: 'Formik', domain: 'Frontend & UI' },
  'gsap': { canonicalName: 'GSAP', domain: 'Frontend & UI' },
  'animejs': { canonicalName: 'Anime.js', domain: 'Frontend & UI' },
  'lottie-web': { canonicalName: 'Lottie', domain: 'Frontend & UI' },
  'react-router': { canonicalName: 'React Router', domain: 'Frontend & UI' },
  'react-router-dom': { canonicalName: 'React Router', domain: 'Frontend & UI' },
  'react-native': { canonicalName: 'React Native', domain: 'Frontend & UI' },
  'expo': { canonicalName: 'Expo', domain: 'Frontend & UI' },
  'tauri': { canonicalName: 'Tauri', domain: 'Frontend & UI' },
  'electron': { canonicalName: 'Electron', domain: 'Frontend & UI' },

  // ─── Backend & APIs ───
  'express': { canonicalName: 'Express', domain: 'Backend & APIs' },
  '@nestjs/core': { canonicalName: 'NestJS', domain: 'Backend & APIs' },
  '@nestjs/common': { canonicalName: 'NestJS', domain: 'Backend & APIs' },
  'fastify': { canonicalName: 'Fastify', domain: 'Backend & APIs' },
  'hono': { canonicalName: 'Hono', domain: 'Backend & APIs' },
  'koa': { canonicalName: 'Koa', domain: 'Backend & APIs' },
  'hapi': { canonicalName: 'Hapi', domain: 'Backend & APIs' },
  '@hapi/hapi': { canonicalName: 'Hapi', domain: 'Backend & APIs' },
  'graphql': { canonicalName: 'GraphQL', domain: 'Backend & APIs' },
  '@apollo/server': { canonicalName: 'Apollo Server', domain: 'Backend & APIs' },
  'apollo-server': { canonicalName: 'Apollo Server', domain: 'Backend & APIs' },
  '@trpc/server': { canonicalName: 'tRPC', domain: 'Backend & APIs' },
  '@trpc/client': { canonicalName: 'tRPC', domain: 'Backend & APIs' },
  'socket.io': { canonicalName: 'Socket.io', domain: 'Backend & APIs' },
  'ws': { canonicalName: 'WebSockets (ws)', domain: 'Backend & APIs' },
  'grpc': { canonicalName: 'gRPC', domain: 'Backend & APIs' },
  '@grpc/grpc-js': { canonicalName: 'gRPC', domain: 'Backend & APIs' },
  'django': { canonicalName: 'Django', domain: 'Backend & APIs' },
  'djangorestframework': { canonicalName: 'Django REST Framework', domain: 'Backend & APIs' },
  'fastapi': { canonicalName: 'FastAPI', domain: 'Backend & APIs' },
  'flask': { canonicalName: 'Flask', domain: 'Backend & APIs' },
  'tornado': { canonicalName: 'Tornado', domain: 'Backend & APIs' },
  'aiohttp': { canonicalName: 'aiohttp', domain: 'Backend & APIs' },
  'starlette': { canonicalName: 'Starlette', domain: 'Backend & APIs' },
  'sanic': { canonicalName: 'Sanic', domain: 'Backend & APIs' },
  'gunicorn': { canonicalName: 'Gunicorn', domain: 'Backend & APIs' },
  'uvicorn': { canonicalName: 'Uvicorn', domain: 'Backend & APIs' },
  'celery': { canonicalName: 'Celery', domain: 'Backend & APIs' },
  'gin': { canonicalName: 'Gin', domain: 'Backend & APIs' },
  'github.com/gin-gonic/gin': { canonicalName: 'Gin', domain: 'Backend & APIs' },
  'fiber': { canonicalName: 'Fiber', domain: 'Backend & APIs' },
  'github.com/gofiber/fiber': { canonicalName: 'Fiber', domain: 'Backend & APIs' },
  'github.com/gofiber/fiber/v2': { canonicalName: 'Fiber', domain: 'Backend & APIs' },
  'echo': { canonicalName: 'Echo', domain: 'Backend & APIs' },
  'github.com/labstack/echo': { canonicalName: 'Echo', domain: 'Backend & APIs' },
  'github.com/labstack/echo/v4': { canonicalName: 'Echo', domain: 'Backend & APIs' },
  'chi': { canonicalName: 'Chi', domain: 'Backend & APIs' },
  'github.com/go-chi/chi': { canonicalName: 'Chi', domain: 'Backend & APIs' },
  'github.com/go-chi/chi/v5': { canonicalName: 'Chi', domain: 'Backend & APIs' },
  'mux': { canonicalName: 'Gorilla Mux', domain: 'Backend & APIs' },
  'github.com/gorilla/mux': { canonicalName: 'Gorilla Mux', domain: 'Backend & APIs' },
  'actix-web': { canonicalName: 'Actix Web', domain: 'Backend & APIs' },
  'axum': { canonicalName: 'Axum', domain: 'Backend & APIs' },
  'rocket': { canonicalName: 'Rocket', domain: 'Backend & APIs' },
  'warp': { canonicalName: 'Warp', domain: 'Backend & APIs' },
  'tower': { canonicalName: 'Tower', domain: 'Backend & APIs' },
  'tonic': { canonicalName: 'Tonic (gRPC)', domain: 'Backend & APIs' },

  // ─── Databases & Storage ───
  'pg': { canonicalName: 'PostgreSQL (pg)', domain: 'Databases & Storage' },
  'mysql': { canonicalName: 'MySQL', domain: 'Databases & Storage' },
  'mysql2': { canonicalName: 'MySQL', domain: 'Databases & Storage' },
  'mongodb': { canonicalName: 'MongoDB', domain: 'Databases & Storage' },
  'mongoose': { canonicalName: 'Mongoose', domain: 'Databases & Storage' },
  'redis': { canonicalName: 'Redis', domain: 'Databases & Storage' },
  'ioredis': { canonicalName: 'ioredis', domain: 'Databases & Storage' },
  '@prisma/client': { canonicalName: 'Prisma', domain: 'Databases & Storage' },
  'prisma': { canonicalName: 'Prisma', domain: 'Databases & Storage' },
  'drizzle-orm': { canonicalName: 'Drizzle ORM', domain: 'Databases & Storage' },
  'drizzle-kit': { canonicalName: 'Drizzle ORM', domain: 'Databases & Storage' },
  'typeorm': { canonicalName: 'TypeORM', domain: 'Databases & Storage' },
  'sqlite3': { canonicalName: 'SQLite', domain: 'Databases & Storage' },
  'better-sqlite3': { canonicalName: 'SQLite', domain: 'Databases & Storage' },
  '@supabase/supabase-js': { canonicalName: 'Supabase', domain: 'Databases & Storage' },
  'supabase': { canonicalName: 'Supabase', domain: 'Databases & Storage' },
  'knex': { canonicalName: 'Knex.js', domain: 'Databases & Storage' },
  'sequelize': { canonicalName: 'Sequelize', domain: 'Databases & Storage' },
  '@upstash/redis': { canonicalName: 'Upstash Redis', domain: 'Databases & Storage' },
  'firebase': { canonicalName: 'Firebase', domain: 'Databases & Storage' },
  'firebase-admin': { canonicalName: 'Firebase', domain: 'Databases & Storage' },
  'neo4j-driver': { canonicalName: 'Neo4j', domain: 'Databases & Storage' },
  'cassandra-driver': { canonicalName: 'Cassandra', domain: 'Databases & Storage' },
  'sqlalchemy': { canonicalName: 'SQLAlchemy', domain: 'Databases & Storage' },
  'psycopg2': { canonicalName: 'PostgreSQL (psycopg)', domain: 'Databases & Storage' },
  'psycopg2-binary': { canonicalName: 'PostgreSQL (psycopg)', domain: 'Databases & Storage' },
  'psycopg': { canonicalName: 'PostgreSQL (psycopg)', domain: 'Databases & Storage' },
  'pymongo': { canonicalName: 'PyMongo', domain: 'Databases & Storage' },
  'motor': { canonicalName: 'Motor (Async MongoDB)', domain: 'Databases & Storage' },
  'alembic': { canonicalName: 'Alembic', domain: 'Databases & Storage' },
  'tortoise-orm': { canonicalName: 'Tortoise ORM', domain: 'Databases & Storage' },
  'gorm': { canonicalName: 'GORM', domain: 'Databases & Storage' },
  'gorm.io/gorm': { canonicalName: 'GORM', domain: 'Databases & Storage' },
  'sqlx': { canonicalName: 'sqlx', domain: 'Databases & Storage' },
  'github.com/jmoiron/sqlx': { canonicalName: 'sqlx', domain: 'Databases & Storage' },
  'pq': { canonicalName: 'pq (PostgreSQL)', domain: 'Databases & Storage' },
  'github.com/lib/pq': { canonicalName: 'pq (PostgreSQL)', domain: 'Databases & Storage' },
  'go-redis': { canonicalName: 'Go-Redis', domain: 'Databases & Storage' },
  'github.com/redis/go-redis': { canonicalName: 'Go-Redis', domain: 'Databases & Storage' },
  'github.com/redis/go-redis/v9': { canonicalName: 'Go-Redis', domain: 'Databases & Storage' },
  'pgx': { canonicalName: 'pgx', domain: 'Databases & Storage' },
  'github.com/jackc/pgx': { canonicalName: 'pgx', domain: 'Databases & Storage' },
  'github.com/jackc/pgx/v5': { canonicalName: 'pgx', domain: 'Databases & Storage' },
  'diesel': { canonicalName: 'Diesel ORM', domain: 'Databases & Storage' },
  'sea-orm': { canonicalName: 'SeaORM', domain: 'Databases & Storage' },
  'rusqlite': { canonicalName: 'Rusqlite', domain: 'Databases & Storage' },

  // ─── DevOps & Cloud ───
  'docker': { canonicalName: 'Docker', domain: 'DevOps & Cloud' },
  'dockerode': { canonicalName: 'Docker', domain: 'DevOps & Cloud' },
  'kubernetes': { canonicalName: 'Kubernetes', domain: 'DevOps & Cloud' },
  '@kubernetes/client-node': { canonicalName: 'Kubernetes', domain: 'DevOps & Cloud' },
  'terraform': { canonicalName: 'Terraform', domain: 'DevOps & Cloud' },
  'ansible': { canonicalName: 'Ansible', domain: 'DevOps & Cloud' },
  'helm': { canonicalName: 'Helm', domain: 'DevOps & Cloud' },
  'pulumi': { canonicalName: 'Pulumi', domain: 'DevOps & Cloud' },
  'aws-sdk': { canonicalName: 'AWS SDK', domain: 'DevOps & Cloud' },
  'boto3': { canonicalName: 'AWS SDK (Boto3)', domain: 'DevOps & Cloud' },
  'botocore': { canonicalName: 'AWS SDK (Boto3)', domain: 'DevOps & Cloud' },
  'aws-cdk': { canonicalName: 'AWS CDK', domain: 'DevOps & Cloud' },
  'aws-cdk-lib': { canonicalName: 'AWS CDK', domain: 'DevOps & Cloud' },
  'google-cloud-storage': { canonicalName: 'Google Cloud SDK', domain: 'DevOps & Cloud' },
  'kafkajs': { canonicalName: 'Kafka', domain: 'DevOps & Cloud' },
  'confluent-kafka': { canonicalName: 'Kafka', domain: 'DevOps & Cloud' },
  'amqplib': { canonicalName: 'RabbitMQ', domain: 'DevOps & Cloud' },
  'pika': { canonicalName: 'RabbitMQ', domain: 'DevOps & Cloud' },
  'bullmq': { canonicalName: 'BullMQ', domain: 'DevOps & Cloud' },
  'bull': { canonicalName: 'BullMQ', domain: 'DevOps & Cloud' },
  '@upstash/ratelimit': { canonicalName: 'Upstash', domain: 'DevOps & Cloud' },

  // ─── Testing & Quality ───
  'jest': { canonicalName: 'Jest', domain: 'Testing & Quality' },
  'vitest': { canonicalName: 'Vitest', domain: 'Testing & Quality' },
  'cypress': { canonicalName: 'Cypress', domain: 'Testing & Quality' },
  'playwright': { canonicalName: 'Playwright', domain: 'Testing & Quality' },
  '@playwright/test': { canonicalName: 'Playwright', domain: 'Testing & Quality' },
  'mocha': { canonicalName: 'Mocha', domain: 'Testing & Quality' },
  'chai': { canonicalName: 'Chai', domain: 'Testing & Quality' },
  'sinon': { canonicalName: 'Sinon', domain: 'Testing & Quality' },
  'supertest': { canonicalName: 'Supertest', domain: 'Testing & Quality' },
  'karma': { canonicalName: 'Karma', domain: 'Testing & Quality' },
  'jasmine': { canonicalName: 'Jasmine', domain: 'Testing & Quality' },
  'msw': { canonicalName: 'MSW', domain: 'Testing & Quality' },
  'puppeteer': { canonicalName: 'Puppeteer', domain: 'Testing & Quality' },
  'pytest': { canonicalName: 'Pytest', domain: 'Testing & Quality' },
  'pytest-cov': { canonicalName: 'Pytest', domain: 'Testing & Quality' },
  'pytest-asyncio': { canonicalName: 'Pytest', domain: 'Testing & Quality' },
  'unittest': { canonicalName: 'Unittest', domain: 'Testing & Quality' },
  'coverage': { canonicalName: 'Coverage.py', domain: 'Testing & Quality' },
  'tox': { canonicalName: 'Tox', domain: 'Testing & Quality' },
  'hypothesis': { canonicalName: 'Hypothesis', domain: 'Testing & Quality' },
  'testify': { canonicalName: 'Testify', domain: 'Testing & Quality' },
  'github.com/stretchr/testify': { canonicalName: 'Testify', domain: 'Testing & Quality' },
  'ginkgo': { canonicalName: 'Ginkgo', domain: 'Testing & Quality' },
  'github.com/onsi/ginkgo': { canonicalName: 'Ginkgo', domain: 'Testing & Quality' },
  'criterion': { canonicalName: 'Criterion', domain: 'Testing & Quality' },
  'proptest': { canonicalName: 'Proptest', domain: 'Testing & Quality' },
  'mockall': { canonicalName: 'Mockall', domain: 'Testing & Quality' },

  // ─── Security & Auth ───
  'next-auth': { canonicalName: 'NextAuth.js', domain: 'Security & Auth' },
  '@auth/core': { canonicalName: 'Auth.js', domain: 'Security & Auth' },
  'jsonwebtoken': { canonicalName: 'JWT (jsonwebtoken)', domain: 'Security & Auth' },
  'bcrypt': { canonicalName: 'Bcrypt', domain: 'Security & Auth' },
  'bcryptjs': { canonicalName: 'Bcrypt', domain: 'Security & Auth' },
  'argon2': { canonicalName: 'Argon2', domain: 'Security & Auth' },
  'helmet': { canonicalName: 'Helmet', domain: 'Security & Auth' },
  'cors': { canonicalName: 'CORS', domain: 'Security & Auth' },
  'passport': { canonicalName: 'Passport.js', domain: 'Security & Auth' },
  'lucia': { canonicalName: 'Lucia Auth', domain: 'Security & Auth' },
  'auth0': { canonicalName: 'Auth0', domain: 'Security & Auth' },
  '@auth0/nextjs-auth0': { canonicalName: 'Auth0', domain: 'Security & Auth' },
  'pyjwt': { canonicalName: 'PyJWT', domain: 'Security & Auth' },
  'passlib': { canonicalName: 'Passlib', domain: 'Security & Auth' },
  'cryptography': { canonicalName: 'Cryptography', domain: 'Security & Auth' },
  'express-rate-limit': { canonicalName: 'Express Rate Limit', domain: 'Security & Auth' },
  'validator': { canonicalName: 'Validator.js', domain: 'Security & Auth' },
  'zod': { canonicalName: 'Zod', domain: 'Security & Auth' },
  'joi': { canonicalName: 'Joi', domain: 'Security & Auth' },
  'yup': { canonicalName: 'Yup', domain: 'Security & Auth' },
  'pydantic': { canonicalName: 'Pydantic', domain: 'Security & Auth' },

  // ─── AI & Machine Learning ───
  'torch': { canonicalName: 'PyTorch', domain: 'AI & Machine Learning' },
  'pytorch': { canonicalName: 'PyTorch', domain: 'AI & Machine Learning' },
  'tensorflow': { canonicalName: 'TensorFlow', domain: 'AI & Machine Learning' },
  'keras': { canonicalName: 'Keras', domain: 'AI & Machine Learning' },
  'jax': { canonicalName: 'JAX', domain: 'AI & Machine Learning' },
  'transformers': { canonicalName: 'Hugging Face Transformers', domain: 'AI & Machine Learning' },
  'diffusers': { canonicalName: 'Hugging Face Diffusers', domain: 'AI & Machine Learning' },
  'onnx': { canonicalName: 'ONNX', domain: 'AI & Machine Learning' },
  'onnxruntime': { canonicalName: 'ONNX', domain: 'AI & Machine Learning' },
  'openai': { canonicalName: 'OpenAI', domain: 'AI & Machine Learning' },
  'ai': { canonicalName: 'Vercel AI SDK', domain: 'AI & Machine Learning' },
  'langchain': { canonicalName: 'LangChain', domain: 'AI & Machine Learning' },
  '@langchain/core': { canonicalName: 'LangChain', domain: 'AI & Machine Learning' },
  'langchain-core': { canonicalName: 'LangChain', domain: 'AI & Machine Learning' },
  'llama-index': { canonicalName: 'LlamaIndex', domain: 'AI & Machine Learning' },
  'llamaindex': { canonicalName: 'LlamaIndex', domain: 'AI & Machine Learning' },
  'anthropic': { canonicalName: 'Anthropic SDK', domain: 'AI & Machine Learning' },
  '@anthropic-ai/sdk': { canonicalName: 'Anthropic SDK', domain: 'AI & Machine Learning' },
  'groq-sdk': { canonicalName: 'Groq SDK', domain: 'AI & Machine Learning' },
  'chromadb': { canonicalName: 'ChromaDB', domain: 'AI & Machine Learning' },
  'pinecone-client': { canonicalName: 'Pinecone', domain: 'AI & Machine Learning' },
  '@pinecone-database/pinecone': { canonicalName: 'Pinecone', domain: 'AI & Machine Learning' },
  'qdrant-client': { canonicalName: 'Qdrant', domain: 'AI & Machine Learning' },
  'weaviate-client': { canonicalName: 'Weaviate', domain: 'AI & Machine Learning' },
  'pandas': { canonicalName: 'Pandas', domain: 'AI & Machine Learning' },
  'numpy': { canonicalName: 'NumPy', domain: 'AI & Machine Learning' },
  'scipy': { canonicalName: 'SciPy', domain: 'AI & Machine Learning' },
  'scikit-learn': { canonicalName: 'Scikit-Learn', domain: 'AI & Machine Learning' },
  'sklearn': { canonicalName: 'Scikit-Learn', domain: 'AI & Machine Learning' },
  'polars': { canonicalName: 'Polars', domain: 'AI & Machine Learning' },
  'matplotlib': { canonicalName: 'Matplotlib', domain: 'AI & Machine Learning' },
  'seaborn': { canonicalName: 'Seaborn', domain: 'AI & Machine Learning' },
  'plotly': { canonicalName: 'Plotly', domain: 'AI & Machine Learning' },
  'opencv-python': { canonicalName: 'OpenCV', domain: 'AI & Machine Learning' },
  'cv2': { canonicalName: 'OpenCV', domain: 'AI & Machine Learning' },
  'spacy': { canonicalName: 'spaCy', domain: 'AI & Machine Learning' },
  'nltk': { canonicalName: 'NLTK', domain: 'AI & Machine Learning' },

  // ─── Systems & Tooling ───
  'vite': { canonicalName: 'Vite', domain: 'Systems & Tooling' },
  'webpack': { canonicalName: 'Webpack', domain: 'Systems & Tooling' },
  'webpack-cli': { canonicalName: 'Webpack', domain: 'Systems & Tooling' },
  'esbuild': { canonicalName: 'esbuild', domain: 'Systems & Tooling' },
  'rollup': { canonicalName: 'Rollup', domain: 'Systems & Tooling' },
  '@babel/core': { canonicalName: 'Babel', domain: 'Systems & Tooling' },
  'babel-core': { canonicalName: 'Babel', domain: 'Systems & Tooling' },
  'swc': { canonicalName: 'SWC', domain: 'Systems & Tooling' },
  '@swc/core': { canonicalName: 'SWC', domain: 'Systems & Tooling' },
  'tsup': { canonicalName: 'tsup', domain: 'Systems & Tooling' },
  'ts-node': { canonicalName: 'ts-node', domain: 'Systems & Tooling' },
  'tsx': { canonicalName: 'tsx', domain: 'Systems & Tooling' },
  'turbo': { canonicalName: 'Turborepo', domain: 'Systems & Tooling' },
  'turborepo': { canonicalName: 'Turborepo', domain: 'Systems & Tooling' },
  'parcel': { canonicalName: 'Parcel', domain: 'Systems & Tooling' },
  'typescript': { canonicalName: 'TypeScript', domain: 'Systems & Tooling' },
  'eslint': { canonicalName: 'ESLint', domain: 'Systems & Tooling' },
  'prettier': { canonicalName: 'Prettier', domain: 'Systems & Tooling' },
  'biome': { canonicalName: 'Biome', domain: 'Systems & Tooling' },
  '@biomejs/biome': { canonicalName: 'Biome', domain: 'Systems & Tooling' },
  'ruff': { canonicalName: 'Ruff', domain: 'Systems & Tooling' },
  'black': { canonicalName: 'Black', domain: 'Systems & Tooling' },
  'flake8': { canonicalName: 'Flake8', domain: 'Systems & Tooling' },
  'mypy': { canonicalName: 'Mypy', domain: 'Systems & Tooling' },
  'tokio': { canonicalName: 'Tokio', domain: 'Systems & Tooling' },
  'serde': { canonicalName: 'Serde', domain: 'Systems & Tooling' },
  'serde_json': { canonicalName: 'Serde JSON', domain: 'Systems & Tooling' },
  'anyhow': { canonicalName: 'Anyhow', domain: 'Systems & Tooling' },
  'thiserror': { canonicalName: 'Thiserror', domain: 'Systems & Tooling' },
  'clap': { canonicalName: 'Clap', domain: 'Systems & Tooling' },
  'tracing': { canonicalName: 'Tracing', domain: 'Systems & Tooling' },
  'rayon': { canonicalName: 'Rayon', domain: 'Systems & Tooling' },
  'zap': { canonicalName: 'Uber Zap', domain: 'Systems & Tooling' },
  'go.uber.org/zap': { canonicalName: 'Uber Zap', domain: 'Systems & Tooling' },
  'logrus': { canonicalName: 'Logrus', domain: 'Systems & Tooling' },
  'github.com/sirupsen/logrus': { canonicalName: 'Logrus', domain: 'Systems & Tooling' },
  'cobra': { canonicalName: 'Cobra CLI', domain: 'Systems & Tooling' },
  'github.com/spf13/cobra': { canonicalName: 'Cobra CLI', domain: 'Systems & Tooling' },
  'viper': { canonicalName: 'Viper', domain: 'Systems & Tooling' },
  'github.com/spf13/viper': { canonicalName: 'Viper', domain: 'Systems & Tooling' },
  'uuid': { canonicalName: 'UUID', domain: 'Systems & Tooling' },
  'github.com/google/uuid': { canonicalName: 'UUID', domain: 'Systems & Tooling' },
};

/**
 * Scoped package prefix rules for dynamic matching.
 */
export const PREFIX_TAXONOMY: Array<{ prefix: string; canonicalName: string; domain: string }> = [
  { prefix: '@radix-ui/', canonicalName: 'Radix UI', domain: 'Frontend & UI' },
  { prefix: '@testing-library/', canonicalName: 'Testing Library', domain: 'Testing & Quality' },
  { prefix: '@aws-sdk/', canonicalName: 'AWS SDK', domain: 'DevOps & Cloud' },
  { prefix: '@google-cloud/', canonicalName: 'Google Cloud SDK', domain: 'DevOps & Cloud' },
  { prefix: '@azure/', canonicalName: 'Azure SDK', domain: 'DevOps & Cloud' },
  { prefix: '@clerk/', canonicalName: 'Clerk', domain: 'Security & Auth' },
  { prefix: '@ai-sdk/', canonicalName: 'Vercel AI SDK', domain: 'AI & Machine Learning' },
  { prefix: '@tanstack/', canonicalName: 'TanStack', domain: 'Frontend & UI' },
  { prefix: '@mui/', canonicalName: 'Material UI', domain: 'Frontend & UI' },
  { prefix: '@chakra-ui/', canonicalName: 'Chakra UI', domain: 'Frontend & UI' },
  { prefix: '@mantine/', canonicalName: 'Mantine', domain: 'Frontend & UI' },
  { prefix: '@nestjs/', canonicalName: 'NestJS', domain: 'Backend & APIs' },
  { prefix: '@trpc/', canonicalName: 'tRPC', domain: 'Backend & APIs' },
  { prefix: '@prisma/', canonicalName: 'Prisma', domain: 'Databases & Storage' },
  { prefix: '@swc/', canonicalName: 'SWC', domain: 'Systems & Tooling' },
  { prefix: '@babel/', canonicalName: 'Babel', domain: 'Systems & Tooling' },
  { prefix: '@sveltejs/', canonicalName: 'Svelte', domain: 'Frontend & UI' },
  { prefix: '@angular/', canonicalName: 'Angular', domain: 'Frontend & UI' },
];

/**
 * Repository topic mapping to technical domains and canonical names.
 */
export const TOPIC_MAP: Record<string, TaxonomyEntry> = {
  'react': { canonicalName: 'React', domain: 'Frontend & UI' },
  'reactjs': { canonicalName: 'React', domain: 'Frontend & UI' },
  'nextjs': { canonicalName: 'Next.js', domain: 'Frontend & UI' },
  'next': { canonicalName: 'Next.js', domain: 'Frontend & UI' },
  'vue': { canonicalName: 'Vue.js', domain: 'Frontend & UI' },
  'vuejs': { canonicalName: 'Vue.js', domain: 'Frontend & UI' },
  'svelte': { canonicalName: 'Svelte', domain: 'Frontend & UI' },
  'angular': { canonicalName: 'Angular', domain: 'Frontend & UI' },
  'tailwind': { canonicalName: 'Tailwind CSS', domain: 'Frontend & UI' },
  'tailwindcss': { canonicalName: 'Tailwind CSS', domain: 'Frontend & UI' },
  'redux': { canonicalName: 'Redux', domain: 'Frontend & UI' },
  'framer-motion': { canonicalName: 'Framer Motion', domain: 'Frontend & UI' },
  'frontend': { canonicalName: 'Frontend Architecture', domain: 'Frontend & UI' },
  'ui': { canonicalName: 'UI Design', domain: 'Frontend & UI' },
  'web-development': { canonicalName: 'Web Development', domain: 'Frontend & UI' },

  'nodejs': { canonicalName: 'Node.js', domain: 'Backend & APIs' },
  'node': { canonicalName: 'Node.js', domain: 'Backend & APIs' },
  'express': { canonicalName: 'Express', domain: 'Backend & APIs' },
  'expressjs': { canonicalName: 'Express', domain: 'Backend & APIs' },
  'nestjs': { canonicalName: 'NestJS', domain: 'Backend & APIs' },
  'fastapi': { canonicalName: 'FastAPI', domain: 'Backend & APIs' },
  'django': { canonicalName: 'Django', domain: 'Backend & APIs' },
  'flask': { canonicalName: 'Flask', domain: 'Backend & APIs' },
  'graphql': { canonicalName: 'GraphQL', domain: 'Backend & APIs' },
  'trpc': { canonicalName: 'tRPC', domain: 'Backend & APIs' },
  'rest-api': { canonicalName: 'REST APIs', domain: 'Backend & APIs' },
  'api': { canonicalName: 'REST APIs', domain: 'Backend & APIs' },
  'backend': { canonicalName: 'Backend Architecture', domain: 'Backend & APIs' },
  'microservices': { canonicalName: 'Microservices', domain: 'Backend & APIs' },
  'grpc': { canonicalName: 'gRPC', domain: 'Backend & APIs' },

  'postgresql': { canonicalName: 'PostgreSQL', domain: 'Databases & Storage' },
  'postgres': { canonicalName: 'PostgreSQL', domain: 'Databases & Storage' },
  'mysql': { canonicalName: 'MySQL', domain: 'Databases & Storage' },
  'mongodb': { canonicalName: 'MongoDB', domain: 'Databases & Storage' },
  'redis': { canonicalName: 'Redis', domain: 'Databases & Storage' },
  'prisma': { canonicalName: 'Prisma', domain: 'Databases & Storage' },
  'drizzle': { canonicalName: 'Drizzle ORM', domain: 'Databases & Storage' },
  'supabase': { canonicalName: 'Supabase', domain: 'Databases & Storage' },
  'sqlite': { canonicalName: 'SQLite', domain: 'Databases & Storage' },
  'database': { canonicalName: 'Database Design', domain: 'Databases & Storage' },
  'sql': { canonicalName: 'SQL', domain: 'Databases & Storage' },
  'nosql': { canonicalName: 'NoSQL', domain: 'Databases & Storage' },

  'docker': { canonicalName: 'Docker', domain: 'DevOps & Cloud' },
  'kubernetes': { canonicalName: 'Kubernetes', domain: 'DevOps & Cloud' },
  'k8s': { canonicalName: 'Kubernetes', domain: 'DevOps & Cloud' },
  'aws': { canonicalName: 'AWS', domain: 'DevOps & Cloud' },
  'gcp': { canonicalName: 'Google Cloud', domain: 'DevOps & Cloud' },
  'azure': { canonicalName: 'Azure', domain: 'DevOps & Cloud' },
  'terraform': { canonicalName: 'Terraform', domain: 'DevOps & Cloud' },
  'ci-cd': { canonicalName: 'CI/CD', domain: 'DevOps & Cloud' },
  'devops': { canonicalName: 'DevOps', domain: 'DevOps & Cloud' },
  'cloud': { canonicalName: 'Cloud Architecture', domain: 'DevOps & Cloud' },
  'kafka': { canonicalName: 'Kafka', domain: 'DevOps & Cloud' },
  'rabbitmq': { canonicalName: 'RabbitMQ', domain: 'DevOps & Cloud' },

  'testing': { canonicalName: 'Automated Testing', domain: 'Testing & Quality' },
  'jest': { canonicalName: 'Jest', domain: 'Testing & Quality' },
  'vitest': { canonicalName: 'Vitest', domain: 'Testing & Quality' },
  'playwright': { canonicalName: 'Playwright', domain: 'Testing & Quality' },
  'cypress': { canonicalName: 'Cypress', domain: 'Testing & Quality' },
  'tdd': { canonicalName: 'Test-Driven Development', domain: 'Testing & Quality' },

  'security': { canonicalName: 'Application Security', domain: 'Security & Auth' },
  'auth': { canonicalName: 'Authentication', domain: 'Security & Auth' },
  'oauth': { canonicalName: 'OAuth', domain: 'Security & Auth' },
  'jwt': { canonicalName: 'JWT', domain: 'Security & Auth' },
  'cryptography': { canonicalName: 'Cryptography', domain: 'Security & Auth' },

  'machine-learning': { canonicalName: 'Machine Learning', domain: 'AI & Machine Learning' },
  'deep-learning': { canonicalName: 'Deep Learning', domain: 'AI & Machine Learning' },
  'artificial-intelligence': { canonicalName: 'Artificial Intelligence', domain: 'AI & Machine Learning' },
  'ai': { canonicalName: 'Artificial Intelligence', domain: 'AI & Machine Learning' },
  'nlp': { canonicalName: 'Natural Language Processing', domain: 'AI & Machine Learning' },
  'llm': { canonicalName: 'Large Language Models', domain: 'AI & Machine Learning' },
  'computer-vision': { canonicalName: 'Computer Vision', domain: 'AI & Machine Learning' },
  'pytorch': { canonicalName: 'PyTorch', domain: 'AI & Machine Learning' },
  'tensorflow': { canonicalName: 'TensorFlow', domain: 'AI & Machine Learning' },
  'langchain': { canonicalName: 'LangChain', domain: 'AI & Machine Learning' },
  'data-science': { canonicalName: 'Data Science', domain: 'AI & Machine Learning' },

  'vite': { canonicalName: 'Vite', domain: 'Systems & Tooling' },
  'webpack': { canonicalName: 'Webpack', domain: 'Systems & Tooling' },
  'cli': { canonicalName: 'CLI Tooling', domain: 'Systems & Tooling' },
  'compiler': { canonicalName: 'Compilers & Tooling', domain: 'Systems & Tooling' },
};

/**
 * Looks up a package or topic name against the taxonomy dictionary and prefix rules.
 */
export function lookupSkill(name: string): TaxonomyEntry | null {
  if (!name || typeof name !== 'string') return null;

  const lower = name.trim().toLowerCase();
  if (!lower) return null;

  // 1. Direct match in package taxonomy
  if (PACKAGE_TAXONOMY[lower]) {
    return PACKAGE_TAXONOMY[lower];
  }

  // 1b. Delimiter normalization (- vs _) for Python / Rust packages
  const withHyphens = lower.replace(/_/g, '-');
  if (PACKAGE_TAXONOMY[withHyphens]) {
    return PACKAGE_TAXONOMY[withHyphens];
  }
  const withUnderscores = lower.replace(/-/g, '_');
  if (PACKAGE_TAXONOMY[withUnderscores]) {
    return PACKAGE_TAXONOMY[withUnderscores];
  }

  // 2. Direct match in topic map
  if (TOPIC_MAP[lower]) {
    return TOPIC_MAP[lower];
  }

  // 3. Prefix match for scoped packages
  for (const rule of PREFIX_TAXONOMY) {
    if (lower.startsWith(rule.prefix)) {
      return {
        canonicalName: rule.canonicalName,
        domain: rule.domain,
      };
    }
  }

  // 4. Fallback for module paths (e.g. github.com/gin-gonic/gin)
  if (lower.includes('/')) {
    const segments = lower.split('/');
    let last = segments[segments.length - 1];
    if (/^v\d+$/i.test(last) && segments.length > 1) {
      last = segments[segments.length - 2];
    }
    if (PACKAGE_TAXONOMY[last]) {
      return PACKAGE_TAXONOMY[last];
    }
    if (TOPIC_MAP[last]) {
      return TOPIC_MAP[last];
    }
  }

  return null;
}

/**
 * Classifies skills from manifests, repository topics, and primary languages into technical domains.
 *
 * @param manifests - Array of manifest file descriptors with filename and text content.
 * @param topics - Repository topics.
 * @param languages - Map of language names to byte counts.
 * @returns Sorted array of DomainSkill matching DomainSkill from types.ts.
 */
export function classifySkillsFromManifests(
  manifests: Array<{ filename: string; content: string }>,
  topics: string[] = [],
  languages: Record<string, number> = {}
): DomainSkill[] {
  const domainSkillsMap = new Map<string, Set<string>>();

  function addSkill(domain: string, skill: string) {
    if (!domain || !skill) return;
    if (!domainSkillsMap.has(domain)) {
      domainSkillsMap.set(domain, new Set<string>());
    }
    domainSkillsMap.get(domain)!.add(skill);
  }

  // 1. Match extracted packages from manifests
  if (Array.isArray(manifests)) {
    for (const manifest of manifests) {
      if (!manifest || !manifest.filename || typeof manifest.content !== 'string') continue;
      const deps = extractDependenciesFromManifest(manifest.filename, manifest.content);
      for (const dep of deps) {
        const entry = lookupSkill(dep);
        if (entry) {
          addSkill(entry.domain, entry.canonicalName);
        }
      }
    }
  }

  // 2. Merge repository topics representing specific technologies/domains
  if (Array.isArray(topics)) {
    for (const topic of topics) {
      if (!topic || typeof topic !== 'string') continue;
      const entry = lookupSkill(topic);
      if (entry) {
        addSkill(entry.domain, entry.canonicalName);
      }
    }
  }

  // 3. Merge primary languages into "Languages" domain if not already covered
  if (languages && typeof languages === 'object') {
    const sortedLanguages = Object.entries(languages)
      .filter(([, bytes]) => typeof bytes === 'number' && bytes > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([lang]) => lang.trim())
      .filter(Boolean);

    for (const lang of sortedLanguages) {
      addSkill('Languages', lang);
    }
  }

  // 4. Format output, sort skills alphabetically and domains by skill count descending
  const results: DomainSkill[] = [];
  for (const [domain, skillsSet] of domainSkillsMap.entries()) {
    if (skillsSet.size > 0) {
      const sortedSkills = Array.from(skillsSet).sort((a, b) => a.localeCompare(b));
      results.push({
        domain,
        skills: sortedSkills,
      });
    }
  }

  results.sort((a, b) => {
    const countDiff = b.skills.length - a.skills.length;
    if (countDiff !== 0) return countDiff;
    return a.domain.localeCompare(b.domain);
  });

  return results;
}
