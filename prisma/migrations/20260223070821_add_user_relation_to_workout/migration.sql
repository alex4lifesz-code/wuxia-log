/*
  Warnings:

  - You are about to drop the column `duration` on the `SimplifiedWorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `SimplifiedWorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `sets` on the `SimplifiedWorkoutExercise` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `SimplifiedWorkoutExercise` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SimplifiedWorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "weight1" REAL,
    "reps1" INTEGER,
    "weight2" REAL,
    "reps2" INTEGER,
    "weight3" REAL,
    "reps3" INTEGER,
    "notes" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SimplifiedWorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SimplifiedWorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SimplifiedWorkoutExercise" ("createdAt", "exerciseId", "id", "notes", "order", "workoutId") SELECT "createdAt", "exerciseId", "id", "notes", "order", "workoutId" FROM "SimplifiedWorkoutExercise";
DROP TABLE "SimplifiedWorkoutExercise";
ALTER TABLE "new_SimplifiedWorkoutExercise" RENAME TO "SimplifiedWorkoutExercise";
CREATE TABLE "new_Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("createdAt", "date", "id", "name", "notes", "totalXP", "userId") SELECT "createdAt", "date", "id", "name", "notes", "totalXP", "userId" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
