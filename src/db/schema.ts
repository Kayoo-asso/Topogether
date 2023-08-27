import {
	PgEnum,
	boolean,
	date,
	doublePrecision,
	foreignKey,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	smallint,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import {
	Img,
	Orientation,
	RockTypes,
	TopoAccessStep,
	TopoTypes,
	TrackDanger,
	TrackSpec,
	UUID,
	grades,
} from "~/types";
import { bitflag, jsonb, point, polygon, uuid, xy, xyArray } from "./custom";

// IMPORTANT: any object that should be created in the database
// should be *exported* from this file.
// Example: calling pgTable or pgEnum without exporting the result means Drizzle Kit
// will NOT create the corresponding object in the database.

export const topoStatus = pgEnum("topo_status", [
	"draft",
	"submitted",
	"validated",
]);
export const season = pgEnum("season", ["winter", "spring", "summer", "fall"]);

export const difficulty = pgEnum("difficulty", [
	"good",
	"ok",
	"bad",
	"dangerous",
]);
export const reception = pgEnum("reception", ["good", "ok", "dangerous"]);
export const grade = pgEnum("grades", grades);

const timestamptz = (name: string) => timestamp(name, { withTimezone: true });

export const topos = pgTable(
	"topos",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		status: topoStatus("status").notNull(),
		type: bitflag<TopoTypes>("type").notNull(),
		trashed: boolean("trashed").notNull().default(false),

		location: point("location").notNull(),
		rockTypes: bitflag<RockTypes>("rock_types")
			.notNull()
			.default(RockTypes.None),

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
	},
	(topos) => {
		return {
			uniqueIdx: uniqueIndex("topos_unique_name").on(topos.name),
		};
	}
);


export const sectors = pgTable(
	"sectors",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		index: integer("index").notNull(),
		path: polygon("path").notNull(),
		topoId: uuid("topoId")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(sectors) => {
		return {
			topoIdx: index().on(sectors.topoId),
		};
	}
);

export const waypoints = pgTable(
	"waypoints",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		location: point("location").notNull(),
		description: text("description"),
		image: jsonb<Img>("image"),
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(waypoints) => {
		return {
			topoIdx: index().on(waypoints.topoId),
		};
	}
);

export const parkings = pgTable(
	"parkings",
	{
		id: uuid("id").primaryKey(),
		spaces: integer("spaces").notNull(),
		location: point("location").notNull(),
		description: text("description"),
		name: text("name"),
		image: jsonb<Img>("image"),
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(parkings) => {
		return {
			topoIdx: index().on(parkings.topoId),
		};
	}
);

export const managers = pgTable(
	"managers",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		contactName: text("contact_name").notNull(),
		contactPhone: text("contact_phone"),
		contactMail: text("contact_mail"),
		description: text("description"),
		address: text("address"),
		zip: integer("zip"),
		city: text("city"),
		image: jsonb<Img>("image"),

		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(managers) => {
		return {
			topoIdx: index().on(managers.topoId),
		};
	}
);

export const topoAccesses = pgTable(
	"topo_accesses",
	{
		id: uuid("id").primaryKey(),
		duration: doublePrecision("duration"),
		danger: text("danger"),
		difficulty: difficulty("difficulty"),
		steps: jsonb<Array<TopoAccessStep>>("steps"),
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(topoAccesses) => {
		return {
			topoIdx: index().on(topoAccesses.topoId),
		};
	}
);

export const rocks = pgTable(
	"rocks",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		location: point("location").notNull(),
		mustSee: boolean("must_see").notNull().default(false),
		isHighball: boolean("is_highball").notNull().default(false),
		dangerousDescent: boolean("dangerous_descent").notNull().default(false),
		images: jsonb<Array<Img>>("images").notNull(),

		sectorId: uuid("sector_id").references(() => sectors.id, {
			onDelete: "set null",
		}),
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
	},
	(rocks) => {
		return {
			topoIdx: index().on(rocks.topoId),
		};
	}
);

export const tracks = pgTable(
	"tracks",
	{
		id: uuid("id").primaryKey(),
		name: text("name"),
		index: integer("index").notNull(),
		description: text("description"),

		grade: grade("grade"),
		height: doublePrecision("height"),
		reception: reception("reception"),
		anchors: integer("anchors"),

		orientation: bitflag<Orientation>("orientation")
			.notNull()
			.default(Orientation.None),
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
			.references(() => topos.id, { onDelete: "cascade" }),
		rockId: uuid("rock_id")
			.notNull()
			.references(() => rocks.id, { onDelete: "cascade" }),
	},
	(tracks) => {
		return {
			topoIdx: index().on(tracks.topoId),
		};
	}
);

export const trackVariants = pgTable(
	"track_variants",
	{
		id: uuid("id").primaryKey(),
		name: text("name"),
		grade: grade("grade"),
		trackId: uuid("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
	},
	(trackVariants) => {
		return {
			trackIdx: index().on(trackVariants.trackId),
		};
	}
);

export const lines = pgTable(
	"lines",
	{
		id: uuid("id").primaryKey(),
		index: integer("index").notNull(),
		points: xy("points").array().notNull(),
		// The custom `xyArray` type is a workaround for this issue:
		// https://github.com/drizzle-team/drizzle-orm/issues/460
		forbidden: xyArray("forbidden").array(),
		hand1: xy("hand1"),
		hand2: xy("hand2"),
		foot1: xy("foot1"),
		foot2: xy("foot2"),
		belays: xy("belays").array(),

		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
		trackId: uuid("track_id")
			.notNull()
			.references(() => tracks.id, { onDelete: "cascade" }),
		imageId: uuid("image_id").notNull(),
		variantId: uuid("variant_id").references(() => trackVariants.id, {
			onDelete: "cascade",
		}),
	},
	(lines) => {
		return {
			topoIdx: index().on(lines.topoId),
		};
	}
);

export const contributorRole = pgEnum("contributor_role", [
	"CONTRIBUTOR",
	"ADMIN",
]);

export const contributors = pgTable(
	"contributors",
	{
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		role: contributorRole("role").notNull(),
	},
	(contributors) => {
		return {
			primaryKey: primaryKey(contributors.topoId, contributors.userId),
		};
	}
);

export const topoLikes = pgTable(
	"topo_likes",
	{
		topoId: uuid("topo_id")
			.notNull()
			.references(() => topos.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		created: timestamptz("created").notNull().defaultNow(),
	},
	(topoLikes) => {
		return {
			primaryKey: primaryKey(topoLikes.topoId, topoLikes.userId),
		};
	}
);

export const rockLikes = pgTable(
	"rock_likes",
	{
		rockId: uuid("rock_id")
			.notNull()
			.references(() => rocks.id, { onDelete: "cascade" }),
		userId: uuid("user_id").notNull(),
		created: timestamptz("created").notNull().defaultNow(),
	},
	(rockLikes) => {
		return {
			primaryKey: primaryKey(rockLikes.rockId, rockLikes.userId),
		};
	}
);
