import { boulderChanged, sectorChanged } from "helpers";
import { Quark, QuarkArray, SelectQuarkNullable } from "helpers/quarky";
import { Boulder, GeoCoordinates, Image, Line, Name, Parking, SectorData, Topo, Track, TrackRating, UUID, Waypoint } from "types";
import { v4 } from "uuid";

export const createSector = (topoQuark: Quark<Topo>, creatingSector: GeoCoordinates[], boulderOrder: Map<UUID, number>) => {
    const topo = topoQuark();
    if (creatingSector.length > 2) {
      const newSector: SectorData = {
        id: v4(),
        index: topo.sectors.length,
        name: 'Nouveau secteur' as Name,
        path: [...creatingSector],
        boulders: []
      };
      console.log(topo.sectors);
      topo.sectors.push(newSector);
      console.log(topo.sectors);
      sectorChanged(topoQuark, newSector.id, boulderOrder);

      const newSectorQuark = topo.sectors.quarkAt(-1);
      return newSectorQuark;
    }
}
export const deleteSector = (topoQuark: Quark<Topo>, sector: Quark<SectorData>, selectedSector: SelectQuarkNullable<SectorData>) => {
  const topo = topoQuark();
  topoQuark.set(t => ({
    ...t,
    lonelyBoulders: topo.lonelyBoulders.concat(sector().boulders)
  }))
  topo.sectors.removeQuark(sector);
  if (selectedSector.quark() === sector) selectedSector.select(undefined);
}

export const createBoulder = (topoQuark: Quark<Topo>, location: GeoCoordinates, image?: Image) => {
    const topo = topoQuark();
    const orderIndex = topo.boulders.length;
    const newBoulder: Boulder = {
      id: v4(),
      name: `Bloc ${orderIndex + 1}` as Name,
      location,
      isHighball: false,
      mustSee: false,
      dangerousDescent: false,
      tracks: new QuarkArray(),
      images: image ? [image] : [],
    };
    topo.boulders.push(newBoulder);
    boulderChanged(topoQuark, newBoulder.id, newBoulder.location, true);

    const newBoulderQuark = topo.boulders.quarkAt(-1);
    return newBoulderQuark;
}
export const deleteBoulder = (topoQuark: Quark<Topo>, boulder: Quark<Boulder>, selectedBoulder: SelectQuarkNullable<Boulder>) => {
    topoQuark().boulders.removeQuark(boulder);
    if (selectedBoulder.quark() === boulder) selectedBoulder.select(undefined);
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
export const deleteParking = (topo: Topo, parking: Quark<Parking>, selectedParking: SelectQuarkNullable<Parking>) => {
    topo.parkings.removeQuark(parking);
    if (selectedParking.quark() === parking) selectedParking.select(undefined);
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
export const deleteWaypoint = (topo: Topo, waypoint: Quark<Waypoint>, selectedWaypoint: SelectQuarkNullable<Waypoint>) => {
    topo.waypoints.removeQuark(waypoint);
    if (selectedWaypoint.quark() === waypoint) selectedWaypoint.select(undefined);
}

export const createTrack = (boulder: Boulder, creatorId: UUID) => {
    const newTrack: Track = {
      id: v4(),
      creatorId: creatorId,
      index: boulder.tracks.length,
      name: 'Voie ' + (boulder.tracks.length+1) as Name,
      mustSee: false,
      isTraverse: false,
      isSittingStart: false,
      hasMantle: false,
      lines: new QuarkArray<Line>([]),
      ratings: new QuarkArray<TrackRating>([])
    }
    boulder.tracks.push(newTrack);
    const newTrackQuark = boulder.tracks.quarkAt(-1);
    return newTrackQuark;
}
export const deleteTrack = (boulder: Boulder, track: Quark<Track>, selectedTrack: SelectQuarkNullable<Track>) => {
    boulder.tracks.removeQuark(track);
    if (selectedTrack.quark() === track) selectedTrack.select(undefined);
}