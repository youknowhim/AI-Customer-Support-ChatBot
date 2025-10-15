import { prisma } from '@/lib/db';
import { analyzeAnswerQuality, generateAnswer, generateContext, splitText } from '@/lib/llm';
import { NextResponse } from 'next/server';

// POST /api/query - Process a query with RAG
export async function POST(request) {
    const startTime = Date.now();
    
    try {
        const body = await request.json();
        const { sessionId, question, documentText } = body;

        // Validate input
        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: 'Session ID is required'
            }, { status: 400 });
        }

        if (!question || !question.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Question is required'
            }, { status: 400 });
        }

        if (!documentText || !documentText.trim()) {
            return NextResponse.json({
                success: false,
                error: 'Document text is required'
            }, { status: 400 });
        }

        // Verify session exists
        const session = await prisma.session.findUnique({
            where: { id: sessionId }
        });

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Session not found'
            }, { status: 404 });
        }

        // Create query record (initially in loading state)
        const query = await prisma.query.create({
            data: {
                sessionId,
                question,
                isLoading: true
            }
        });

        try {
            // Split document into chunks
            const chunks = splitText(documentText);

            // Step 1: Use LLM as retriever to get relevant context
            const context = await generateContext(question, chunks);

            // Step 2: Generate answer using the retrieved context
            const answer = await generateAnswer(question, context);

            // Step 3: Analyze answer quality
            const quality = analyzeAnswerQuality(answer, context);

            // Calculate processing time
            const processingTime = Date.now() - startTime;

            // Update query with results and quality metrics
            const updatedQuery = await prisma.query.update({
                where: { id: query.id },
                data: {
                    context,
                    answer,
                    isLoading: false,
                    processingTime,
                    wasAnswered: quality.wasAnswered,
                    confidence: quality.confidence,
                    isUnanswered: quality.isUnanswered,
                    needsImprovement: quality.needsImprovement
                }
            });

            return NextResponse.json({
                success: true,
                data: {
                    queryId: updatedQuery.id,
                    question: updatedQuery.question,
                    answer: updatedQuery.answer,
                    context: updatedQuery.context,
                    processingTime: updatedQuery.processingTime,
                    wasAnswered: updatedQuery.wasAnswered,
                    confidence: updatedQuery.confidence,
                    isUnanswered: updatedQuery.isUnanswered,
                    needsImprovement: updatedQuery.needsImprovement
                }
            });

        } catch (llmError) {
            // Update query with error
            await prisma.query.update({
                where: { id: query.id },
                data: {
                    isLoading: false,
                    errorMessage: llmError.message,
                    processingTime: Date.now() - startTime
                }
            });

            throw llmError;
        }

    } catch (error) {
        console.error('Error processing query:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process query'
        }, { status: 500 });
    }
}

// GET /api/query?sessionId=xxx - Get all queries for a session
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: 'Session ID is required'
            }, { status: 400 });
        }

        const queries = await prisma.query.findMany({
            where: { sessionId },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json({
            success: true,
            data: queries
        });
    } catch (error) {
        console.error('Error fetching queries:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch queries'
        }, { status: 500 });
    }
}
