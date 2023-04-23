import type { Quark, QuarkArray } from "helpers/quarky";
import type { Amenities, RockTypes, TopoTypes, TrackSpec } from "./Bitflags";
import type {
	Grade,
	LightGrade,
	Orientation,
	TopoStatus,
	Difficulty,
	Reception,
} from "./Enums";
import type { LineString, MultiLineString, Point, Position } from "./GeoJSON";
import type {
	UUID,
	GeoCoordinates,
	StringBetween,
	Name,
	Description,
	Email,
	NullableOptional,
} from "./Utils";
import type { ContributorRole, Profile, TrackRating } from "./User";
import type { Img } from "./Img";

export type Topo = Omit<
	TopoData,
	| "liked"
	| "sectors"
	| "boulders"
	| "waypoints"
	| "parkings"
	| "accesses"
	| "managers"
	| "contributors"
> & {
	liked: Quark<boolean>;
	sectors: QuarkArray<Sector>;
	boulders: QuarkArray<Boulder>;
	waypoints: QuarkArray<Waypoint>;
	parkings: QuarkArray<Parking>;
	accesses: QuarkArray<TopoAccess>;
	managers: QuarkArray<Manager>;
	contributors: QuarkArray<Contributor>;
};

export type Sector = SectorData;

export type Boulder = Omit<BoulderData, "tracks" | "liked"> & {
	liked: Quark<boolean>;
	tracks: QuarkArray<Track>;
};

export type Track = Omit<TrackData, "ratings" | "lines"> & {
	ratings: QuarkArray<TrackRating>;
	lines: QuarkArray<Line>;
};

export interface TopoData {
	readonly id: UUID;
	name: Name;
	status: TopoStatus;
	liked: boolean;
	type: TopoTypes;
	forbidden: boolean;

	// Date strings in ISO format
	// Convert into Date objects if needed
	modified: string;
	submitted?: string;
	validated?: string;
	// this one is about the physical spot
	cleaned?: string;

	location: GeoCoordinates;
	rockTypes: RockTypes;
	amenities: Amenities;

	// these are optional, in case the profile has been deleted
	// (or the topo has not yet been validated)
	creator?: Profile;
	validator?: Profile;
	image?: Img;

	closestCity?: Name;
	description?: Description;
	faunaProtection?: Description;
	ethics?: Description;
	danger?: Description;
	altitude?: number;
	otherAmenities?: Description;

	lonelyBoulders: UUID[];

	sectors: SectorData[];
	boulders: BoulderData[];
	waypoints: Waypoint[];
	parkings: Parking[];
	accesses: TopoAccess[];
	managers: Manager[];
	contributors: Contributor[];
}

export type DBTopo = NullableOptional<{
	id: UUID;
	name: Name;
	status: TopoStatus;
	location: Point;
	forbidden: boolean;

	// Timestamps, wrap them in a Date if needed.
	// these describe the topo data in the app
	modified: string;
	submitted?: string;
	validated?: string;
	// this one is about the physical place
	cleaned?: string;

	amenities: Amenities;
	rockTypes: RockTypes;

	type: TopoTypes;
	description?: Description;
	faunaProtection?: Description;
	ethics?: Description;
	danger?: Description;
	altitude?: number;
	closestCity?: Name;
	otherAmenities?: Description;

	lonelyBoulders: UUID[];

	// these can be null, in case the person's account is deleted
	creatorId?: UUID;
	validatorId?: UUID;
	image?: Img;
}>;

export interface LightTopoOld {
	id: UUID;
	name: Name;
	status: TopoStatus;
	liked: Quark<boolean>;
	location: GeoCoordinates;
	forbidden: boolean;

	modified: string;
	submitted?: string;
	validated?: string;

	amenities: Amenities;
	rockTypes: RockTypes;

	type: TopoTypes;
	description?: Description;
	altitude?: number;
	closestCity?: Name;

	image?: Img;
	creator?: Profile;

	parkingLocation?: GeoCoordinates;
	nbSectors: number;
	nbBoulders: number;
	nbTracks: number;
	// everything is optional here because that was much easier to write in SQL
	grades?: Partial<GradeHistogram>;
}

export type DBLightTopo = Omit<LightTopoOld, "liked"> & {
	liked: boolean;
};

export type GradeHistogram = {
	[K in LightGrade]: number;
};

export interface Contributor {
	readonly id: UUID;
	pseudo: Name;
	role: ContributorRole;
}

export interface Manager {
	readonly id: UUID;
	name: Name;
	contactName: Name;
	contactPhone?: StringBetween<1, 30>;
	contactMail?: Email;
	description?: Description;
	address?: Description;
	zip?: number;
	city?: Name;
	image?: Img;
}

export type DBManager = NullableOptional<{
	id: UUID;
	name: Name;
	contactName: Name;
	contactPhone?: StringBetween<1, 30>;
	contactMail?: Email;
	description?: Description;
	address?: Description;
	zip?: number;
	city?: Name;

	topoId: UUID;
	image?: Img;
}>;

export type DBContributor = NullableOptional<{
	topo_id: UUID;
	user_id: UUID;
	role: ContributorRole;
}>;

export type TopoAccess = {
	readonly id: UUID;
	danger?: Description;
	difficulty?: Difficulty;
	duration?: number;
	steps: TopoAccessStep[];
};

export interface TopoAccessStep {
	description: Description;
	image?: Img;
}

export type DBTopoAccess = NullableOptional<{
	id: UUID;
	danger?: Description;
	difficulty?: Difficulty;
	duration?: number;
	steps: TopoAccessStep[];

	topoId: UUID;
}>;

export interface Parking {
	readonly id: UUID;
	spaces: number;
	location: GeoCoordinates;
	name?: Name;
	description?: Description;
	image?: Img;
}

export type DBParking = NullableOptional<{
	id: UUID;
	spaces: number;
	location: Point;
	name?: Name;
	description?: Description;
	image?: Img;

	topoId: UUID;
}>;

export interface Waypoint {
	readonly id: UUID;
	name: Name;
	location: GeoCoordinates;
	description?: Description;
	image?: Img;
}

export type DBWaypoint = NullableOptional<{
	id: UUID;
	name: Name;
	location: Point;
	description?: Description;

	topoId: UUID;
	image?: Img;
}>;

export interface SectorData {
	readonly id: UUID;
	name: Name;
	path: GeoCoordinates[];
	index: number;

	boulders: UUID[];
}

export type DBSector = NullableOptional<{
	id: UUID;
	name: Name;
	path: LineString;
	index: number;
	boulders: UUID[];

	topoId: UUID;
}>;

export interface BoulderData {
	readonly id: UUID;
	location: GeoCoordinates;
	name: Name;
	liked: boolean;
	isHighball: boolean;
	mustSee: boolean;
	dangerousDescent: boolean;

	tracks: TrackData[];
	// can be cross-referenced by lines within each track
	images: Img[];
}

export type DBBoulder = NullableOptional<{
	id: UUID;
	location: Point;
	name: Name;
	isHighball: boolean;
	mustSee: boolean;
	dangerousDescent: boolean;
	images: Img[];

	topoId: UUID;
}>;

// Order defined by the x-coordinate of the first point of the first line
export interface TrackData {
	readonly id: UUID;
	index: number;

	name?: Name;
	description?: Description;
	height?: number;
	grade?: Grade;
	orientation?: Orientation;
	reception?: Reception;
	anchors?: number;
	spec: TrackSpec;

	isTraverse: boolean;
	isSittingStart: boolean;
	mustSee: boolean;
	hasMantle: boolean;

	lines: Line[];
	ratings: TrackRating[];
	// optional, if the creator's profile was deleted
	creatorId?: UUID;
}

export type DBTrack = NullableOptional<{
	id: UUID;
	index: number;

	name?: Name;
	description?: Description;
	height?: number;
	grade?: Grade;
	orientation?: Orientation;
	reception?: Reception;
	anchors?: number;

	isTraverse: boolean;
	isSittingStart: boolean;
	mustSee: boolean;
	hasMantle: boolean;
	spec: TrackSpec;

	topoId: UUID;
	boulderId: UUID;
	creatorId?: UUID;
}>;

export interface Line {
	readonly id: UUID;
	index: number;
	points: Position[];
	// list of polygons, assuming each LineCoords is closed
	forbidden?: GeoCoordinates[][];
	// Starting points = max 2 for hand, max 2 for feet
	// Could not find a way to represent an array of length <= 2 in TypeScript types
	hand1?: Position;
	hand2?: Position;
	foot1?: Position;
	foot2?: Position;

	// the images are provided with the boulder
	imageId: UUID;
}

export type DBLine = NullableOptional<{
	id: UUID;
	index: number;
	points: Position[];
	// list of polygons, assuming each LineString is closed
	forbidden?: MultiLineString;
	hand1?: Point;
	hand2?: Point;
	foot1?: Point;
	foot2?: Point;

	topoId: UUID;
	trackId: UUID;
	imageId: UUID;
}>;
