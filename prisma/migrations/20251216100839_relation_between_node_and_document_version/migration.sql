/*
  Warnings:

  - You are about to drop the column `document_id` on the `document_versions` table. All the data in the column will be lost.
  - You are about to drop the column `documentDetailsNodeId` on the `nodes` table. All the data in the column will be lost.
  - You are about to drop the `document_details` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[version,node_id]` on the table `document_versions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `node_id` to the `document_versions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."document_details" DROP CONSTRAINT "document_details_node_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_versions" DROP CONSTRAINT "document_versions_document_id_fkey";

-- DropIndex
DROP INDEX "public"."document_versions_version_document_id_key";

-- AlterTable
ALTER TABLE "public"."document_versions" DROP COLUMN "document_id",
ADD COLUMN     "node_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "public"."nodes" DROP COLUMN "documentDetailsNodeId";

-- DropTable
DROP TABLE "public"."document_details";

-- CreateIndex
CREATE UNIQUE INDEX "document_versions_version_node_id_key" ON "public"."document_versions"("version", "node_id");

-- AddForeignKey
ALTER TABLE "public"."document_versions" ADD CONSTRAINT "document_versions_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
