import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Purging all test and dummy data for Production Clean State...');

  // Delete all table contents in proper cascade order
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.file.deleteMany();
  await prisma.risk.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.task.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.rootCauseAnalysis.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ All test data, dummy projects, mock problems, and demo tasks successfully purged!');
  console.log('🚀 System is 100% clean and ready for Pjsofonic ERP production employees.');
}

main()
  .catch((e) => {
    console.error('❌ Error purging database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
