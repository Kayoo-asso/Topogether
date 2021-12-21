// Bitflags can only have up to 32 values
// JavaScript considers all number as 32-bit for bitwise operations

// Used to define helper functions that only operate on one of the bitflags
// Register new bitflags here
export type Bitflag = ClimbTechniques | Amenities | RockTypes;

export enum ClimbTechniques {
    None           = 0,
    Aplat          = 1 << 0,
    Adherence      = 1 << 1,
    Bidoigt        = 1 << 2,
    Contrepointe   = 1 << 3,
    Dalle          = 1 << 4,
    Devers         = 1 << 5,
    Diedre         = 1 << 6,
    Drapeau        = 1 << 7,
    Dulfer         = 1 << 8,
    Dynamique      = 1 << 9,
    Epaule         = 1 << 10,
    Fissure        = 1 << 11,
    Genou          = 1 << 12,
    Inverse        = 1 << 13,
    Lolotte        = 1 << 14,
    PetitsPieds    = 1 << 15,
    Pince          = 1 << 16,
    Reglette       = 1 << 17,
    Retablissement = 1 << 18,
    Talon          = 1 << 19,
    Toit           = 1 << 20,
};

export enum Amenities {
    None              = 0,
    Toilets           = 1 << 0,
    Waterspot         = 1 << 1,
    Bins              = 1 << 2,
    PicnicArea        = 1 << 3,
    Shelter           = 1 << 4,
    AdaptedToChildren = 1 << 5,
};

export enum RockTypes {
    None           = 0,
    Andesite       = 1 << 0,
    Basalt         = 1 << 2,
    Composite      = 1 << 3,
    Conglomerate   = 1 << 4,
    Chalk          = 1 << 5,
    Dolerite       = 1 << 6,
    Gabbro         = 1 << 7,
    Gneiss         = 1 << 8,
    Granite        = 1 << 9,
    Gritstone      = 1 << 10,
    Limestone      = 1 << 11,
    Migmatite      = 1 << 12,
    Molasse        = 1 << 13,
    Porphyry       = 1 << 14,
    Quartz         = 1 << 15,
    Quartzite      = 1 << 16,
    Rhyolite       = 1 << 17,
    Sandstone      = 1 << 18,
    Schist         = 1 << 19,
    Serpentinite   = 1 << 20,
    Trachyandesite = 1 << 21,
    Trachyte       = 1 << 22,
    Tuff           = 1 << 23,
    Volcanic       = 1 << 24,
};