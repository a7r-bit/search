-- AlterTable
ALTER TABLE "node_accesses" ALTER COLUMN "permissions" SET DEFAULT ARRAY['READ']::"NodePermissionType"[];
