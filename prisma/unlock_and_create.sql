ALTER TABLE IF EXISTS "User" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Workspace" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Project" SET (schema_locked = false);
ALTER TABLE IF EXISTS "ProjectMember" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Requirement" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Problem" SET (schema_locked = false);
ALTER TABLE IF EXISTS "RootCauseAnalysis" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Solution" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Task" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Decision" SET (schema_locked = false);
ALTER TABLE IF EXISTS "KnowledgeArticle" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Risk" SET (schema_locked = false);
ALTER TABLE IF EXISTS "File" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Activity" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Notification" SET (schema_locked = false);
ALTER TABLE IF EXISTS "ProjectArtifact" SET (schema_locked = false);

CREATE TABLE IF NOT EXISTS "User" (
    "id" STRING NOT NULL,
    "employeeId" STRING,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "role" STRING NOT NULL DEFAULT 'EMPLOYEE',
    "department" STRING DEFAULT 'Pjsofonic Engineering',
    "erpSystem" STRING NOT NULL DEFAULT 'Pjsofonic ERP',
    "isErpVerified" BOOL NOT NULL DEFAULT true,
    "avatarUrl" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Workspace" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Project" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,
    "type" STRING NOT NULL DEFAULT 'Software Development',
    "priority" STRING NOT NULL DEFAULT 'HIGH',
    "status" STRING NOT NULL DEFAULT 'ACTIVE',
    "startDate" STRING,
    "targetDate" STRING,
    "ownerId" STRING NOT NULL,
    "techStack" STRING NOT NULL DEFAULT '[]',
    "goals" STRING NOT NULL DEFAULT '[]',
    "successCriteria" STRING NOT NULL DEFAULT '[]',
    "healthStatus" STRING NOT NULL DEFAULT 'GREEN',
    "workspaceId" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectMember" (
    "id" STRING NOT NULL,
    "projectId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "role" STRING NOT NULL DEFAULT 'DEVELOPER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Requirement" (
    "id" STRING NOT NULL,
    "reqId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "type" STRING NOT NULL DEFAULT 'FUNCTIONAL',
    "priority" STRING NOT NULL DEFAULT 'MEDIUM',
    "status" STRING NOT NULL DEFAULT 'PLANNED',
    "acceptanceCriteria" STRING NOT NULL DEFAULT '[]',
    "ownerId" STRING,
    "dueDate" STRING,
    "projectId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Problem" (
    "id" STRING NOT NULL,
    "probId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "symptoms" STRING NOT NULL,
    "severity" STRING NOT NULL DEFAULT 'HIGH',
    "priority" STRING NOT NULL DEFAULT 'HIGH',
    "status" STRING NOT NULL DEFAULT 'IDENTIFIED',
    "impact" STRING NOT NULL DEFAULT 'High impact on service stability',
    "frequency" STRING NOT NULL DEFAULT 'Intermittent under load',
    "affectedModule" STRING NOT NULL DEFAULT 'Core Service',
    "reporterId" STRING,
    "ownerId" STRING,
    "targetResolutionDate" STRING,
    "projectId" STRING NOT NULL,
    "requirementId" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RootCauseAnalysis" (
    "id" STRING NOT NULL,
    "problemId" STRING NOT NULL,
    "method" STRING NOT NULL DEFAULT 'FIVE_WHYS',
    "fiveWhysData" STRING NOT NULL DEFAULT '[]',
    "causesData" STRING NOT NULL DEFAULT '[]',
    "confirmedRootCause" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RootCauseAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Solution" (
    "id" STRING NOT NULL,
    "solId" STRING NOT NULL,
    "problemId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "approach" STRING NOT NULL,
    "expectedOutcome" STRING NOT NULL,
    "complexity" STRING NOT NULL DEFAULT 'MEDIUM',
    "cost" STRING NOT NULL DEFAULT 'LOW',
    "risk" STRING NOT NULL DEFAULT 'LOW',
    "impact" STRING NOT NULL DEFAULT 'HIGH',
    "pros" STRING NOT NULL DEFAULT '[]',
    "cons" STRING NOT NULL DEFAULT '[]',
    "status" STRING NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Task" (
    "id" STRING NOT NULL,
    "taskId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "assigneeId" STRING,
    "priority" STRING NOT NULL DEFAULT 'MEDIUM',
    "status" STRING NOT NULL DEFAULT 'TODO',
    "startDate" STRING,
    "dueDate" STRING,
    "estimatedHours" FLOAT8 NOT NULL DEFAULT 0,
    "actualHours" FLOAT8 NOT NULL DEFAULT 0,
    "checklist" STRING NOT NULL DEFAULT '[]',
    "projectId" STRING NOT NULL,
    "requirementId" STRING,
    "problemId" STRING,
    "solutionId" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Decision" (
    "id" STRING NOT NULL,
    "decId" STRING NOT NULL,
    "decision" STRING NOT NULL,
    "context" STRING NOT NULL,
    "reason" STRING NOT NULL,
    "alternatives" STRING NOT NULL DEFAULT '[]',
    "chosenApproach" STRING NOT NULL,
    "impact" STRING NOT NULL,
    "decisionMaker" STRING NOT NULL,
    "date" STRING NOT NULL,
    "projectId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "KnowledgeArticle" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "category" STRING NOT NULL DEFAULT 'Technical Notes',
    "content" STRING NOT NULL,
    "tags" STRING NOT NULL DEFAULT '[]',
    "authorId" STRING,
    "projectId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KnowledgeArticle_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Risk" (
    "id" STRING NOT NULL,
    "riskId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "category" STRING NOT NULL DEFAULT 'TECHNICAL',
    "probability" STRING NOT NULL DEFAULT 'MEDIUM',
    "impact" STRING NOT NULL DEFAULT 'HIGH',
    "severity" STRING NOT NULL DEFAULT 'HIGH',
    "mitigation" STRING NOT NULL,
    "ownerId" STRING,
    "status" STRING NOT NULL DEFAULT 'OPEN',
    "dueDate" STRING,
    "projectId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Risk_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "File" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "size" INT4 NOT NULL,
    "mimeType" STRING NOT NULL,
    "path" STRING NOT NULL,
    "linkedEntityType" STRING,
    "linkedEntityId" STRING,
    "projectId" STRING NOT NULL,
    "uploadedById" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Activity" (
    "id" STRING NOT NULL,
    "projectId" STRING NOT NULL,
    "userId" STRING,
    "userName" STRING NOT NULL,
    "action" STRING NOT NULL,
    "details" STRING NOT NULL,
    "entityType" STRING NOT NULL,
    "entityId" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Notification" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "message" STRING NOT NULL,
    "link" STRING,
    "read" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProjectArtifact" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "category" STRING NOT NULL,
    "kind" STRING NOT NULL DEFAULT 'FILE',
    "url" STRING NOT NULL,
    "fileSize" INT4 DEFAULT 0,
    "mimeType" STRING DEFAULT 'application/octet-stream',
    "projectId" STRING NOT NULL,
    "uploadedById" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ProjectArtifact_pkey" PRIMARY KEY ("id")
);
