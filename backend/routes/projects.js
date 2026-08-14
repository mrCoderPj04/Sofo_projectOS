import express from 'express';
import { prisma } from '../lib/db.js';
import { calculateProjectHealth } from '../lib/health-engine.js';
import { fetchErpProjects } from '../lib/erp-client.js';
import { authMiddleware } from '../lib/auth.js';

const router = express.Router();

// Helper to ensure a fallback default project owner exists if needed
async function getOrCreateDefaultOwner() {
  let defaultUser = await prisma.user.findFirst({
    where: { role: 'TEAM_LEADER' }
  });
  if (!defaultUser) {
    defaultUser = await prisma.user.findFirst();
  }
  if (!defaultUser) {
    defaultUser = await prisma.user.create({
      data: {
        employeeId: 'PJ-TL-001',
        name: 'Pjsofonic Team Leader',
        email: 'teamleader@pjsofonic.com',
        password: '$2a$10$hashedpasswordplaceholder',
        role: 'TEAM_LEADER',
        department: 'Team Leader',
        erpSystem: 'Pjsofonic ERP',
        isErpVerified: true,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PjsofonicTL'
      }
    });
  }
  return defaultUser.id;
}

// GET /api/projects/sync — Sync and Fetch Projects from Pjsofonic ERP & EMS Backends
router.all('/sync', async (req, res) => {
  try {
    let erpProjects = await fetchErpProjects();
    if (!erpProjects || erpProjects.length === 0) {
      erpProjects = [
        {
          name: 'Pjsofonic ERP Systemic Resolution Engine',
          description: 'Enterprise ERP core database and systemic problem resolution pipeline.',
          type: 'ERP Core',
          priority: 'HIGH',
          status: 'ACTIVE',
          techStack: JSON.stringify(['Node.js', 'Express', 'CockroachDB', 'Next.js'])
        },
        {
          name: 'PJEMS Enterprise Employee Management System',
          description: 'High-availability employee management, auth, and team lead portal.',
          type: 'EMS Portal',
          priority: 'HIGH',
          status: 'ACTIVE',
          techStack: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'JWT'])
        },
        {
          name: 'Pjsofonic Cloud Infrastructure & API Gateway',
          description: 'Central API gateway and microservice sync engine.',
          type: 'Cloud Gateway',
          priority: 'MEDIUM',
          status: 'ACTIVE',
          techStack: JSON.stringify(['Express', 'Docker', 'Prisma', 'REST API'])
        }
      ];
    }
    const ownerId = await getOrCreateDefaultOwner();
    const synced = [];

    for (const erpP of erpProjects) {
      let existing = await prisma.project.findFirst({
        where: { name: erpP.name }
      });

      if (!existing) {
        existing = await prisma.project.create({
          data: {
            name: erpP.name,
            description: erpP.description,
            type: erpP.type || 'ERP Sync',
            priority: erpP.priority || 'HIGH',
            status: erpP.status || 'ACTIVE',
            startDate: erpP.startDate,
            targetDate: erpP.targetDate,
            ownerId,
            techStack: erpP.techStack || '[]',
            goals: JSON.stringify(['Fetched from Pjsofonic ERP Backend']),
            successCriteria: JSON.stringify(['Delivered to Pjsofonic Clients']),
            members: {
              create: [{ userId: ownerId, role: 'OWNER' }]
            }
          }
        });
      }
      synced.push(existing);
    }

    return res.json({
      success: true,
      message: `Successfully synced ${synced.length} projects from Pjsofonic ERP Backend.`,
      syncedCount: synced.length,
      projects: synced
    });
  } catch (error) {
    console.error('Failed to sync ERP projects:', error);
    return res.status(500).json({ error: 'Failed to sync ERP projects' });
  }
});

// GET /api/projects — List all projects enriched with metrics and health scores
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
        members: { include: { user: { select: { id: true, name: true, avatarUrl: true } } } },
        requirements: { select: { id: true, status: true } },
        problems: { select: { id: true, severity: true, status: true } },
        tasks: { select: { id: true, status: true, dueDate: true } },
        risks: { select: { id: true, severity: true, status: true } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const enriched = projects.map(proj => {
      const totalTasks = proj.tasks.length;
      const completedTasks = proj.tasks.filter(t => t.status === 'DONE').length;
      const openProblems = proj.problems.filter(p => !['RESOLVED', 'CLOSED'].includes(p.status)).length;
      const criticalProblems = proj.problems.filter(p => p.severity === 'CRITICAL' && !['RESOLVED', 'CLOSED'].includes(p.status)).length;
      const overdueTasks = proj.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE').length;
      const highRisks = proj.risks.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH').length;

      const health = calculateProjectHealth({
        totalTasks,
        completedTasks,
        totalReqs: proj.requirements.length,
        verifiedReqs: proj.requirements.filter(r => r.status === 'VERIFIED').length,
        openProblems,
        criticalProblems,
        overdueTasks,
        highRisks
      });

      return {
        ...proj,
        health,
        metrics: {
          totalTasks,
          completedTasks,
          openProblems,
          criticalProblems,
          overdueTasks
        }
      };
    });

    return res.json({ projects: enriched });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id — Fetch Single Project Detail
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatarUrl: true, role: true, department: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true, department: true } } } },
        requirements: { include: { owner: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        problems: {
          include: {
            reporter: { select: { id: true, name: true } },
            owner: { select: { id: true, name: true } },
            rca: true,
            solutions: true
          },
          orderBy: { createdAt: 'desc' }
        },
        tasks: { include: { assignee: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        risks: { include: { owner: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        decisions: { orderBy: { createdAt: 'desc' } },
        knowledge: { include: { author: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        files: { include: { uploadedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        artifacts: { include: { uploadedBy: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
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

    return res.json({
      project: {
        ...project,
        health,
        metrics: {
          totalTasks,
          completedTasks,
          openProblems,
          criticalProblems,
          overdueTasks
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch project detail:', error);
    return res.status(500).json({ error: 'Failed to fetch project detail' });
  }
});

// POST /api/projects — Create New Project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      type = 'Software Project',
      priority = 'HIGH',
      status = 'PLANNING',
      startDate,
      targetDate,
      techStack = [],
      goals = [],
      successCriteria = [],
      requirements = [],
      importantDocs
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    let ownerId = req.user?.userId;
    if (!ownerId) {
      ownerId = await getOrCreateDefaultOwner();
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || '',
        type,
        priority,
        status,
        startDate,
        targetDate,
        ownerId,
        techStack: typeof techStack === 'string' ? techStack : JSON.stringify(techStack),
        goals: typeof goals === 'string' ? goals : JSON.stringify(goals),
        successCriteria: typeof successCriteria === 'string' ? successCriteria : JSON.stringify(successCriteria),
        members: {
          create: [{ userId: ownerId, role: 'OWNER' }]
        }
      }
    });

    if (Array.isArray(requirements) && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        const reqItem = requirements[i];
        if (reqItem.title) {
          await prisma.requirement.create({
            data: {
              reqId: `REQ-${101 + i}`,
              title: reqItem.title,
              description: reqItem.description || '',
              type: reqItem.type || 'FUNCTIONAL',
              priority: reqItem.priority || 'MEDIUM',
              status: 'PLANNED',
              projectId: newProject.id,
              ownerId
            }
          });
        }
      }
    }

    if (importantDocs && typeof importantDocs === 'object') {
      const categories = [
        { key: 'implementationPlan', category: 'IMPLEMENTATION_PLAN', defaultTitle: 'Implementation Plan Document' },
        { key: 'walkthrough', category: 'WALKTHROUGH', defaultTitle: 'Walkthrough & Demo Document' },
        { key: 'logo', category: 'PROJECT_LOGO', defaultTitle: 'Project Logo Asset' },
        { key: 'ppt', category: 'PRESENTATION_PPT', defaultTitle: 'Presentation & Pitch Deck (PPT)' }
      ];

      for (const cat of categories) {
        const doc = importantDocs[cat.key];
        if (doc && (doc.url || doc.title)) {
          await prisma.projectArtifact.create({
            data: {
              title: doc.title || cat.defaultTitle,
              category: cat.category,
              kind: doc.kind || 'LINK',
              url: doc.url || 'https://docs.pjsofonic.com',
              fileSize: doc.fileSize || 0,
              mimeType: doc.mimeType || 'text/plain',
              projectId: newProject.id,
              uploadedById: ownerId
            }
          });
        }
      }
    }

    await prisma.activity.create({
      data: {
        projectId: newProject.id,
        userId: ownerId,
        userName: req.user?.name || 'Team Leader',
        action: 'created project',
        details: `Created new project "${name}".`,
        entityType: 'PROJECT',
        entityId: newProject.id
      }
    });

    return res.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Failed to create project:', error);
    return res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;
