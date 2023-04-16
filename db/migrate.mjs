import { migrate } from "drizzle-orm/neon-serverless/migrator.js";
import { db } from "api/db";

console.log("-> Migrating...");

// this will automatically run needed migrations on the database
await migrate(db, { migrationsFolder: "./db/migrations" });

console.log("== DONE ==");
process.exit(0);
