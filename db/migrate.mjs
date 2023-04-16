import { drizzle } from "drizzle-orm/neon-serverless/index.js";
import { migrate } from "drizzle-orm/neon-serverless/migrator.js";

import { Pool } from "@neondatabase/serverless";

const pool = new Pool({
	connectionString: process.env.PGURL,
	password: process.env.PGPASSWORD,
});
const db = drizzle(pool);

console.log("-> Migrating...");

// this will automatically run needed migrations on the database
await migrate(db, { migrationsFolder: "./db/migrations" });

console.log("== DONE ==");
process.exit(0);
