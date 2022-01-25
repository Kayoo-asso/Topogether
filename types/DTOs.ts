import { Boulder, BoulderData, Line, Manager, Parking, SectorData, TopoData, Track, TrackData, Waypoint } from "./Topo";
import { TrackRating, User } from "./User";
import { UUID } from "./Utils";

export type TopoDTO = Omit<TopoData, 'sectors' | 'parkings' | 'access' | 'image'> & {
    imageId?: UUID
};

export type SectorDTO = Omit<SectorData, 'boulders' | 'waypoints'> & {
    boulderIds: UUID[],
    waypointIds: UUID[]
};

export type BoulderDTO = Omit<Boulder, 'tracks' | 'images'> & {
    sectorId: UUID
};

export type TrackDTO = Omit<Track, 'lines' | 'ratings'> & {
    boulderId: UUID
};

export type LineDTO = Line & {
    trackId: UUID
};

export type TrackRatingDTO = TrackRating & {
    trackId: UUID
};

export type ParkingDTO = Omit<Parking, 'image'> & {
    topoId: UUID,
    imageId?: UUID,
}

export type WaypointDTO = Omit<Waypoint, 'image'> & {
    sectorId: UUID,
    imageId?: UUID,
}

export type UserDTO = Omit<User, 'image'> & {
    imageId?: UUID
}

export type ManagerDTO = Omit<Manager, 'image'> & {
    topoId: UUID,
    imageId?: UUID
}