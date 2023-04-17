import {
	db,
	topos as toposTable,
	sectors as sectorsTable,
	managers as managersTable,
	waypoints as waypointsTable,
	parkings as parkingsTable,
	topoAccesses as accessesTable,
	rocks as rocksTable,
	tracks as tracksTable,
	lines as linesTable,
	trackVariants as variantsTable,
	contributors as contributorsTable,
} from "~/db";
import { InferModel, eq } from "drizzle-orm";
import { UUID } from "types";

const id = "cc1c96b4-e73d-4632-8f04-7949e8e5f902" as UUID;

// Intermediate types, used in the `getTopo` function below
type Track = InferModel<typeof tracksTable> & {
	variants: Array<InferModel<typeof variantsTable>>;
	lines: Array<InferModel<typeof linesTable>>;
};
type Rock = InferModel<typeof rocksTable> & {
	tracks: Array<Track>;
};

const start = Date.now();
const [
	topoResult,
	managers,
	parkings,
	waypoints,
	sectors,
	topoAccesses,
	rocks,
	tracksAndVariants,
	lines,
	contributors,
] = await Promise.all([
	db.select().from(toposTable).where(eq(toposTable.id, id)),
	db.select().from(managersTable).where(eq(managersTable.id, id)),
	db.select().from(parkingsTable).where(eq(parkingsTable.id, id)),
	db.select().from(waypointsTable).where(eq(waypointsTable.id, id)),
	db.select().from(sectorsTable).where(eq(sectorsTable.topoId, id)),
	db.select().from(accessesTable).where(eq(accessesTable.topoId, id)),
	db.select().from(rocksTable).where(eq(rocksTable.topoId, id)),
	db
		.select()
		.from(tracksTable)
		.leftJoin(variantsTable, eq(tracksTable.id, variantsTable.id))
		.where(eq(tracksTable.topoId, id)),
	db.select().from(linesTable).where(eq(linesTable.topoId, id)),
	db.select().from(contributorsTable).where(eq(contributorsTable.topoId, id)),
]);

const topo = topoResult[0];

// Rocks, tracks and lines have a somewhat deep hierarchy
// We need to recreate the nested JSON manually.
// We use maps to quickly find them based on their ID, as we are iterating children.
const rockMap = new Map<UUID, Rock>();
const trackMap = new Map<UUID, Track>();

for (const r of rocks) {
	rockMap.set(r.id, { ...r, tracks: [] });
}

for (const { tracks, track_variants: variant } of tracksAndVariants) {
	const existing = trackMap.get(tracks.id);
	// In this case, we're just seeing a new variant of a track we already saw
	// We can just push the variant onto the array. We're using a single object
	// and a single `variants` array per track, just storing it in different places.
	if (existing && variant) {
		existing.variants.push(variant);
	} else {
		// We haven't seen this track before.
		// The trick here is that we add the track to the corresponding rock
		// & put the same object in `trackMap`.
		// That way, it's enough to mutate the object in trackMap when we find
		// variants or lines to add.
		const newTrack = {
			...tracks,
			variants: variant ? [variant] : [],
			lines: [],
		};
		rockMap.get(tracks.rockId)!.tracks.push(newTrack);
		trackMap.set(tracks.id, newTrack);
	}
}
for (const line of lines) {
	trackMap.get(line.trackId)!.lines.push(line);
}

const final = {
	...topo,
	managers,
	parkings,
	waypoints,
	sectors,
	topoAccesses,
	rocks: Array.from(rockMap.values()),
};
const end = Date.now();

console.log(`Query took ${end - start}ms`);
process.exit(0);
