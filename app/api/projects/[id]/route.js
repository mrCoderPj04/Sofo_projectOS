import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { calculateProjectHealth } from '@/lib/health-engine';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, role: true, avatarUrl: true } } } },
        requirements: {
          include: {
            problems: true,
            tasks: true
          },
          orderBy: { createdAt: 'desc' }
        },
        problems: {
          include: {
            rca: true,
            solutions: {
              include: { tasks: true }
            },
            tasks: true,
            requirement: { select: { id: true, reqId: true, title: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatarUrl: true } },
            problem: { select: { id: true, probId: true, title: true } },
            solution: { select: { id: true, solId: true, title: true } },
            requirement: { select: { id: true, reqId: true, title: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        decisions: { orderBy: { date: 'desc' } },
        knowledge: { orderBy: { updatedAt: 'desc' } },
        risks: { orderBy: { createdAt: 'desc' } },
        files: { orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
    const openProblems = project.problems.filter(p => !['RESOLVED', 'CLOSED'].includes(p.status)).length;
    const criticalProblems = project.problems.filter(p => p.severity === 'CRITICAL' && !['RESOLVED', 'CLOSED'].includes(p.status)).length;
    const overdueTasks = project.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;
    const highRisks = project.risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH').length;

    const health = calculateProjectHealth({
      totalTasks,
      completedTasks,
      totalReqs: project.requirements.length,
      verifiedReqs: project.requirements.filter(r => r.status === 'VERIFIED').length,
      openProblems,
      criticalProblems,
      overdueTasks,
      highRisks
    });

    return NextResponse.json({
      project: {
        ...project,
        health,
        metrics: {
          totalTasks,
          completedTasks,
          openProblems,
          criticalProblems,
          overdueTasks,
          reqCoverage: project.requirements.length > 0 ? Math.round((project.requirements.filter(r => r.status === 'VERIFIED').length / project.requirements.length) * 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch project detail:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        priority: body.priority,
        status: body.status,
        startDate: body.startDate,
        targetDate: body.targetDate,
        techStack: typeof body.techStack === 'string' ? body.techStack : JSON.stringify(body.techStack || []),
        goals: typeof body.goals === 'string' ? body.goals : JSON.stringify(body.goals || []),
        successCriteria: typeof body.successCriteria === 'string' ? body.successCriteria : JSON.stringify(body.successCriteria || [])
      }
    });

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
