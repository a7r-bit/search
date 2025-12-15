-- CreateTable
CREATE TABLE "public"."directories" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "directories_parent_id_idx" ON "public"."directories"("parent_id");

-- AddForeignKey
ALTER TABLE "public"."directories" ADD CONSTRAINT "directories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."directories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
