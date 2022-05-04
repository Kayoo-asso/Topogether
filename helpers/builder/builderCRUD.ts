import { boulderChanged, sectorChanged } from "helpers";
import { quark, Quark, SelectQuarkNullable } from "helpers/quarky";
import { sync } from "helpers/services";
import { setupBoulder, setupTrack } from "helpers/topo";
import { Boulder, GeoCoordinates, Image, Name, Parking, SectorData, Topo, Track, UUID, Waypoint } from "types";
import { v4 } from "uuid";

export const createSector = (topoQuark: Quark<Topo>, creatingSector: GeoCoordinates[], boulderOrder: Map<UUID, number>) => {
    const topo = topoQuark();
    const newSector: SectorData = {
        id: v4(),
        index: topo.sectors.length,
        name: 'Nouveau secteur' as Name,
        path: [...creatingSector],
        boulders: []
    };
    topo.sectors.push(newSector);
    sectorChanged(topoQuark, newSector.id, boulderOrder);

    const newSectorQuark = topo.sectors.quarkAt(-1);
    return newSectorQuark;
}
export const deleteSector = (topoQuark: Quark<Topo>, toDeleteSector: SelectQuarkNullable<SectorData>, selectedSector: SelectQuarkNullable<SectorData>) => {
    const sectorQuark = toDeleteSector.quark();
    if (sectorQuark) {
        topoQuark().sectors.removeQuark(sectorQuark);
        toDeleteSector.select(undefined);
        if (selectedSector.quark() === sectorQuark) selectedSector.select(undefined);
    }
}

export const createBoulder = (topoQuark: Quark<Topo>, location: GeoCoordinates, image?: Image) => {
    const topo = topoQuark();
    const orderIndex = topo.boulders.length;
    // terrible hack around `liked` for now
    const newBoulder: Boulder = setupBoulder({
        id: v4(),
        name: `Bloc ${orderIndex + 1}` as Name,
        liked: undefined!,
        location,
        isHighball: false,
        mustSee: false,
        dangerousDescent: false,
        tracks: [],
        images: image ? [image] : [],
    });
    newBoulder.liked = quark<boolean>(false, { onChange: (value) => sync.likeBoulder(newBoulder, value) })
    topo.boulders.push(newBoulder);
    boulderChanged(topoQuark, newBoulder.id, newBoulder.location, true);

    const newBoulderQuark = topo.boulders.quarkAt(-1);
    return newBoulderQuark;
}
export const deleteBoulder = (topoQuark: Quark<Topo>, toDeleteBoulder: SelectQuarkNullable<Boulder>, selectedBoulder: SelectQuarkNullable<Boulder>) => {
    const boulderQuark = toDeleteBoulder.quark();
    if (boulderQuark) {
        topoQuark().boulders.removeQuark(boulderQuark);
        toDeleteBoulder.select(undefined);
        if (selectedBoulder.quark() === boulderQuark) selectedBoulder.select(undefined);
    }
}

export const createParking = (topo: Topo, location: GeoCoordinates, image?: Image) => {
    const newParking: Parking = {
        id: v4(),
        spaces: 0,
        name: `parking ${topo.parkings ? topo.parkings.length + 1 : '1'}` as Name,
        image: image,
        location,
    };
    topo.parkings.push(newParking);
    const newParkingQuark = topo.parkings.quarkAt(-1);
    return newParkingQuark;
}
export const deleteParking = (topo: Topo, toDeleteParking: SelectQuarkNullable<Parking>, selectedParking: SelectQuarkNullable<Parking>) => {
    const parkingQuark = toDeleteParking.quark();
    if (parkingQuark) {
        topo.parkings.removeQuark(parkingQuark);
        toDeleteParking.select(undefined);
        if (selectedParking.quark() === parkingQuark) selectedParking.select(undefined);
    }
}

export const createWaypoint = (topo: Topo, location: GeoCoordinates, image?: Image) => {
    const newWaypoint: Waypoint = {
        id: v4(),
        name: `point de repère ${topo.waypoints ? topo.waypoints.length + 1 : '1'}` as Name,
        image: image,
        location,
    };
    topo.waypoints.push(newWaypoint);
    const newWaypointQuark = topo.waypoints.quarkAt(-1);
    return newWaypointQuark;
}
export const deleteWaypoint = (topo: Topo, toDeleteWaypoint: SelectQuarkNullable<Waypoint>, selectedWaypoint: SelectQuarkNullable<Waypoint>) => {
    const waypointQuark = toDeleteWaypoint.quark();
    if (waypointQuark) {
        topo.waypoints.removeQuark(waypointQuark);
        toDeleteWaypoint.select(undefined);
        if (selectedWaypoint.quark() === waypointQuark) selectedWaypoint.select(undefined);
    }
}

export const createTrack = (boulder: Boulder, creatorId: UUID) => {
    const newTrack: Track = setupTrack({
        id: v4(),
        creatorId: creatorId,
        index: boulder.tracks.length,
        name: 'Voie ' + (boulder.tracks.length + 1) as Name,
        mustSee: false,
        isTraverse: false,
        isSittingStart: false,
        hasMantle: false,
        lines: [],
        ratings: []
    })
    boulder.tracks.push(newTrack);
    const newTrackQuark = boulder.tracks.quarkAt(-1);
    return newTrackQuark;
}
export const deleteTrack = (boulder: Boulder, track: Quark<Track>, selectedTrack: SelectQuarkNullable<Track>) => {
    boulder.tracks.removeQuark(track);
    if (selectedTrack.quark() === track) selectedTrack.select(undefined);
}