import { Return } from "react-cool-dimensions";
import { getLightTopos, getTopo } from "./server/queries";

export interface Img {
	readonly id: UUID;
	readonly ratio: number;
	readonly placeholder?: string;
};

export interface TopoAccessStep {
	description: string;
	image?: Img;
}


export type LightTopo = Awaited<ReturnType<typeof getLightTopos>>[number];
export type TopoDoc = Exclude<Awaited<ReturnType<typeof getTopo>>, undefined>;
export type Topo = TopoDoc["topo"]
export type Sector = TopoDoc["sectors"][number]
export type Rock = TopoDoc["rocks"][number];
export type Track = TopoDoc["tracks"][number];

export type UUID = string & {
	readonly _isUUID: unique symbol;
};

export type GeoCoordinates = [lng: number, lat: number];

// === Bitflags ===
// Bitflags can only have up to 32 values
// JavaScript considers all number as 32-bit for bitwise operations

// Used to define helper functions that only operate on one of the bitflags
// Register new bitflags here
export type Bitflag = Amenities | RockTypes | TopoTypes | WaypointTypes | TrackDanger | TrackPersonnality | TrackStyle | HoldType | BodyPosition;

export const enum Amenities {
	None = 0,
	Toilets = 1 << 0,
	Waterspot = 1 << 1,
	Bins = 1 << 2,
	PicnicArea = 1 << 3,
	Shelter = 1 << 4,
	AdaptedToChildren = 1 << 5,
}

export const enum RockTypes {
	None = 0,
	Andesite = 1 << 0,
	Basalt = 1 << 1,
	Composite = 1 << 2,
	Conglomerate = 1 << 3,
	Chalk = 1 << 4,
	Dolerite = 1 << 5,
	Gabbro = 1 << 6,
	Gneiss = 1 << 7,
	Granite = 1 << 8,
	Gritstone = 1 << 9,
	Limestone = 1 << 10,
	Migmatite = 1 << 11,
	Molasse = 1 << 12,
	Porphyry = 1 << 13,
	Quartz = 1 << 14,
	Quartzite = 1 << 15,
	Rhyolite = 1 << 16,
	Sandstone = 1 << 17,
	Schist = 1 << 18,
	Serpentinite = 1 << 19,
	Trachyandesite = 1 << 20,
	Trachyte = 1 << 21,
	Tuff = 1 << 22,
	Volcanic = 1 << 23,
}

export const enum TopoTypes {
	None = 0,
	Artificial = 1 << 0,
	Boulder = 1 << 1,
	Cliff = 1 << 2,
	DeepWater = 1 << 3,
}

export const enum WaypointTypes {
	None = 0,
	Toilets = 1 << 0,
	Waterspot = 1 << 1,
	Bins = 1 << 2,
	PicnicArea = 1 << 3,
	Shelter = 1 << 4,
}

export const enum TrackDanger {
	None = 0,
	Engaged = 1 << 0,
	BadReception = 1 << 1,
	FallingRock = 1 << 2,
}

export type TrackSpec = TrackPersonnality | TrackStyle | HoldType | BodyPosition;

export const enum TrackPersonnality {
	None = 0,
	Power = 1 << 0,
	Resistance = 1 << 1,
	Precision = 1 << 2,
}

export const enum TrackStyle {
	Crack = 1 << 3,
	Dihedral = 1 << 4,
	Layback = 1 << 5,
	Overhang = 1 << 6,
	Roof = 1 << 7,
	Slab = 1 << 8,
	Traverse = 1 << 9,
}

export const enum HoldType {
	Adherence = 1 << 10,
	Crimp = 1 << 11,
	OneFinger = 1 << 12,
	Pinch = 1 << 13,
	Slopper = 1 << 14,
	TwoFingers = 1 << 15,
}

export const enum BodyPosition {
	DropKnee = 1 << 16,
	Dynamic = 1 << 17,
	HeelHook = 1 << 18,
	Kneebar = 1 << 19,
	ToeHook = 1 << 20,
}

// === ENUMS ===
// NEVER reorder the values of an enum, only add new values at the end.
// This is necessary to avoid a mismatch with existing values in the database.

export type Enum = Difficulty | Orientation | Reception;

export enum Difficulty {
	Good,
	OK,
	Bad,
	Dangerous,
}

export enum Reception {
	Good,
	OK,
	Dangerous,
	None,
}

export const enum Orientation {
	None,
	N,
	NE,
	E,
	SE,
	S,
	SW,
	W,
	NW,
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export enum Seasons {
	Winter,
	Spring,
	Summer,
	Autumn,
}

export enum TopoStatus {
	Draft,
	Submitted,
	Validated,
}

export const grades = [
	"3",
	"3+",
	"4",
	"4+",
	"5a",
	"5a+",
	"5b",
	"5b+",
	"5c",
	"5c+",
	"6a",
	"6a+",
	"6b",
	"6b+",
	"6c",
	"6c+",
	"7a",
	"7a+",
	"7b",
	"7b+",
	"7c",
	"7c+",
	"8a",
	"8a+",
	"8b",
	"8b+",
	"8c",
	"8c+",
	"9a",
	"9a+",
	"9b",
	"9b+",
	"9c",
	"9c+",
	"P",
] as const;
export type Grade = typeof grades[number];

export const gradeCategories = [3, 4, 5, 6, 7, 8, 9, "P"] as const; //"P" is for Project (the default grade, when it has not been settle yet)

export type GradeCategory = typeof gradeCategories[number];

export type MapToolEnum =
	| "ROCK"
	| "SECTOR"
	| "PARKING"
	| "WAYPOINT"
	| "DRAGMAP"
	| "TOPO"
	| undefined;

export type DrawerToolEnum =
	| "LINE_DRAWER"
	| "HAND_DEPARTURE_DRAWER"
	| "FOOT_DEPARTURE_DRAWER"
	| "FORBIDDEN_AREA_DRAWER"
	| "ERASER";

export type PointEnum =
	| "LINE_POINT"
	| "HAND_DEPARTURE_POINT"
	| "FOOT_DEPARTURE_POINT"
	| "FORBIDDEN_AREA_POINT";

export type AreaEnum = "FORBIDDEN_AREA";
