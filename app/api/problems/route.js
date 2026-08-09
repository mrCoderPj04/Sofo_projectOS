import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const whereClause = projectId ? { projectId } : {};

    const problems = await prisma.problem.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true } },
        rca: true,
        solutions: true,
        tasks: true,
        requirement: { select: { id: true, reqId: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ problems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      title,
      description,
      symptoms = '',
      severity = 'HIGH',
      priority = 'HIGH',
      impact = '',
      frequency = '',
      affectedModule = '',
      environmentScope = 'Backend',
      projectId,
      requirementId
    } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Title and projectId are required' }, { status: 400 });
    }

    const count = await prisma.problem.count({ where: { projectId } });
    const probId = `PROB-${201 + count}`;

    const newProblem = await prisma.problem.create({
      data: {
        probId,
        title,
        description: description || '',
        symptoms: symptoms || description || '',
        severity,
        priority,
        status: 'IDENTIFIED',
        impact: impact || 'Service stability risk',
        frequency: frequency || 'Intermittent',
        affectedModule: affectedModule || 'Core System',
        environmentScope: environmentScope || 'Backend',
        projectId,
        requirementId: requirementId || null,
        reporterId: session?.userId || null
      }
    });

    // Create initial default RCA shell
    await prisma.rootCauseAnalysis.create({
      data: {
        problemId: newProblem.id,
        method: 'FIVE_WHYS',
        fiveWhysData: JSON.stringify([
          { whyNumber: 1, question: `Why did "${title}" occur?`, answer: 'Initial symptom observed.' }
        ]),
        causesData: JSON.stringify([])
      }
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        projectId,
        userId: session?.userId || null,
        userName: session?.name || 'User',
        action: 'identified problem',
        details: `Logged ${probId}: ${title}`,
        entityType: 'PROBLEM',
        entityId: newProblem.id
      }
    });

    return NextResponse.json({ success: true, problem: newProblem });
  } catch (error) {
    console.error('Create problem error:', error);
    return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 });
  }
}
