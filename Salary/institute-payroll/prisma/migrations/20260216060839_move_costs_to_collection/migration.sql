/*
  Warnings:

  - You are about to drop the column `postalFeePerStudent` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `tuteCostPerStudent` on the `Class` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN "address" TEXT;
ALTER TABLE "Teacher" ADD COLUMN "image" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "feePerStudent" REAL NOT NULL DEFAULT 0,
    "instituteFeePercentage" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Class" ("createdAt", "feePerStudent", "id", "instituteFeePercentage", "name") SELECT "createdAt", "feePerStudent", "id", "instituteFeePercentage", "name" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE TABLE "new_DailyCollection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "tuteCostPerStudent" REAL NOT NULL DEFAULT 0,
    "postalFeePerStudent" REAL NOT NULL DEFAULT 0,
    "teacherId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyCollection_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DailyCollection_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_DailyCollection" ("amount", "classId", "createdAt", "date", "id", "studentCount", "teacherId") SELECT "amount", "classId", "createdAt", "date", "id", "studentCount", "teacherId" FROM "DailyCollection";
DROP TABLE "DailyCollection";
ALTER TABLE "new_DailyCollection" RENAME TO "DailyCollection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
