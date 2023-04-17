CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

DO $$ BEGIN
 CREATE TYPE "contributor_role" AS ENUM('CONTRIBUTOR', 'ADMIN');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "difficulty" AS ENUM('good', 'ok', 'bad', 'dangerous');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "grades" AS ENUM('3', '4', '3+', '4+', '5a', '5a+', '5b', '5b+', '5c', '5c+', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+', '9a', '9a+', '9b', '9b+', '9c', '9c+', 'P');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "reception" AS ENUM('good', 'ok', 'bad');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "season" AS ENUM('winter', 'spring', 'summer', 'fall');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 CREATE TYPE "topo_status" AS ENUM('draft', 'submitted', 'validated');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "contributors" (
	"topo_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" contributor_role NOT NULL
);
ALTER TABLE "contributors" ADD CONSTRAINT "contributors_topo_id_user_id" PRIMARY KEY("topo_id","user_id");

CREATE TABLE IF NOT EXISTS "lines" (
	"id" uuid PRIMARY KEY NOT NULL,
	"index" integer NOT NULL,
	"points" double precision[][] NOT NULL,
	"forbidden" double precision[][][],
	"hand1" double precision[],
	"hand2" double precision[],
	"foot1" double precision[],
	"foot2" double precision[],
	"belays" double precision[][],
	"topo_id" uuid NOT NULL,
	"track_id" uuid NOT NULL,
	"image_id" uuid NOT NULL,
	"variant_id" uuid
);

CREATE TABLE IF NOT EXISTS "parkings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"spaces" integer NOT NULL,
	"location" Geometry(Polygon, 4326) NOT NULL,
	"description" text,
	"name" text,
	"image" jsonb,
	"topo_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "rock_likes" (
	"rock_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "rock_likes" ADD CONSTRAINT "rock_likes_rock_id_user_id" PRIMARY KEY("rock_id","user_id");

CREATE TABLE IF NOT EXISTS "rocks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" Geometry(Polygon, 4326) NOT NULL,
	"must_see" boolean DEFAULT false NOT NULL,
	"is_highball" boolean DEFAULT false NOT NULL,
	"orientation" integer DEFAULT 0 NOT NULL,
	"dangerous_descent" boolean DEFAULT false NOT NULL,
	"images" jsonb NOT NULL,
	"topo_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "sectors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"index" integer NOT NULL,
	"geometry" Geometry(Polygon, 4326) NOT NULL,
	"topoId" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "topo_accesses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"duration" double precision,
	"danger" text,
	"difficulty" difficulty,
	"steps" jsonb,
	"topo_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "topo_likes" (
	"topo_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "topo_likes" ADD CONSTRAINT "topo_likes_topo_id_user_id" PRIMARY KEY("topo_id","user_id");

CREATE TABLE IF NOT EXISTS "topos" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" topo_status NOT NULL,
	"trashed" boolean DEFAULT false,
	"type" integer NOT NULL,
	"location" Geometry(Polygon, 4326) NOT NULL,
	"rock_types" integer DEFAULT 0 NOT NULL,
	"best_season" season,
	"forbidden" boolean DEFAULT false NOT NULL,
	"old_gear" boolean DEFAULT false NOT NULL,
	"adapted_to_children" boolean DEFAULT false NOT NULL,
	"cleaned" date,
	"modified" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted" timestamp with time zone,
	"validated" timestamp with time zone,
	"closest_city" text,
	"description" text,
	"fauna_protection" text,
	"ethics" text,
	"danger" text,
	"altitude" double precision,
	"other_amenities" text,
	"image" jsonb,
	"creator_id" uuid,
	"validator_id" uuid
);

CREATE TABLE IF NOT EXISTS "track_variants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"grade" grades,
	"track_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "tracks" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"index" integer NOT NULL,
	"description" text,
	"height" double precision,
	"reception" reception,
	"anchors" integer,
	"must_see" boolean DEFAULT false NOT NULL,
	"is_traverse" boolean DEFAULT false NOT NULL,
	"is_sitting_start" boolean DEFAULT false NOT NULL,
	"is_multipitch" boolean DEFAULT false NOT NULL,
	"is_trad" boolean DEFAULT false NOT NULL,
	"has_mantle" boolean DEFAULT false NOT NULL,
	"spec" integer NOT NULL,
	"danger" integer NOT NULL,
	"topo_id" uuid NOT NULL,
	"boulder_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "waypoints" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" Geometry(Polygon, 4326) NOT NULL,
	"description" text,
	"image" jsonb,
	"topo_id" uuid NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "contributors" ADD CONSTRAINT "contributors_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "lines" ADD CONSTRAINT "lines_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "lines" ADD CONSTRAINT "lines_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "lines" ADD CONSTRAINT "lines_variant_id_track_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "track_variants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "parkings" ADD CONSTRAINT "parkings_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "rock_likes" ADD CONSTRAINT "rock_likes_rock_id_rocks_id_fk" FOREIGN KEY ("rock_id") REFERENCES "rocks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "rocks" ADD CONSTRAINT "rocks_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "sectors" ADD CONSTRAINT "sectors_topoId_topos_id_fk" FOREIGN KEY ("topoId") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "topo_accesses" ADD CONSTRAINT "topo_accesses_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "topo_likes" ADD CONSTRAINT "topo_likes_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "track_variants" ADD CONSTRAINT "track_variants_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_boulder_id_topos_id_fk" FOREIGN KEY ("boulder_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "waypoints" ADD CONSTRAINT "waypoints_topo_id_topos_id_fk" FOREIGN KEY ("topo_id") REFERENCES "topos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "topos_unique_name" ON "topos" ("name");