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
} from "~/db";
import { InferModel, eq, sql } from "drizzle-orm";
import { UUID } from "types";

const id = "cc1c96b4-e73d-4632-8f04-7949e8e5f902" as UUID;
const lightTopo = await db
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
		nbSectors: countDistinct(sectorsTable.id),
		nbTracks: countDistinct(tracksTable.id),
		nbRocks: countDistinct(rocksTable.id),
		parkingLocation: sql`MAX(${parkingsTable.location})`,
	})
	.from(toposTable)
	.leftJoin(rocksTable, eq(rocksTable.topoId, toposTable.id))
	.leftJoin(tracksTable, eq(tracksTable.topoId, toposTable.id))
	.leftJoin(sectorsTable, eq(sectorsTable.topoId, toposTable.id))
	.leftJoin(parkingsTable, eq(parkingsTable.topoId, toposTable.id))
	.groupBy(toposTable.id)
	.where(eq(toposTable.id, id));

console.log(lightTopo);

process.exit(0);
