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
	countDistinct,
	rocks,
} from "~/db";
import { InferModel, eq, sql } from "drizzle-orm";
import { UUID } from "types";
import { ProfileContent } from "components/organisms/user/ProfileContent";

const start = Date.now();
const parkingsAgg = db.$with("parkings_agg").as(
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

const tracksCount = db.$with("tracks_count").as(
	db
		.select({
			id: tracksTable.topoId,
			nbTracks: countDistinct(tracksTable.id).as("nb_tracks"),
		})
		.from(tracksTable)
		.groupBy(tracksTable.topoId)
);

const query = db
	.with(parkingsAgg, sectorsCount, rocksCount, tracksCount)
	.select({
		id: toposTable.id,
		name: toposTable.name,
		status: toposTable.status,
		location: toposTable.location,
		modified: toposTable.modified,
		submitted: toposTable.submitted,
		validated: toposTable.validated,
		// -> Add properties as needed here

		// Aggregated properties
		nbSectors: sectorsCount.nbSectors,
		nbRocks: rocksCount.nbRocks,
		nbTracks: tracksCount.nbTracks,
		parkingLocation: parkingsAgg.parkingLocation,
	})
	.from(toposTable)
	.leftJoin(parkingsAgg, eq(parkingsAgg.id, toposTable.id))
	.leftJoin(sectorsCount, eq(sectorsCount.id, toposTable.id))
	.leftJoin(rocksCount, eq(rocksCount.id, toposTable.id))
	.leftJoin(tracksCount, eq(tracksCount.id, toposTable.id));

console.log(query.toSQL().sql);
const result = await query;

const end = Date.now();
console.log(`Query took ${end - start}ms`);

process.exit(0);
