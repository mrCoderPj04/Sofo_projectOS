import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { calculateProjectHealth } from '@/lib/health-engine';

export async function GET(request) {
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

    return NextResponse.json({ projects: enriched });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    const body = await request.json();

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
      requirements = []
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    // Default owner fallback if unauthenticated demo mode
    let ownerId = session?.userId;
    if (!ownerId) {
      const defaultUser = await prisma.user.findFirst();
      ownerId = defaultUser?.id;
    }

    if (!ownerId) {
      return NextResponse.json({ error: 'User must be authenticated' }, { status: 401 });
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

    // Create initial requirements if submitted in wizard
    if (Array.isArray(requirements) && requirements.length > 0) {
      for (let i = 0; i < requirements.length; i++) {
        const req = requirements[i];
        if (req.title) {
          await prisma.requirement.create({
            data: {
              reqId: `REQ-${101 + i}`,
              title: req.title,
              description: req.description || '',
              type: req.type || 'FUNCTIONAL',
              priority: req.priority || 'MEDIUM',
              status: 'PLANNED',
              projectId: newProject.id,
              ownerId
            }
          });
        }
      }
    }

    // Save Important Required Docs & Artifacts
    const { importantDocs } = body;
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

    // Record activity log
    await prisma.activity.create({
      data: {
        projectId: newProject.id,
        userId: ownerId,
        userName: session?.name || 'Owner',
        action: 'created project',
        details: `Created new project "${name}".`,
        entityType: 'PROJECT',
        entityId: newProject.id
      }
    });

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
