import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params; // problemId
    const { fiveWhysData, causesData, confirmedRootCause, method = 'FIVE_WHYS' } = await request.json();

    const rca = await prisma.rootCauseAnalysis.upsert({
      where: { problemId: id },
      update: {
        method,
        fiveWhysData: typeof fiveWhysData === 'string' ? fiveWhysData : JSON.stringify(fiveWhysData || []),
        causesData: typeof causesData === 'string' ? causesData : JSON.stringify(causesData || []),
        confirmedRootCause
      },
      create: {
        problemId: id,
        method,
        fiveWhysData: typeof fiveWhysData === 'string' ? fiveWhysData : JSON.stringify(fiveWhysData || []),
        causesData: typeof causesData === 'string' ? causesData : JSON.stringify(causesData || []),
        confirmedRootCause
      }
    });

    // Update problem status if root cause confirmed
    if (confirmedRootCause) {
      await prisma.problem.update({
        where: { id },
        data: { status: 'ROOT_CAUSE_FOUND' }
      });
    }

    return NextResponse.json({ success: true, rca });
  } catch (error) {
    console.error('RCA save error:', error);
    return NextResponse.json({ error: 'Failed to update Root Cause Analysis' }, { status: 500 });
  }
}
