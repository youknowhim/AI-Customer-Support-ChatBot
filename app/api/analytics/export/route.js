import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/analytics/export - Export unanswered questions as JSON/CSV
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';
        const includeAll = searchParams.get('includeAll') === 'true';

        const where = includeAll
            ? { OR: [{ isUnanswered: true }, { needsImprovement: true }, { userFeedback: 'unhelpful' }] }
            : { isUnanswered: true };

        const queries = await prisma.query.findMany({
            where,
            select: {
                id: true,
                question: true,
                answer: true,
                context: true,
                confidence: true,
                isUnanswered: true,
                needsImprovement: true,
                userFeedback: true,
                feedbackNote: true,
                createdAt: true,
                processingTime: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (format === 'csv') {
            // Generate CSV
            const headers = [
                'ID',
                'Question',
                'Answer',
                'Confidence',
                'Is Unanswered',
                'Needs Improvement',
                'User Feedback',
                'Feedback Note',
                'Created At',
                'Processing Time (ms)'
            ];

            const csvRows = [headers.join(',')];
            
            queries.forEach(q => {
                const row = [
                    q.id,
                    `"${q.question.replace(/"/g, '""')}"`,
                    `"${(q.answer || '').replace(/"/g, '""')}"`,
                    q.confidence || 0,
                    q.isUnanswered,
                    q.needsImprovement,
                    q.userFeedback || '',
                    `"${(q.feedbackNote || '').replace(/"/g, '""')}"`,
                    q.createdAt.toISOString(),
                    q.processingTime || 0
                ];
                csvRows.push(row.join(','));
            });

            const csv = csvRows.join('\n');

            return new NextResponse(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="unanswered-questions-${new Date().toISOString().split('T')[0]}.csv"`
                }
            });
        }

        // Return JSON
        return NextResponse.json({
            success: true,
            data: {
                total: queries.length,
                exportedAt: new Date().toISOString(),
                queries
            }
        });

    } catch (error) {
        console.error('Error exporting data:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to export data'
        }, { status: 500 });
    }
}
