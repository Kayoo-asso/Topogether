import { drizzle } from "drizzle-orm/node-postgres";
import { neon, neonConfig} from "@neondatabase/serverless";
import { env } from "~/env.mjs";
import pg from "pg";

// neonConfig.fetchConnectionCache = true;

const pool = new pg.Pool({
	connectionString: env.PGURL,
  ssl: {rejectUnauthorized: false}
});
export const db = drizzle(pool);

export * from "./schema";

// Utility functions
export { count, countDistinct } from "./custom";
