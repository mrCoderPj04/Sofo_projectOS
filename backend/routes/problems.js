import express from 'express';
import { prisma } from '../lib/db.js';
import { authMiddleware } from '../lib/auth.js';

const router = express.Router();

// GET /api/problems — List problems (optionally filtered by projectId)
router.get('/', async (req, res) => {
  try {
    const { projectId } = req.query;
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

    return res.json({ problems });
  } catch (error) {
    console.error('Failed to fetch problems:', error);
    return res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// GET /api/problems/:id — Problem detail with RCA & solutions
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        rca: true,
        solutions: true,
        tasks: true,
        requirement: { select: { id: true, reqId: true, title: true } }
      }
    });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    return res.json({ problem });
  } catch (error) {
    console.error('Failed to fetch problem detail:', error);
    return res.status(500).json({ error: 'Failed to fetch problem detail' });
  }
});

// POST /api/problems — Create a new problem log
router.post('/', authMiddleware, async (req, res) => {
  try {
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
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and projectId are required' });
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
        reporterId: req.user?.userId || null
      }
    });

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

    await prisma.activity.create({
      data: {
        projectId,
        userId: req.user?.userId || null,
        userName: req.user?.name || 'Team Leader',
        action: 'identified problem',
        details: `Logged ${probId}: ${title}`,
        entityType: 'PROBLEM',
        entityId: newProblem.id
      }
    });

    return res.json({ success: true, problem: newProblem });
  } catch (error) {
    console.error('Create problem error:', error);
    return res.status(500).json({ error: 'Failed to create problem' });
  }
});

// PUT /api/problems/:id — Update problem status / RCA / Resolution Steps
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionSteps, rcaData } = req.body;

    const updatedProblem = await prisma.problem.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolutionSteps && { resolutionSteps: typeof resolutionSteps === 'string' ? resolutionSteps : JSON.stringify(resolutionSteps) }),
        ...(status === 'RESOLVED' && { resolvedAt: new Date() })
      }
    });

    if (rcaData) {
      await prisma.rootCauseAnalysis.upsert({
        where: { problemId: id },
        update: {
          fiveWhysData: typeof rcaData.fiveWhysData === 'string' ? rcaData.fiveWhysData : JSON.stringify(rcaData.fiveWhysData || []),
          confirmedRootCause: rcaData.confirmedRootCause || null
        },
        create: {
          problemId: id,
          method: 'FIVE_WHYS',
          fiveWhysData: typeof rcaData.fiveWhysData === 'string' ? rcaData.fiveWhysData : JSON.stringify(rcaData.fiveWhysData || []),
          confirmedRootCause: rcaData.confirmedRootCause || null
        }
      });
    }

    return res.json({ success: true, problem: updatedProblem });
  } catch (error) {
    console.error('Update problem error:', error);
    return res.status(500).json({ error: 'Failed to update problem' });
  }
});

export default router;
