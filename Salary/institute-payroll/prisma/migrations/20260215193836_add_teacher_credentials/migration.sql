-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Teacher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Teacher" ("createdAt", "id", "name", "phone") SELECT "createdAt", "id", "name", "phone" FROM "Teacher";
DROP TABLE "Teacher";
ALTER TABLE "new_Teacher" RENAME TO "Teacher";
CREATE UNIQUE INDEX "Teacher_name_key" ON "Teacher"("name");
CREATE UNIQUE INDEX "Teacher_phone_key" ON "Teacher"("phone");
CREATE UNIQUE INDEX "Teacher_username_key" ON "Teacher"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
