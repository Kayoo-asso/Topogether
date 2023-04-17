CREATE TABLE IF NOT EXISTS "managers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"contact_name" text NOT NULL,
	"contact_phone" text,
	"contact_mail" text,
	"description" text,
	"address" text,
	"zip" integer,
	"city" text,
	"image" jsonb,
	"topo_id" uuid NOT NULL
);

ALTER TABLE "sectors" RENAME COLUMN "geometry" TO "path";
DO $$ BEGIN
 ALTER TABLE "managers" ADD CONSTRAINT "managers_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
