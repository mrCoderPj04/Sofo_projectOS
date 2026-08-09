import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const problemId = searchParams.get('problemId');
    const solutionId = searchParams.get('solutionId');

    const where = {};
    if (projectId) where.projectId = projectId;
    if (problemId) where.problemId = problemId;
    if (solutionId) where.solutionId = solutionId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, avatarUrl: true } },
        problem: { select: { id: true, probId: true, title: true } },
        solution: { select: { id: true, solId: true, title: true } },
        requirement: { select: { id: true, reqId: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      title,
      description = '',
      priority = 'MEDIUM',
      status = 'TODO',
      dueDate,
      estimatedHours = 0,
      projectId,
      requirementId,
      problemId,
      solutionId,
      assigneeId,
      checklist = []
    } = body;

    if (!title || !projectId) {
      return NextResponse.json({ error: 'Title and projectId are required' }, { status: 400 });
    }

    const count = await prisma.task.count({ where: { projectId } });
    const taskId = `TASK-${401 + count}`;

    const newTask = await prisma.task.create({
      data: {
        taskId,
        title,
        description,
        priority,
        status,
        dueDate: dueDate || null,
        estimatedHours: parseFloat(estimatedHours) || 0,
        projectId,
        requirementId: requirementId || null,
        problemId: problemId || null,
        solutionId: solutionId || null,
        assigneeId: assigneeId || session?.userId || null,
        checklist: typeof checklist === 'string' ? checklist : JSON.stringify(checklist)
      }
    });

    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    console.error('Task creation error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
