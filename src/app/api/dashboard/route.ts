import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db/connection';
import Repository from '@/lib/db/models/Repository';
import AnalysisResult from '@/lib/db/models/AnalysisResult';
import { getCriticalModuleIds } from '@/lib/analyzer/graph/importance';
import type { IGraphEdge, IGraphNode } from '@/lib/db/models/AnalysisResult';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch user's repositories
        const repos = await Repository.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();

        const repoIds = repos.map((r) => r._id);

        // Fetch all analysis results for these repos
        const analyses = await AnalysisResult.find({ repositoryId: { $in: repoIds } }).lean();

        // rankImportantNodes is O(V·(V+E)) per call. Repositories analyzed with the
        // current pipeline (analysisVersion 2) already store the same deterministic
        // result in metrics.criticalModules, so only legacy documents are recomputed.
        const analysisVersionByRepo = new Map(
            repos.map((repo) => [repo._id.toString(), repo.analysisVersion ?? 1])
        );
        const criticalModulesByRepo = new Map<string, string[]>();
        const criticalModulesFor = (analysis: { repositoryId: { toString(): string }; nodes?: IGraphNode[]; edges?: IGraphEdge[]; metrics?: { criticalModules?: string[] } | null }): string[] => {
            const key = analysis.repositoryId.toString();
            let modules = criticalModulesByRepo.get(key);
            if (!modules) {
                const stored = analysisVersionByRepo.get(key) === 2 ? analysis.metrics?.criticalModules : undefined;
                modules = stored ?? getCriticalModuleIds(analysis.nodes ?? [], analysis.edges ?? []);
                criticalModulesByRepo.set(key, modules);
            }
            return modules;
        };

        // Aggregate metrics
        let totalFiles = 0;
        let totalDependencies = 0;
        let totalLOC = 0;
        let totalCriticalModules = 0;
        let totalCircularDeps = 0;
        const fileTypeAgg: Record<string, number> = {};
        const allCriticalModules: string[] = [];
        const densities: number[] = [];

        for (const analysis of analyses) {
            const criticalModules = criticalModulesFor(analysis);
            if (analysis.metrics) {
                totalFiles += analysis.metrics.totalFiles || 0;
                totalDependencies += analysis.metrics.totalDependencies || 0;
                totalCriticalModules += criticalModules.length;
                totalCircularDeps += (analysis.metrics.circularDependencies || []).length;
                densities.push(analysis.metrics.dependencyDensity || 0);

                // Aggregate file types
                const dist = analysis.metrics.fileTypeDistribution as Record<string, number> || {};
                for (const [ext, count] of Object.entries(dist)) {
                    fileTypeAgg[ext] = (fileTypeAgg[ext] || 0) + (count as number);
                }

                allCriticalModules.push(...criticalModules);
            }

            // Sum LOC
            for (const node of (analysis.nodes || [])) {
                totalLOC += node.loc || 0;
            }
        }

        const avgDensity = densities.length > 0
            ? densities.reduce((a, b) => a + b, 0) / densities.length
            : 0;

        // Recent repos with analysis status
        const recentRepos = repos.slice(0, 10).map((repo) => {
            const analysis = analyses.find(
                (a) => a.repositoryId.toString() === repo._id.toString()
            );
            return {
                id: repo._id.toString(),
                name: `${repo.owner}/${repo.name}`,
                status: repo.status,
                fileCount: repo.fileCount || 0,
                createdAt: repo.createdAt,
                hasAnalysis: !!analysis,
                metrics: analysis?.metrics ? {
                    totalFiles: analysis.metrics.totalFiles,
                    totalDependencies: analysis.metrics.totalDependencies,
                    dependencyDensity: analysis.metrics.dependencyDensity,
                    criticalCount: analysis?.metrics ? criticalModulesFor(analysis).length : 0,
                    circularCount: (analysis.metrics.circularDependencies || []).length,
                } : null,
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                overview: {
                    totalRepos: repos.length,
                    completedRepos: repos.filter((r) => r.status === 'complete').length,
                    totalFiles,
                    totalDependencies,
                    totalLOC,
                    totalCriticalModules,
                    totalCircularDeps,
                    avgDensity: Math.round(avgDensity * 100) / 100,
                },
                fileTypeDistribution: fileTypeAgg,
                criticalModules: allCriticalModules.slice(0, 20),
                recentRepos,
            },
        }, { status: 200 });

    } catch (error: unknown) {
        console.error('Dashboard API error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
