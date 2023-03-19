import { db } from "api/db";
import { sql } from "kysely";
import { UUID } from "types";
import { Kyselify } from "drizzle-orm/kysely";

async function topoQuery() {
	const query = await db
		.selectFrom("topos")
		.where("id", "=", "2970d1fe-a55b-40c1-9b05-a010ae864a8d" as UUID)
		.leftJoinLateral(
			(eb) =>
				eb
					.selectFrom("boulders")
					.selectAll()
					.whereRef("boulders.topoId", "=", "topos.id")
					.as("boulders"),
			(join) => join.onTrue()
		)
        .selectAll("topos")
        .select(sql``)
		.compile();
    console.log(query.sql)
}

topoQuery().then(() => console.log("DONE"))