import { NamedExoticComponent } from "react";
import { Boulder, BoulderData, Line, Manager, Parking, SectorData, TopoData, Track, TrackData, Waypoint } from "./Topo";
import { TrackRating, User } from "./User";
import { Name, UUID } from "./Utils";

export type TopoDTO = Omit<TopoData, 'sectors' | 'boulders' | 'waypoints' | 'parkings' | 'access' | 'image'> & {
    imageId?: UUID
};

export type SectorDTO = SectorData;

export type BoulderDTO = Omit<Boulder, 'tracks' | 'images'> & {
    topoId: UUID
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
    topoId: UUID,
    imageId?: UUID,
}


export type ManagerDTO = Omit<Manager, 'image'> & {
    topoId: UUID,
    imageId?: UUID
}