import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// POST /api/feedback - Submit user feedback for a query
export async function POST(request) {
    try {
        const body = await request.json();
        const { queryId, feedback, note } = body;

        // Validate input
        if (!queryId) {
            return NextResponse.json({
                success: false,
                error: 'Query ID is required'
            }, { status: 400 });
        }

        if (!feedback || !['helpful', 'unhelpful', 'neutral'].includes(feedback)) {
            return NextResponse.json({
                success: false,
                error: 'Feedback must be "helpful", "unhelpful", or "neutral"'
            }, { status: 400 });
        }

        // Update query with feedback
        const updatedQuery = await prisma.query.update({
            where: { id: queryId },
            data: {
                userFeedback: feedback,
                feedbackNote: note || null,
                // If marked unhelpful, flag as needs improvement
                needsImprovement: feedback === 'unhelpful' ? true : undefined
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                queryId: updatedQuery.id,
                userFeedback: updatedQuery.userFeedback,
                feedbackNote: updatedQuery.feedbackNote
            }
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to submit feedback'
        }, { status: 500 });
    }
}

// GET /api/feedback?queryId=xxx - Get feedback for a specific query
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryId = searchParams.get('queryId');

        if (!queryId) {
            return NextResponse.json({
                success: false,
                error: 'Query ID is required'
            }, { status: 400 });
        }

        const query = await prisma.query.findUnique({
            where: { id: queryId },
            select: {
                id: true,
                question: true,
                answer: true,
                userFeedback: true,
                feedbackNote: true,
                confidence: true,
                wasAnswered: true,
                isUnanswered: true
            }
        });

        if (!query) {
            return NextResponse.json({
                success: false,
                error: 'Query not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: query
        });
    } catch (error) {
        console.error('Error fetching feedback:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch feedback'
        }, { status: 500 });
    }
}
