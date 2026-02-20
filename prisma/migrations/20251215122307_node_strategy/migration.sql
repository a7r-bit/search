/*
  Warnings:

  - You are about to drop the `directories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liked_directory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NodeType" AS ENUM ('DIRECTORY', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "public"."directories" DROP CONSTRAINT "directories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."document_versions" DROP CONSTRAINT "document_versions_document_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."documents" DROP CONSTRAINT "documents_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."liked_directory" DROP CONSTRAINT "liked_directory_directory_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."liked_directory" DROP CONSTRAINT "liked_directory_user_id_fkey";

-- DropTable
DROP TABLE "public"."directories";

-- DropTable
DROP TABLE "public"."documents";

-- DropTable
DROP TABLE "public"."liked_directory";

-- CreateTable
CREATE TABLE "public"."nodes" (
    "id" UUID NOT NULL,
    "type" "public"."NodeType" NOT NULL,
    "parent_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "documentDetailsNodeId" UUID,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."document_details" (
    "node_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_details_pkey" PRIMARY KEY ("node_id")
);

-- CreateTable
CREATE TABLE "public"."liked_nodes" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "node_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liked_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "nodes_parent_id_idx" ON "public"."nodes"("parent_id");

-- CreateIndex
CREATE INDEX "nodes_type_idx" ON "public"."nodes"("type");

-- CreateIndex
CREATE UNIQUE INDEX "nodes_parent_id_name_key" ON "public"."nodes"("parent_id", "name");

-- AddForeignKey
ALTER TABLE "public"."nodes" ADD CONSTRAINT "nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_details" ADD CONSTRAINT "document_details_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."document_versions" ADD CONSTRAINT "document_versions_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "public"."document_details"("node_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liked_nodes" ADD CONSTRAINT "liked_nodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liked_nodes" ADD CONSTRAINT "liked_nodes_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
