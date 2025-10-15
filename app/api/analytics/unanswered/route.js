import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/analytics/unanswered - Get all unanswered questions
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const includeNeedsImprovement = searchParams.get('includeNeedsImprovement') === 'true';

        // Build the where clause
        const where = includeNeedsImprovement 
            ? { OR: [{ isUnanswered: true }, { needsImprovement: true }] }
            : { isUnanswered: true };

        const unansweredQueries = await prisma.query.findMany({
            where,
            include: {
                session: {
                    select: {
                        id: true,
                        createdAt: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        });

        // Group by similar questions to find patterns
        const questionPatterns = {};
        unansweredQueries.forEach(query => {
            // Simple pattern detection - first 5 words
            const pattern = query.question.toLowerCase().split(' ').slice(0, 5).join(' ');
            if (!questionPatterns[pattern]) {
                questionPatterns[pattern] = {
                    pattern,
                    count: 0,
                    examples: []
                };
            }
            questionPatterns[pattern].count++;
            if (questionPatterns[pattern].examples.length < 3) {
                questionPatterns[pattern].examples.push({
                    id: query.id,
                    question: query.question,
                    createdAt: query.createdAt
                });
            }
        });

        // Convert to array and sort by frequency
        const patternArray = Object.values(questionPatterns)
            .sort((a, b) => b.count - a.count);

        return NextResponse.json({
            success: true,
            data: {
                total: unansweredQueries.length,
                queries: unansweredQueries,
                patterns: patternArray,
                summary: {
                    totalUnanswered: unansweredQueries.filter(q => q.isUnanswered).length,
                    totalNeedsImprovement: unansweredQueries.filter(q => q.needsImprovement).length,
                    avgConfidence: unansweredQueries.reduce((sum, q) => sum + (q.confidence || 0), 0) / unansweredQueries.length || 0
                }
            }
        });
    } catch (error) {
        console.error('Error fetching unanswered queries:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch unanswered queries'
        }, { status: 500 });
    }
}
