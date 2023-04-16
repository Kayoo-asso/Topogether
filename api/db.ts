import { drizzle } from "drizzle-orm/neon-serverless/index.js";

import { Pool } from "@neondatabase/serverless";
import { env } from "~/env.mjs";

const pool = new Pool({
	connectionString: env.PGURL,
	password: env.PGPASSWORD,
});
export const db = drizzle(pool, { logger: true });