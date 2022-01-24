import { Boulder, BoulderData, Line, Parking, SectorData, TopoData, Track, TrackData, Waypoint } from "./Topo";
import { UUID } from "./Utils";

export type DTO<T, Refs extends keyof T, Ids extends string> = Omit<T, Refs> & {
    [K in Ids]: UUID
};

export type TopoDTO = Omit<TopoData, 'sectors' | 'parkings' | 'access' | 'image'> & {
    imageId?: UUID
};

// === Sector ===

export type SectorDTO = Omit<SectorData, 'boulders' | 'waypoints'> & {
    boulderIds: UUID[],
    waypointIds: UUID[]
}

// === Boulder ===
export type BoulderCreate = Omit<Boulder, 'tracks' | 'images'> & {
    sectorId: UUID
};

export type BoulderUpdate = Omit<BoulderCreate, 'sectorId'>;


// === Track === 

export type TrackCreate = Omit<Track, 'lines' | 'ratings'> & {
    boulderId: UUID
};

export type TrackUpdate = Omit<TrackCreate, 'sectorId'>;

// === Line ===

export type LineCreate = Line & {
    trackId: UUID
};

export type LineUpdate = Omit<LineCreate, 'trackId'>


export type BoulderDTO = Omit<BoulderData, 'tracks' | 'images'> & {
    sectorId: UUID,
};

export type WaypointDTO = Waypoint & {
    sectorId: UUID
};

export type ParkingDTO = Parking & {
    topoId: UUID
};