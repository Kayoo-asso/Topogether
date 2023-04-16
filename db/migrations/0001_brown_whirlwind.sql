ALTER TABLE "parkings" ALTER COLUMN "location" SET DATA TYPE Geometry(Point, 4326);
ALTER TABLE "rocks" ALTER COLUMN "location" SET DATA TYPE Geometry(Point, 4326);
ALTER TABLE "topos" ALTER COLUMN "location" SET DATA TYPE Geometry(Point, 4326);
ALTER TABLE "waypoints" ALTER COLUMN "location" SET DATA TYPE Geometry(Point, 4326);