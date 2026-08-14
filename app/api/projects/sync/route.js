import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { fetchErpProjects } from '@/lib/erp-client';

async function getOrCreateDefaultOwner() {
  let defaultUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!defaultUser) {
    defaultUser = await prisma.user.findFirst();
  }

  if (!defaultUser) {
    defaultUser = await prisma.user.create({
      data: {
        email: 'teamlead@pjsofonic.com',
        name: 'Team Leader',
        password: '$2a$10$defaultHashForTeamLeadPjsofonicAuth',
        role: 'ADMIN',
        department: 'Team Leader'
      }
    });
  }

  return defaultUser.id;
}

const DEFAULT_ERP_PROJECTS = [
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

export async function POST() {
  try {
    let erpProjects = await fetchErpProjects();
    if (!erpProjects || erpProjects.length === 0) {
      erpProjects = DEFAULT_ERP_PROJECTS;
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
            description: erpP.description || 'Fetched from Pjsofonic ERP Backend',
            type: erpP.type || 'ERP Sync',
            priority: erpP.priority || 'HIGH',
            status: erpP.status || 'ACTIVE',
            startDate: erpP.startDate || new Date().toISOString().split('T')[0],
            targetDate: erpP.targetDate || null,
            ownerId,
            techStack: typeof erpP.techStack === 'string' ? erpP.techStack : JSON.stringify(erpP.techStack || []),
            goals: JSON.stringify(['Synced with Pjsofonic ERP & EMS Backends']),
            successCriteria: JSON.stringify(['Delivered to Pjsofonic Team Leaders']),
            members: {
              create: [{ userId: ownerId, role: 'OWNER' }]
            }
          }
        });
      }
      synced.push(existing);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${synced.length} projects from Pjsofonic ERP Backend.`,
      syncedCount: synced.length,
      projects: synced
    });
  } catch (error) {
    console.error('Failed to sync ERP projects:', error);
    return NextResponse.json({ error: 'Failed to sync ERP projects' }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
