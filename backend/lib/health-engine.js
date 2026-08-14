export function calculateProjectHealth({
  totalTasks = 0,
  completedTasks = 0,
  totalReqs = 0,
  verifiedReqs = 0,
  openProblems = 0,
  criticalProblems = 0,
  overdueTasks = 0,
  highRisks = 0
}) {
  let score = 100;
  const factors = [];

  if (criticalProblems > 0) {
    const penalty = criticalProblems * 20;
    score -= penalty;
    factors.push(`${criticalProblems} critical problem${criticalProblems > 1 ? 's' : ''}`);
  }

  if (openProblems > 0) {
    const penalty = Math.min(openProblems * 5, 25);
    score -= penalty;
    if (criticalProblems === 0) {
      factors.push(`${openProblems} open problem${openProblems > 1 ? 's' : ''}`);
    }
  }

  if (overdueTasks > 0) {
    const penalty = Math.min(overdueTasks * 8, 30);
    score -= penalty;
    factors.push(`${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}`);
  }

  if (highRisks > 0) {
    const penalty = Math.min(highRisks * 10, 20);
    score -= penalty;
    factors.push(`${highRisks} high-risk item${highRisks > 1 ? 's' : ''}`);
  }

  if (totalTasks > 0) {
    const taskRate = (completedTasks / totalTasks) * 100;
    if (taskRate < 40 && totalTasks > 3) {
      score -= 10;
    }
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let status = 'GREEN';
  let badgeLabel = 'Healthy';

  if (score < 50 || criticalProblems >= 2) {
    status = 'RED';
    badgeLabel = 'Critical';
  } else if (score < 80 || criticalProblems === 1 || openProblems >= 3 || overdueTasks >= 2) {
    status = 'YELLOW';
    badgeLabel = 'Needs Attention';
  }

  let explanation = '';
  if (factors.length === 0) {
    explanation = `Project health is optimal (${score}%). Work is progressing according to schedule with zero active critical risks.`;
  } else {
    explanation = `Project health is rated ${score}% (${badgeLabel}) because ${factors.join(', ')} are currently impacting progress.`;
  }

  return {
    score,
    status,
    badgeLabel,
    explanation,
    factors
  };
}
