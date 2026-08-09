import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params; // solutionId
    const solution = await prisma.solution.findUnique({ where: { id } });

    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 });
    }

    // Unselect other solutions for this problem
    await prisma.solution.updateMany({
      where: { problemId: solution.problemId, id: { not: id } },
      data: { status: 'EVALUATING' }
    });

    // Mark current solution selected
    const selected = await prisma.solution.update({
      where: { id },
      data: { status: 'SELECTED' }
    });

    // Update problem status
    await prisma.problem.update({
      where: { id: solution.problemId },
      data: { status: 'SOLUTION_SELECTED' }
    });

    return NextResponse.json({ success: true, solution: selected });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to select solution' }, { status: 500 });
  }
}
