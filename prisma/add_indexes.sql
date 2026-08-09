ALTER TABLE IF EXISTS "User" SET (schema_locked = false);
ALTER TABLE IF EXISTS "Workspace" SET (schema_locked = false);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "User_employeeId_key" ON "User"("employeeId");
CREATE UNIQUE INDEX IF NOT EXISTS "Workspace_slug_key" ON "Workspace"("slug");
