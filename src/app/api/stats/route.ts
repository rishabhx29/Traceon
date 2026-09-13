import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Repository from '@/lib/db/models/Repository';
import AnalysisResult from '@/lib/db/models/AnalysisResult';

export const revalidate = 60; // Cache for 60 seconds

// In-memory cache: route handlers on serverless run in warm instances, so this
// collapses repeated aggregations into one DB round-trip per 60s window.
let cache: { data: Record<string, unknown>; at: number } | null = null;
const CACHE_TTL_MS = 60_000;

export async function GET() {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) {
        return NextResponse.json(cache.data, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    }

    try {
        await connectDB();

        // Count successfully analyzed repositories
        const reposAnalyzed = await Repository.countDocuments({ status: 'complete' });

        // Sum up total files parsed
        const filesParsedResult = await Repository.aggregate([
            { $match: { status: 'complete' } },
            { $group: { _id: null, total: { $sum: "$fileCount" } } }
        ]);
        const filesParsed = filesParsedResult[0]?.total || 0;

        // Sum up total edges mapped
        const edgesMappedResult = await AnalysisResult.aggregate([
            { $project: { edgeCount: { $size: { $ifNull: ["$edges", []] } } } },
            { $group: { _id: null, total: { $sum: "$edgeCount" } } }
        ]);
        const edgesMapped = edgesMappedResult[0]?.total || 0;

        const data = {
            reposAnalyzed,
            filesParsed,
            edgesMapped,
            avgAnalysis: '<30s',
        };

        cache = { data, at: Date.now() };

        return NextResponse.json(data, {
            headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
        });
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Serve stale data if we have it rather than failing the UI
        if (cache) {
            return NextResponse.json(cache.data, {
                headers: { 'Cache-Control': 'no-store' },
            });
        }
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
