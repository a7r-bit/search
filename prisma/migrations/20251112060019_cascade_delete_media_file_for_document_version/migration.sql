-- DropForeignKey
ALTER TABLE "public"."media_file" DROP CONSTRAINT "media_file_document_version_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."media_file" ADD CONSTRAINT "media_file_document_version_id_fkey" FOREIGN KEY ("document_version_id") REFERENCES "public"."document_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
