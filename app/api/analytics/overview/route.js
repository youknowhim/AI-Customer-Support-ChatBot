import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/analytics/overview - Get comprehensive analytics
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');
        
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - days);

        // Get total counts
        const [
            totalQueries,
            unansweredQueries,
            lowConfidenceQueries,
            queriesWithFeedback,
            helpfulFeedback,
            unhelpfulFeedback
        ] = await Promise.all([
            prisma.query.count({
                where: { createdAt: { gte: dateFrom } }
            }),
            prisma.query.count({
                where: { 
                    createdAt: { gte: dateFrom },
                    isUnanswered: true 
                }
            }),
            prisma.query.count({
                where: { 
                    createdAt: { gte: dateFrom },
                    confidence: { lt: 0.7 }
                }
            }),
            prisma.query.count({
                where: { 
                    createdAt: { gte: dateFrom },
                    userFeedback: { not: null }
                }
            }),
            prisma.query.count({
                where: { 
                    createdAt: { gte: dateFrom },
                    userFeedback: 'helpful'
                }
            }),
            prisma.query.count({
                where: { 
                    createdAt: { gte: dateFrom },
                    userFeedback: 'unhelpful'
                }
            })
        ]);

        // Get average metrics
        const avgMetrics = await prisma.query.aggregate({
            where: { createdAt: { gte: dateFrom } },
            _avg: {
                confidence: true,
                processingTime: true
            }
        });

        // Get most common unanswered questions
        const recentUnanswered = await prisma.query.findMany({
            where: {
                createdAt: { gte: dateFrom },
                isUnanswered: true
            },
            select: {
                id: true,
                question: true,
                createdAt: true,
                confidence: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        // Get queries that need improvement
        const needsImprovement = await prisma.query.findMany({
            where: {
                createdAt: { gte: dateFrom },
                needsImprovement: true
            },
            select: {
                id: true,
                question: true,
                answer: true,
                confidence: true,
                createdAt: true
            },
            orderBy: {
                confidence: 'asc'
            },
            take: 20
        });

        // Calculate rates
        const answerRate = totalQueries > 0 
            ? ((totalQueries - unansweredQueries) / totalQueries * 100).toFixed(2)
            : 0;
        
        const satisfactionRate = queriesWithFeedback > 0
            ? (helpfulFeedback / queriesWithFeedback * 100).toFixed(2)
            : 0;

        return NextResponse.json({
            success: true,
            data: {
                period: {
                    days,
                    from: dateFrom,
                    to: new Date()
                },
                metrics: {
                    totalQueries,
                    answeredQueries: totalQueries - unansweredQueries,
                    unansweredQueries,
                    lowConfidenceQueries,
                    answerRate: parseFloat(answerRate),
                    avgConfidence: avgMetrics._avg.confidence || 0,
                    avgProcessingTime: avgMetrics._avg.processingTime || 0
                },
                feedback: {
                    totalWithFeedback: queriesWithFeedback,
                    helpful: helpfulFeedback,
                    unhelpful: unhelpfulFeedback,
                    neutral: queriesWithFeedback - helpfulFeedback - unhelpfulFeedback,
                    satisfactionRate: parseFloat(satisfactionRate)
                },
                topIssues: {
                    recentUnanswered,
                    needsImprovement
                }
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch analytics'
        }, { status: 500 });
    }
}
