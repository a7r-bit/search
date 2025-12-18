-- DropForeignKey
ALTER TABLE "public"."document_versions" DROP CONSTRAINT "document_versions_node_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."liked_nodes" DROP CONSTRAINT "liked_nodes_node_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."liked_nodes" DROP CONSTRAINT "liked_nodes_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."document_versions" ADD CONSTRAINT "document_versions_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liked_nodes" ADD CONSTRAINT "liked_nodes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."liked_nodes" ADD CONSTRAINT "liked_nodes_node_id_fkey" FOREIGN KEY ("node_id") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
