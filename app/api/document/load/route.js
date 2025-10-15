import { prisma } from '@/lib/db';
import { splitText } from '@/lib/llm';
import { NextResponse } from 'next/server';

// POST /api/document/load - Load and index a document for a session
export async function POST(request) {
    try {
        const body = await request.json();
        const { sessionId, documentText } = body;

        // Validate input
        if (!sessionId) {
            return NextResponse.json({
                success: false,
                error: 'Session ID is required'
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

        // Split document into chunks
        const chunks = splitText(documentText);

        // Update session with chunk count
        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: {
                documentChunks: chunks.length
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                sessionId: updatedSession.id,
                documentChunks: updatedSession.documentChunks,
                message: `Document successfully loaded and split into ${chunks.length} chunks`
            }
        });

    } catch (error) {
        console.error('Error loading document:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to load document'
        }, { status: 500 });
    }
}
