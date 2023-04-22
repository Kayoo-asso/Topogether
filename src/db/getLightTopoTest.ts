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
import { getLightTopos } from "~/server/queries";
import { InferModel, eq, sql } from "drizzle-orm";
import { UUID } from "types";
import { ProfileContent } from "components/organisms/user/ProfileContent";

const start = Date.now();
const result = await getLightTopos();

console.log(result.map((x) => ({ name: x.name, grades: x.allGrades })));
const end = Date.now();
console.log(`Query took ${end - start}ms`);

process.exit(0);
