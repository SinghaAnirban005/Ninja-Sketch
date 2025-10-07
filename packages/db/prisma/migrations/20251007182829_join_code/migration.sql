/*
  Warnings:

  - A unique constraint covering the columns `[joinId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "joinId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Room_joinId_key" ON "public"."Room"("joinId");
