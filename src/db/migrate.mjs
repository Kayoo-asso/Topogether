import { migrate } from "drizzle-orm/neon-serverless/migrator.js";
import { drizzle } from "drizzle-orm/neon-serverless/index.js";

import { Pool } from "@neondatabase/serverless";
import { env } from "../env.mjs";

console.log("-> Migrating...");

const pool = new Pool({
	connectionString: env.PGURL,
	password: env.PGPASSWORD,
});
const db = drizzle(pool, { logger: true });

// this will automatically run needed migrations on the database
await migrate(db, { migrationsFolder: "./src/db/migrations" });

console.log("== DONE ==");
process.exit(0);
