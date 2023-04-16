ALTER TABLE "tracks" RENAME COLUMN "boulder_id" TO "rock_id";
DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_rock_id_rocks_id_fk" FOREIGN KEY ("rock_id") REFERENCES "rocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "tracks" DROP CONSTRAINT "tracks_boulder_id_topos_id_fk";
