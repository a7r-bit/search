/*
  Warnings:

  - A unique constraint covering the columns `[user_id,node_id]` on the table `liked_nodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "liked_nodes_user_id_node_id_key" ON "public"."liked_nodes"("user_id", "node_id");
