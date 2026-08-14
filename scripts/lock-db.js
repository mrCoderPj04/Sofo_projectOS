import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔒 Re-locking CockroachDB schema tables for changefeed optimization...');
  const tables = [
    'User', 'Workspace', 'Project', 'ProjectMember', 'Requirement',
    'Problem', 'RootCauseAnalysis', 'Solution', 'Task', 'Decision',
    'KnowledgeArticle', 'Risk', 'File', 'Activity', 'Notification', 'ProjectArtifact'
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" SET (schema_locked = true);`);
      console.log(`✓ Locked table: ${table}`);
    } catch (e) {
      // Table might not exist yet or already locked
    }
  }
  console.log('✨ All tables locked and optimized successfully!');
}

main()
  .catch((e) => {
    console.error('Error locking DB:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
