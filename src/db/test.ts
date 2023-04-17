import {
	db,
	lines,
	managers,
	parkings,
	rocks,
	sectors,
	topoAccesses,
	topos,
	trackVariants,
	tracks,
	waypoints,
} from "~/db";
import { eq } from "drizzle-orm";
import { UUID } from "types";

const id = "cc1c96b4-e73d-4632-8f04-7949e8e5f902" as UUID;
const start = Date.now();
const [
	topoRow,
	managerRows,
	parkingRows,
	waypointRows,
	sectorRows,
	topoAccessRows,
	rockRows,
	trackRows,
	lineRows,
] = await Promise.all([
	db.select().from(topos).where(eq(topos.id, id)),
	db.select().from(managers).where(eq(managers.id, id)),
	db.select().from(parkings).where(eq(parkings.id, id)),
	db.select().from(waypoints).where(eq(waypoints.id, id)),
	db.select().from(sectors).where(eq(sectors.topoId, id)),
	db.select().from(topoAccesses).where(eq(topoAccesses.topoId, id)),
	db.select().from(rocks).where(eq(rocks.topoId, id)),
	db
		.select()
		.from(tracks)
		.leftJoin(trackVariants, eq(tracks.id, trackVariants.id))
		.where(eq(tracks.topoId, id)),
	db.select().from(lines).where(eq(lines.topoId, id)),
]);

const end = Date.now();

console.log(`Query took ${end - start}ms`);
process.exit(0);
