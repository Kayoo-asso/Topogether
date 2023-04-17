CREATE TABLE IF NOT EXISTS "repro" (
	"id" serial PRIMARY KEY NOT NULL,
	"xs" double precision[][][]
);

ALTER TABLE "lines" ALTER COLUMN "forbidden" SET DATA TYPE double precision[2][][];