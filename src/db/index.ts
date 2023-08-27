import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig} from "@neondatabase/serverless";
import { env } from "~/env.mjs";

neonConfig.fetchConnectionCache = true;
neonConfig.poolQueryViaFetch = true;

// const pool = new Pool({
// 	connectionString: env.PGURL,
// 	password: env.PGPASSWORD,
// });
export const db = drizzle(neon(env.PGURL));

export * from "./schema";

// Utility functions
export { count, countDistinct } from "./custom";
