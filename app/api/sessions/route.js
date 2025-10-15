import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/sessions - Get all sessions
export async function GET() {
    try {
        const sessions = await prisma.session.findMany({
            include: {
                queries: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Limit to last 50 sessions
        });

        return NextResponse.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch sessions'
        }, { status: 500 });
    }
}

// POST /api/sessions - Create a new session
export async function POST(request) {
    try {
        const body = await request.json();
        const { documentChunks } = body;

        const session = await prisma.session.create({
            data: {
                documentChunks: documentChunks || 0,
                isActive: true
            }
        });

        return NextResponse.json({
            success: true,
            data: session
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating session:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to create session'
        }, { status: 500 });
    }
}
