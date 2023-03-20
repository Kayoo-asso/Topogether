import {
	uuid,
	text,
	integer,
	smallint,
	pgEnum,
	pgTable,
	timestamp,
	foreignKey,
	index,
	boolean,
	date,
	doublePrecision,
	jsonb,
} from "drizzle-orm/pg-core";
import {
	RockTypes,
	TopoTypes,
	UUID,
	Img,
	Orientation,
	TopoAccessStep,
	grades,
    TrackSpec,
    TrackDanger,
} from "types";
import { bitflag } from "./BitflagColumn";
import { point, polygon } from "./custom";

const topoStatus = pgEnum("topo_status", ["draft", "submitted", "validated"]);
const season = pgEnum("season", ["winter", "spring", "summer", "fall"]);
const difficulty = pgEnum("difficulty", ["good", "ok", "bad", "dangerous"]);
const reception = pgEnum("difficulty", ["good", "ok", "bad"]);
const pgGrade = pgEnum("grades", grades);

const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

export const topos = pgTable("topos", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	status: topoStatus("status").notNull(),
	type: bitflag<TopoTypes>("type").notNull(),

	location: point("location").notNull(),
	rockTypes: bitflag<RockTypes>("rock_types").notNull().default(RockTypes.None),

	bestSeason: season("best_season"),
	forbidden: boolean("forbidden").notNull().default(false),
	oldGear: boolean("old_gear").notNull().default(false),
	adaptedToChildren: boolean("adapted_to_children").notNull().default(false),

	cleaned: date("cleaned"),
	modified: timestamptz("modified").notNull().defaultNow(),
	submitted: timestamptz("submitted"),
	validated: timestamptz("validated"),

	closestCity: text("closest_city"),
	description: text("description"),
	faunaProtection: text("fauna_protection"),
	ethics: text("ethics"),
	danger: text("danger"),
	altitude: doublePrecision("altitude"),
	otherAmenities: text("other_amenities"),

	image: jsonb<Img>("image"),
	creatorId: uuid("creator_id"),
	validatorId: uuid("validator_id"),
});

export const sectors = pgTable("sectors", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	index: integer("index").notNull(),
	geometry: polygon("geometry").notNull(),
	topoId: uuid("topoId")
		.notNull()
		.references(() => topos.id),
});

export const waypoints = pgTable("waypoints", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	location: point("location").notNull(),
	description: text("description"),
	image: jsonb<Img>("image"),
	topoId: uuid("topo_id")
		.notNull()
		.references(() => topos.id),
});

export const parkings = pgTable("parkings", {
	id: uuid("id").primaryKey(),
	spaces: integer("spaces").notNull(),
	location: point("location").notNull(),
	description: text("description"),
	name: text("name"),
	image: jsonb<Img>("image"),
	topoId: uuid("topo_id")
		.notNull()
		.references(() => topos.id),
});

export const topoAccesses = pgTable("topo_accesses", {
	id: uuid("id").primaryKey(),
	duration: doublePrecision("duration"),
	danger: text("danger"),
	difficulty: difficulty("difficulty"),
	steps: jsonb<Array<TopoAccessStep>>("steps"),
	topoId: uuid("topo_id")
		.notNull()
		.references(() => topos.id),
});

export const rocks = pgTable("rocks", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	location: point("location").notNull(),
	mustSee: boolean("must_see").notNull().default(false),
	isHighball: boolean("is_highball").notNull().default(false),
	orientation: bitflag<Orientation>("orientation")
		.notNull()
		.default(Orientation.None),
	dangerousDescent: boolean("dangerous_descent").notNull().default(false),
	images: jsonb<Array<Img>>("images").notNull(),
	topoId: uuid("topo_id")
		.notNull()
		.references(() => topos.id),
});

export const tracks = pgTable("tracks", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	index: integer("index").notNull(),
	description: text("description"),
	height: doublePrecision("height"),
	reception: reception("reception"),
	anchors: integer("anchors"),
	mustSee: boolean("must_see").notNull().default(false),
	isTraverse: boolean("is_traverse").notNull().default(false),
	isSittingStart: boolean("is_sitting_start").notNull().default(false),
	isMultipitch: boolean("is_multipitch").notNull().default(false),
	isTrad: boolean("is_trad").notNull().default(false),
	hasMantle: boolean("has_mantle").notNull().default(false),

    spec: bitflag<TrackSpec>("spec").notNull(),
    dangers: bitflag<TrackDanger>("danger").notNull(),

	topoId: uuid("topo_id")
		.notNull()
		.references(() => topos.id),
	boulderId: uuid("boulder_id")
		.notNull()
		.references(() => topos.id),
});

export const trackVariants = pgTable("track_variants", {
    name: text("name"),
    grade: pgGrade("grade"),
})