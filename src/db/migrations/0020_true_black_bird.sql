ALTER TABLE "rocks" ADD COLUMN "sector_id" uuid;
DO $$ BEGIN
 ALTER TABLE "rocks" ADD CONSTRAINT "rocks_sector_id_sectors_id_fk" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
