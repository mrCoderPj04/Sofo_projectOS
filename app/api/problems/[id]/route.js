import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        project: true,
        rca: true,
        solutions: {
          include: { tasks: true }
        },
        tasks: {
          include: { assignee: true }
        },
        requirement: true,
        reporter: { select: { id: true, name: true, avatarUrl: true } },
        owner: { select: { id: true, name: true, avatarUrl: true } }
      }
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData = { ...body };
    if (body.resolutionSteps && typeof body.resolutionSteps !== 'string') {
      updateData.resolutionSteps = JSON.stringify(body.resolutionSteps);
    }
    if (body.status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ success: true, problem: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 });
  }
}
