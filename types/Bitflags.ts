// Bitflags can only have up to 32 values
// JavaScript considers all number as 32-bit for bitwise operations

// Used to define helper functions that only operate on one of the bitflags
// Register new bitflags here
export type Bitflag = Amenities | RockTypes | TopoTypes | TrackDanger | TrackStyle | HoldType | BodyPosition;

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


export type TrackSpec = TrackDanger | TrackStyle | HoldType | BodyPosition;


export const enum TrackDanger {
	None = 0,
	BadReception = 1 << 0,
	High = 1 << 1,
	LooseRock = 1 << 2,
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