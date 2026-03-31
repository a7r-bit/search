/*
  Warnings:

  - You are about to drop the `_PermissionToRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[external_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'TECHNICIAN', 'ADMIN', 'OWNER');

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "external_id" TEXT;

-- AlterTable
ALTER TABLE "permissions" ADD COLUMN     "roles" "Role"[];

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role"[] DEFAULT ARRAY['USER']::"Role"[];

-- DropTable
DROP TABLE "_PermissionToRole";

-- DropTable
DROP TABLE "_RoleToUser";

-- DropTable
DROP TABLE "roles";

-- CreateIndex
CREATE UNIQUE INDEX "groups_external_id_key" ON "groups"("external_id");
