import { NextResponse } from 'next/server';
import { analyzeProblemWithAI } from '@/lib/ai-engine';

export async function POST(request) {
  try {
    const { problemText, context } = await request.json();

    if (!problemText) {
      return NextResponse.json({ error: 'Problem description text is required' }, { status: 400 });
    }

    const aiAnalysis = await analyzeProblemWithAI(problemText, context);

    return NextResponse.json({
      success: true,
      analysis: aiAnalysis
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json({ error: 'Failed to run AI analysis' }, { status: 500 });
  }
}
