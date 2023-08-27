import { InferModel, and, eq, sql } from "drizzle-orm";
import { Topo, UUID } from "~/types";
import {
	topoAccesses as accessesTable,
	contributors as contributorsTable,
	count,
	countDistinct,
	db,
	lines as linesTable,
	managers as managersTable,
	parkings as parkingsTable,
	rockLikes as rockLikesTable,
	rocks as rocksTable,
	sectors as sectorsTable,
	topoLikes as topoLikesTable,
	topos as toposTable,
	tracks,
	tracks as tracksTable,
	trackVariants as variantsTable,
	waypoints as waypointsTable,
} from "~/db";

type Grade = InferModel<typeof tracksTable>["grade"];

export async function getLightTopos({ status }: { status: Topo["status"] }) {
	const parkingLocation = db.$with("parkings_agg").as(
		db
			.select({
				// Workaround for SELECT DISTINCT ON, which is not yet supported by Drizzle
				// https://github.com/drizzle-team/drizzle-orm/issues/338
				id: sql<UUID>`DISTINCT ON (${parkingsTable.topoId}) ${parkingsTable.topoId}`.as(
					"parkings.topo_id"
				),
				// The `null` case represents the situation where there is no matching parking
				// in the JOIN below
				parkingLocation: sql<
					[number, number] | null
				>`ARRAY[ST_X(${parkingsTable.location}), ST_Y(${parkingsTable.location})]`.as(
					"parking_location"
				),
			})
			.from(parkingsTable)
			.orderBy(parkingsTable.topoId)
	);
	const sectorsCount = db.$with("sectors_count").as(
		db
			.select({
				id: sectorsTable.topoId,
				nbSectors: countDistinct(sectorsTable.id).as("nb_sectors"),
			})
			.from(sectorsTable)
			.groupBy(sectorsTable.topoId)
	);
	const rocksCount = db.$with("rocks_count").as(
		db
			.select({
				id: rocksTable.topoId,
				nbRocks: countDistinct(rocksTable.id).as("nb_rocks"),
			})
			.from(rocksTable)
			.groupBy(rocksTable.topoId)
	);

	const tracksAgg = db.$with("tracks_agg").as(
		db
			.select({
				id: tracksTable.topoId,
				nbTracks: countDistinct(tracksTable.id).as("nb_tracks"),
				allGrades: sql<Array<Grade> | null>`JSON_AGG(${tracksTable.grade})`.as(
					"all_grades"
				),
			})
			.from(tracksTable)
			.groupBy(tracksTable.topoId)
	);

	return db
		.with(parkingLocation, sectorsCount, rocksCount, tracksAgg)
		.select({
			id: toposTable.id,
			name: toposTable.name,
			status: toposTable.status,
			type: toposTable.type,
			location: toposTable.location,
			modified: toposTable.modified,
			submitted: toposTable.submitted,
			validated: toposTable.validated,
			adaptedToChildren: toposTable.adaptedToChildren,
			closestCity: toposTable.closestCity,
			description: toposTable.description,
			image: toposTable.image,
			creatorId: toposTable.creatorId,
			// -> Add properties as needed here

			// Aggregated properties
			// Need to coalesce to avoid nulls
			nbSectors: sql<number>`COALESCE(${sectorsCount.nbSectors}, 0)`,
			nbRocks: sql<number>`COALESCE(${rocksCount.nbRocks}, 0)`,
			nbTracks: sql<number>`COALESCE(${tracksAgg.nbTracks}, 0)`,
			allGrades: sql<
				Array<Grade | null>
			>`COALESCE(${tracksAgg.allGrades}, '[]')`,
			parkingLocation: parkingLocation.parkingLocation,
		})
		.from(toposTable)
		.leftJoin(parkingLocation, eq(parkingLocation.id, toposTable.id))
		.leftJoin(sectorsCount, eq(sectorsCount.id, toposTable.id))
		.leftJoin(rocksCount, eq(rocksCount.id, toposTable.id))
		.leftJoin(tracksAgg, eq(tracksAgg.id, toposTable.id))
		.where(eq(toposTable.status, status));
}

export async function getTopo(id: UUID, userId: UUID | undefined) {
	const [
		topoResult,
		managers,
		parkings,
		waypoints,
		sectors,
		topoAccesses,
		rocks,
		tracks,
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
			// .leftJoin(variantsTable, eq(tracksTable.id, variantsTable.id))
			.where(eq(tracksTable.topoId, id)),
		db.select().from(linesTable).where(eq(linesTable.topoId, id)),
		db.select().from(contributorsTable).where(eq(contributorsTable.topoId, id)),
	]);

	// The topo does not exist
	if (topoResult.length === 0) {
		return undefined;
	}

	const topo = topoResult[0];

	if (topo.trashed) {
		return undefined;
	}

	// Check if the user is allowed to see the topo.
	// Two cases:
	// - the topo is public (`status === "validated"`)
	// - the user is a contributor
	// If none of those are true, return `undefined`.
	const isContributor = !!contributors.find((c) => c.userId === userId);

	if (topo.status !== "validated" && !isContributor) {
		return undefined;
	}

	return {
		topo,
		managers,
		parkings,
		waypoints,
		sectors,
		accesses: topoAccesses,
		rocks,
		tracks,
		lines,
		contributors,
	};
}
