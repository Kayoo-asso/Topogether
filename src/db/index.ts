import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { env } from "~/env.mjs";

const pool = new Pool({
	connectionString: env.PGURL,
	password: env.PGPASSWORD,
});
export const db = drizzle(pool);

export * from "./schema";

// Utility functions
export { count, countDistinct } from "./custom";
