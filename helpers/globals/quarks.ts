import { Quark, StateSetter, useQuark } from "helpers";
import { TrackHTMLAttributes } from "react";
import { Boulder, GeoCoordinates, Image, Line, Name, Parking, Sector, StringBetween, Topo, TopoAccess, TopoType, Track, TrackRating, User, UUID, Waypoint } from "types";


export const quarks = {
    topo: new Map<UUID, Quark<Topo>>(),
    sectors: new Map<UUID, Quark<Sector>>(),
    boulders: new Map<UUID, Quark<Boulder>>(),
    tracks: new Map<UUID, Quark<Track>>(),
    lines: new Map<UUID, Quark<Line>>(),
    access: new Map<UUID, Quark<TopoAccess>>(),

    // Maybe we don't need quarks for images, they should not change after upload?
    images: new Map<UUID, Quark<Image>>(),
    users: new Map<UUID, Quark<User>>(),
    ratings: new Map<UUID, Quark<TrackRating>>(),
}

export const useTopo = (id: UUID) =>
    useQuark(quarks.topo.get(id)!);

export const useAccess = (id: UUID) =>
    useQuark(quarks.access.get(id)!);

export const useSector = (id: UUID) =>
    useQuark(quarks.sectors.get(id)!);

export const useBoulder = (id: UUID) =>
    useQuark(quarks.boulders.get(id)!);

export const useTrack = (id: UUID) =>
    useQuark(quarks.tracks.get(id)!);

export const useTracksReadOnly = (trackIds: UUID[]): Track[] => {
    const result = new Array(trackIds.length);
    for (let i = 0; i < trackIds.length; i++) {
        result[i] = useTrack(trackIds[i])[0];
    }
    return result;
}

export const useLine = (id: UUID) =>
    useQuark(quarks.lines.get(id)!);

export const useUser = (id: UUID) =>
    useQuark(quarks.users.get(id)!);

// Should not be needed: images don't really change once uploaded
// export const useImage = (id: UUID) =>
//     useQuark(quarks.images.get(id)!);