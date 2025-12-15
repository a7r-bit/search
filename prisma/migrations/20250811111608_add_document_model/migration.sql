-- CreateTable
CREATE TABLE "public"."documents" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "directory_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_directory_id_fkey" FOREIGN KEY ("directory_id") REFERENCES "public"."directories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
