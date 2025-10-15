import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/sessions/[id] - Get a specific session with all queries
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                queries: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        });

        if (!session) {
            return NextResponse.json({
                success: false,
                error: 'Session not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Error fetching session:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch session'
        }, { status: 500 });
    }
}

// DELETE /api/sessions/[id] - Delete a session
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        await prisma.session.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting session:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to delete session'
        }, { status: 500 });
    }
}

// PATCH /api/sessions/[id] - Update session
export async function PATCH(request, { params }) {
    try {
        const { id } = params;
        const body = await request.json();

        const session = await prisma.session.update({
            where: { id },
            data: body
        });

        return NextResponse.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Error updating session:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update session'
        }, { status: 500 });
    }
}
