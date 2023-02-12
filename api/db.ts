import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { env } from "env/server.mjs";
import type { DB } from "db/types";

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: env.DATABASE_URL,
			ssl: true,
		}),
	}),
});
