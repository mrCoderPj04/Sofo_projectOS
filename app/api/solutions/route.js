import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      problemId,
      title,
      description,
      approach = '',
      expectedOutcome = '',
      complexity = 'MEDIUM',
      cost = 'LOW',
      risk = 'LOW',
      impact = 'HIGH',
      pros = [],
      cons = []
    } = body;

    if (!problemId || !title) {
      return NextResponse.json({ error: 'Problem ID and Title are required' }, { status: 400 });
    }

    const count = await prisma.solution.count({ where: { problemId } });
    const solId = `SOL-${301 + count}`;

    const solution = await prisma.solution.create({
      data: {
        solId,
        problemId,
        title,
        description: description || '',
        approach: approach || '',
        expectedOutcome: expectedOutcome || '',
        complexity,
        cost,
        risk,
        impact,
        pros: typeof pros === 'string' ? pros : JSON.stringify(pros),
        cons: typeof cons === 'string' ? cons : JSON.stringify(cons),
        status: 'PROPOSED'
      }
    });

    return NextResponse.json({ success: true, solution });
  } catch (error) {
    console.error('Failed to create solution:', error);
    return NextResponse.json({ error: 'Failed to create solution' }, { status: 500 });
  }
}
