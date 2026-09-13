import http from 'node:http';
import type { GraphData, ImpactResult } from '../analyzer/types';
import { analyzeImpact, generateFullImpactReport } from '../analyzer/graph/impact';
import { buildViewerHtml } from './viewer-html';

export interface ServerHandle {
    port: number;
    close: () => void;
}

export function startServer(
    graphData: GraphData,
    repoName: string,
    preferredPort = 4323
): Promise<ServerHandle> {
    return new Promise((resolve, reject) => {
        const impactReport = generateFullImpactReport(
            graphData.nodes,
            graphData.edges,
            graphData.metrics.criticalModules
        );

        const html = buildViewerHtml(repoName);

        const server = http.createServer((req, res) => {
            const pathname = (req.url || '/').split('?')[0];

            res.setHeader('Access-Control-Allow-Origin', '*');

            if (pathname === '/api/graph') {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(graphData));
                return;
            }

            if (pathname === '/api/impact') {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(impactReport));
                return;
            }

            if (pathname.startsWith('/api/impact/')) {
                const nodeId = decodeURIComponent(pathname.slice('/api/impact/'.length));
                const result = analyzeImpact(
                    nodeId,
                    graphData.nodes,
                    graphData.edges,
                    graphData.metrics.criticalModules
                );
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify(result));
                return;
            }

            // Everything else: the viewer HTML is injected at build time
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        });

        server.on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'EADDRINUSE' && preferredPort < 4343) {
                resolve(startServer(graphData, repoName, preferredPort + 1));
            } else {
                reject(err);
            }
        });

        server.listen(preferredPort, '127.0.0.1', () => {
            resolve({ port: preferredPort, close: () => server.close() });
        });
    });
}
