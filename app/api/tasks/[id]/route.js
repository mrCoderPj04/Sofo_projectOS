import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        dueDate: body.dueDate,
        estimatedHours: body.estimatedHours !== undefined ? parseFloat(body.estimatedHours) : undefined,
        actualHours: body.actualHours !== undefined ? parseFloat(body.actualHours) : undefined,
        assigneeId: body.assigneeId,
        checklist: typeof body.checklist === 'string' ? body.checklist : (body.checklist ? JSON.stringify(body.checklist) : undefined)
      }
    });

    // Check if task is DONE and update related problem status if all tasks done!
    if (body.status === 'DONE' && task.problemId) {
      const remainingTasks = await prisma.task.count({
        where: { problemId: task.problemId, status: { not: 'DONE' } }
      });
      if (remainingTasks === 0) {
        await prisma.problem.update({
          where: { id: task.problemId },
          data: { status: 'RESOLVED' }
        });
      }
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
