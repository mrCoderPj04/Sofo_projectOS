import express from 'express';
import { prisma } from '../lib/db.js';
import { authMiddleware } from '../lib/auth.js';

const router = express.Router();

// GET /api/tasks — List tasks
router.get('/', async (req, res) => {
  try {
    const { projectId, problemId, solutionId } = req.query;
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

    return res.json({ tasks });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks — Create a task
router.post('/', authMiddleware, async (req, res) => {
  try {
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
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
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
        assigneeId: assigneeId || req.user?.userId || null,
        checklist: typeof checklist === 'string' ? checklist : JSON.stringify(checklist)
      }
    });

    return res.json({ success: true, task: newTask });
  } catch (error) {
    console.error('Task creation error:', error);
    return res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id — Update task status or assignee
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, priority, assigneeId, actualHours } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(priority && { priority }),
        ...(assigneeId && { assigneeId }),
        ...(actualHours !== undefined && { actualHours: parseFloat(actualHours) })
      }
    });

    return res.json({ success: true, task: updatedTask });
  } catch (error) {
    console.error('Task update error:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;
