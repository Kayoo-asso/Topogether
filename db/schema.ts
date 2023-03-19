import { uuid, text, integer, smallint, pgEnum, pgTable, foreignKey, index, boolean } from "drizzle-orm/pg-core";
import { point } from "./PgPoint";

const topoStatus = pgEnum("topo_status", ["draft", "submitted", "validated"]);
const season = pgEnum("season", ["winter", "spring", "summer", "fall"]);

const topos = pgTable("topos", {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    status: topoStatus("status").notNull(),

    location: point("location").notNull(),

    bestSeason: season("best_season"),
    forbidden: boolean("forbidden").notNull().default(false),
    oldGear: boolean("old_gear").notNull().default(false),
    adaptedToChildren: boolean("adapted_to_children").notNull().default(false)
})