import { BoulderData, Line, Parking, SectorData, TopoData, TrackData, Waypoint } from "./Topo";
import { UUID } from "./UUID";

export type DTO<T, Refs extends keyof T, Ids extends string> = Omit<T, Refs> & {
    [K in Ids]: UUID
};

export type TopoDTO = Omit<TopoData, 'sectors' | 'parkings' | 'access' | 'image'> & {
    imageId?: UUID
};

export type SectorDTO = Omit<SectorData, 'boulders' | 'waypoints'> & {
    boulderIds: UUID[],
    waypointIds: UUID[]
}

export type LineDTO = Line & {
    trackId: UUID
};

export type TrackDTO = Omit<TrackData, 'lines' | 'creator' | 'ratings'> & {
    boulderId: UUID,
    creatorId: UUID
};

export type BoulderDTO = Omit<BoulderData, 'tracks' | 'images'> & {
    sectorId: UUID,
};

export type WaypointDTO = Waypoint & {
    sectorId: UUID
};

export type ParkingDTO = Parking & {
    topoId: UUID
};