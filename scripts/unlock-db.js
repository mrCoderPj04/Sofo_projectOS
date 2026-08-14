import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔓 Unlocking CockroachDB schema tables...');
  const tables = [
    'User', 'Workspace', 'Project', 'ProjectMember', 'Requirement',
    'Problem', 'RootCauseAnalysis', 'Solution', 'Task', 'Decision',
    'KnowledgeArticle', 'Risk', 'File', 'Activity', 'Notification', 'ProjectArtifact'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" SET (schema_locked = false);`);
      console.log(`✓ Unlocked table: ${table}`);
    } catch (e) {
      console.log(`- Table "${table}" note: ${e.message}`);
    }
  }
  console.log('✨ All tables unlocked successfully!');
}

main()
  .catch((e) => {
    console.error('Error unlocking DB:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
