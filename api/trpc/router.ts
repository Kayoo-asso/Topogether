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
} from "db";
import { router, procedure } from "./init";
import { z } from "zod";
import { InferModel, eq } from "drizzle-orm";
import { UUID } from "types";

// Intermediate types, used in the `getTopo` function below
type Track = InferModel<typeof tracksTable> & {
	variants: Array<InferModel<typeof variantsTable>>;
	lines: Array<InferModel<typeof linesTable>>;
};
type Rock = InferModel<typeof rocksTable> & {
	tracks: Array<Track>;
};

export const appRouter = router({
	getTopo: procedure.input(z.string().uuid()).query(async ({ input, ctx }) => {
		const id = input as UUID;
		const userId = ctx.user?.id;
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
			db
				.select()
				.from(contributorsTable)
				.where(eq(contributorsTable.topoId, id)),
		]);

		// The topo does not exist
		if (topoResult.length === 0) {
			return undefined;
		}
		const topo = topoResult[0];

		// Check if the user is allowed to see the topo.
		// Two cases:
		// - the topo is public (`status === "validated"`)
		// - the user is a contributor
		// If none of those are true, return `undefined`.
		const isContributor = !!contributors.find((c) => c.userId === userId);
		if (topo.status !== "validated" && !isContributor) {
			return undefined;
		}

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
				rockMap.get(tracks.id)!.tracks.push(newTrack);
				trackMap.set(tracks.id, newTrack);
			}
		}
		for (const line of lines) {
			trackMap.get(line.trackId)!.lines.push(line);
		}

		return {
			...topo,
			managers,
			parkings,
			waypoints,
			sectors,
			topoAccesses,
			rocks: Array.from(rockMap.values()),
		};
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
