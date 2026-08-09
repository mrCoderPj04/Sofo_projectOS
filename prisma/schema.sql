-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Workspace" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "slug" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
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

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" STRING NOT NULL,
    "projectId" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "role" STRING NOT NULL DEFAULT 'DEVELOPER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
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

-- CreateTable
CREATE TABLE "Problem" (
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

-- CreateTable
CREATE TABLE "RootCauseAnalysis" (
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

-- CreateTable
CREATE TABLE "Solution" (
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

-- CreateTable
CREATE TABLE "Task" (
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

-- CreateTable
CREATE TABLE "Decision" (
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

-- CreateTable
CREATE TABLE "KnowledgeArticle" (
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

-- CreateTable
CREATE TABLE "Risk" (
    "id" STRING NOT NULL,
    "riskId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
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

-- CreateTable
CREATE TABLE "File" (
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

-- CreateTable
CREATE TABLE "Activity" (
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

-- CreateTable
CREATE TABLE "Notification" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "title" STRING NOT NULL,
    "message" STRING NOT NULL,
    "link" STRING,
    "read" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectArtifact" (
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

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RootCauseAnalysis_problemId_key" ON "RootCauseAnalysis"("problemId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RootCauseAnalysis" ADD CONSTRAINT "RootCauseAnalysis_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solution" ADD CONSTRAINT "Solution_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Risk" ADD CONSTRAINT "Risk_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArtifact" ADD CONSTRAINT "ProjectArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArtifact" ADD CONSTRAINT "ProjectArtifact_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

