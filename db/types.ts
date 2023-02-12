import type { ColumnType } from "kysely";
import { Orientation, Reception, UUID } from "types";
import type {
	Amenities,
	RockTypes,
	TopoTypes,
	TrackSpec,
} from "types/Bitflags";

export type ContributorRole = "ADMIN" | "CONTRIBUTOR";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;

export type Grade =
	| "3"
	| "3+"
	| "4"
	| "4+"
	| "5a"
	| "5a+"
	| "5b"
	| "5b+"
	| "5c"
	| "5c+"
	| "6a"
	| "6a+"
	| "6b"
	| "6b+"
	| "6c"
	| "6c+"
	| "7a"
	| "7a+"
	| "7b"
	| "7b+"
	| "7c"
	| "7c+"
	| "8a"
	| "8a+"
	| "8b"
	| "8b+"
	| "8c"
	| "8c+"
	| "9a"
	| "9a+"
	| "9b"
	| "9b+"
	| "9c"
	| "9c+";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Point = [number, number];
export type Polygon = Array<Point>;

export interface Image {
	id: UUID;
	ratio: number;
	placeholder?: string;
}

export interface TopoAccessStep {
	description: string;
	image: Image;
}

// Used to force input types to be produced through the helper functions in `custom.ts`
// Example: you can only get an ImageInput through the `imageWrite` function
type InputMarker = {
	readonly __input__: unique symbol;
};

export type JsonInput<T> = T & InputMarker;
export type PointInput = Point & InputMarker;
export type PolygonInput = Polygon & InputMarker;

// For each column, we specify `ColumnType<SelectType, InsertType, UpdateType>`
// The `SelectType` is always `never`, to force the use of helper functions to get the data
type JsonColumn<T> = ColumnType<T, JsonInput<T>, JsonInput<T>>;
type PointColumn = ColumnType<Point, PointInput, PointInput>;
type PointColumnOptional = ColumnType<
	Point | null,
	PointInput | null,
	PointInput | null
>;
type PolygonColumn = ColumnType<Polygon, PolygonInput, PolygonInput>;

export interface BoulderLikes {
	boulderId: UUID;
	userId: UUID;
	created: Generated<Timestamp>;
}

export interface Boulders {
	id: UUID;
	location: PointColumn;
	name: string;
	isHighball: Generated<boolean>;
	mustSee: Generated<boolean>;
	dangerousDescent: Generated<boolean>;
	images: JsonColumn<Array<Image>>;
	topoId: UUID;
}

export interface Lines {
	id: UUID;
	index: number;
	points: number[];
	forbidden: number[][];
	hand1: PointColumnOptional;
	hand2: PointColumnOptional;
	foot1: PointColumnOptional;
	foot2: PointColumnOptional;
	imageId: UUID | null;
	topoId: UUID;
	trackId: UUID;
}

export interface Managers {
	id: UUID;
	name: string;
	contactName: string;
	contactPhone: string | null;
	contactMail: string | null;
	description: string | null;
	address: string | null;
	zip: number | null;
	city: string | null;
	topoId: UUID;
	image: JsonColumn<Image | null>;
}

export interface Parkings {
	id: UUID;
	spaces: number;
	location: string;
	name: string | null;
	description: string | null;
	topoId: string;
	image: JsonColumn<Image | null>;
}

export interface Sectors {
	id: UUID;
	index: number;
	name: string;
	path: PolygonColumn;
	boulders: UUID[];
	topoId: UUID;
}

export interface TopoAccesses {
	id: UUID;
	danger: string | null;
	difficulty: number | null;
	duration: number | null;
	steps: JsonColumn<Array<TopoAccessStep>>;
	topoId: UUID;
}

export interface TopoContributors {
	topoId: UUID;
	userId: UUID;
	role: ContributorRole;
}

export interface TopoLikes {
	topoId: UUID;
	userId: UUID;
	created: Generated<Timestamp>;
}

export interface Topos {
	id: UUID;
	name: string;
	status: number;
	location: PointColumn;
	forbidden: boolean;
	modified: Generated<Timestamp>;
	submitted: Timestamp | null;
	validated: Timestamp | null;
	amenities: Generated<Amenities>;
	rockTypes: Generated<RockTypes>;
	type: Generated<TopoTypes>;
	description: string | null;
	faunaProtection: string | null;
	ethics: string | null;
	danger: string | null;
	cleaned: Timestamp | null;
	altitude: number | null;
	closestCity: string | null;
	otherAmenities: string | null;
	lonelyBoulders: Generated<UUID[]>;
	image: JsonColumn<Image>;
	creatorId: UUID;
	validatorId: UUID | null;
}

export interface TrackRatings {
	id: UUID;
	finished: boolean;
	rating: number;
	comment: string | null;
	created: Generated<Timestamp>;
	modified: Generated<Timestamp>;
	topoId: UUID;
	trackId: UUID;
	authorId: UUID;
}

export interface Tracks {
	id: UUID;
	index: number;
	name: string | null;
	description: string | null;
	height: number | null;
	grade: Grade | null;
	orientation: Orientation | null;
	reception: Reception | null;
	anchors: number | null;
	spec: Generated<TrackSpec>;
	isTraverse: Generated<boolean>;
	isSittingStart: Generated<boolean>;
	mustSee: Generated<boolean>;
	hasMantle: Generated<boolean>;
	topoId: UUID;
	boulderId: UUID;
	creatorId: UUID;
}

export interface Waypoints {
	id: UUID;
	name: string;
	location: PointColumn;
	description: string | null;
	topoId: UUID;
	image: JsonColumn<Image | null>;
}

export interface DB {
	boulderLikes: BoulderLikes;
	boulders: Boulders;
	lines: Lines;
	managers: Managers;
	parkings: Parkings;
	sectors: Sectors;
	topoAccesses: TopoAccesses;
	topoContributors: TopoContributors;
	topoLikes: TopoLikes;
	topos: Topos;
	trackRatings: TrackRatings;
	tracks: Tracks;
	waypoints: Waypoints;
}
