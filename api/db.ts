import { Kysely, PostgresDialect, sql } from "kysely";
import { env } from "env/server.mjs";
import type { DB } from "db/types";
import pg from "pg";

export function getDB<T>() {
	return new Kysely<T>({
		dialect: new PostgresDialect({
			pool: new pg.Pool({
				connectionString: env.DATABASE_URL,
				ssl: true,
			}),
		}),
	});
}

export const db = getDB<DB>();

db.selectFrom("boulders").select(sql`ST_AsGeoJSON(location)`.as(""));
