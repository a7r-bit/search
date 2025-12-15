-- CreateEnum
CREATE TYPE "public"."ConversionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'FAILED');

-- AlterTable
ALTER TABLE "public"."document_versions" ADD COLUMN     "conversion_status" "public"."ConversionStatus" NOT NULL DEFAULT 'PENDING';
