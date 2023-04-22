import { InferModel, and, eq, sql } from "drizzle-orm";
import { UUID } from "types";
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

export async function getLightTopos() {
	const parkingLocation = db.$with("parkings_agg").as(
		db
			.select({
				// Workaround for SELECT DISTINCT ON, which is not yet supported by Drizzle
				// https://github.com/drizzle-team/drizzle-orm/issues/338
				id: sql<UUID>`DISTINCT ON (${parkingsTable.topoId}) ${parkingsTable.topoId}`.as(
					"parkings.topo_id"
				),
				parkingLocation: sql<
					[number, number]
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
				allGrades: sql<Array<Grade>>`JSON_AGG(${tracksTable.grade})`.as(
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
			// -> Add properties as needed here

			// Aggregated properties
			nbSectors: sectorsCount.nbSectors,
			nbRocks: rocksCount.nbRocks,
			nbTracks: tracksAgg.nbTracks,
			allGrades: tracksAgg.allGrades,
			parkingLocation: parkingLocation.parkingLocation,
		})
		.from(toposTable)
		.leftJoin(parkingLocation, eq(parkingLocation.id, toposTable.id))
		.leftJoin(sectorsCount, eq(sectorsCount.id, toposTable.id))
		.leftJoin(rocksCount, eq(rocksCount.id, toposTable.id))
		.leftJoin(tracksAgg, eq(tracksAgg.id, toposTable.id));
}

export type LightTopo = Awaited<ReturnType<typeof getLightTopos>>[number];
