// Bitflags can only have up to 32 values
// JavaScript considers all number as 32-bit for bitwise operations

// Used to define helper functions that only operate on one of the bitflags
// Register new bitflags here
export type Bitflag = ClimbTechniques | Amenities | RockTypes;

export const enum ClimbTechniques {
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

export const enum Amenities {
    None              = 0,
    Toilets           = 1 << 0,
    Waterspot         = 1 << 1,
    Bins              = 1 << 2,
    PicnicArea        = 1 << 3,
    Shelter           = 1 << 4,
    AdaptedToChildren = 1 << 5,
};

export const enum RockTypes {
    None           = 0,
    Andesite       = 1 << 0,
    Basalt         = 1 << 1,
    Composite      = 1 << 2,
    Conglomerate   = 1 << 3,
    Chalk          = 1 << 4,
    Dolerite       = 1 << 5,
    Gabbro         = 1 << 6,
    Gneiss         = 1 << 7,
    Granite        = 1 << 8,
    Gritstone      = 1 << 9,
    Limestone      = 1 << 10,
    Migmatite      = 1 << 11,
    Molasse        = 1 << 12,
    Porphyry       = 1 << 13,
    Quartz         = 1 << 14,
    Quartzite      = 1 << 15,
    Rhyolite       = 1 << 16,
    Sandstone      = 1 << 17,
    Schist         = 1 << 18,
    Serpentinite   = 1 << 19,
    Trachyandesite = 1 << 20,
    Trachyte       = 1 << 21,
    Tuff           = 1 << 22,
    Volcanic       = 1 << 23,
};