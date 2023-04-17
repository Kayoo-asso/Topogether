ALTER TYPE "reception" ADD VALUE 'dangerous';
ALTER TABLE "tracks" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "tracks" ADD COLUMN "orientation" integer DEFAULT 0 NOT NULL;
ALTER TABLE "rocks" DROP COLUMN IF EXISTS "orientation";