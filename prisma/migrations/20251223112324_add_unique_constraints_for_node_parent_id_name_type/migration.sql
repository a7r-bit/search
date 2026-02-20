/*
  Warnings:

  - A unique constraint covering the columns `[parent_id,name,type]` on the table `nodes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."nodes_parent_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "nodes_parent_id_name_type_key" ON "public"."nodes"("parent_id", "name", "type");
