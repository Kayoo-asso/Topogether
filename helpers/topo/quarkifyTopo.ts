import { Quark, quark, QuarkArray } from 'helpers/quarky';
import { sync } from 'helpers/services';
import { DBConvert } from 'helpers/services/DBConvert';
import { BoulderData, TrackData, TopoData, UUID, Track, Boulder, Topo, Line, Sector, Manager, Waypoint, TopoAccess, Parking, DBLightTopo, LightTopo } from 'types';

export type TopoCreate = Omit<TopoData, 'liked' | 'sectors' | 'boulders' | 'waypoints' | 'accesses' | 'parkings' | 'managers' | 'lonelyBoulders'>;

export function createTopo(data: TopoCreate): Quark<Topo> {
    const dataWithArrays: TopoData = {
        ...data,
        liked: false,
        sectors: [],
        boulders: [],
        managers: [],
        waypoints: [],
        accesses: [],
        parkings: [],
        lonelyBoulders: [],
    }
    sync.topoCreate(DBConvert.topo(dataWithArrays))
    return quarkifyTopo(dataWithArrays, false);
}

export function editTopo(topo: TopoData): Quark<Topo> {
    return quarkifyTopo(topo, false);
}

function onBoulderDelete(boulder: Boulder, topoQuark: Quark<Topo>) {
    const topo = topoQuark();
    const aloneIdx = topo.lonelyBoulders.indexOf(boulder.id);
    if (aloneIdx >= 0) {
        topo.lonelyBoulders.splice(aloneIdx, 1);
        topoQuark.set({ ...topo }); // force update
        return;
    }
    for (const sectorQuark of topo.sectors.quarks()) {
        const sector = sectorQuark();
        const idx = sector.boulders.indexOf(boulder.id);
        if (idx >= 0) {
            sector.boulders.splice(idx, 1);
            sectorQuark.set({ ...sector }); // force update
            break;
        }
    }
    sync.boulderDelete(boulder);
}

function onSectorDelete(sector: Sector, topoQuark: Quark<Topo>) {
    topoQuark.set(prev => ({
        ...prev,
        lonelyBoulders: [...prev.lonelyBoulders, ...sector.boulders]
    }));
    sync.sectorDelete(sector);
}

export function quarkifyTopo(data: TopoData, save: boolean): Quark<Topo> {
    const topo: Topo = {
        ...data,
        liked: quark(data.liked, { onChange: (value) => sync.likeTopo(topo, value)}),
        sectors: quarkifySectors(data.sectors, data.id, save),
        boulders: quarkifyBoulders(data.boulders, data.id, save),
        waypoints: quarkifyWaypoints(data.waypoints, data.id, save),
        accesses: quarkifyTopoAccesses(data.accesses, data.id, save),
        parkings: quarkifyParkings(data.parkings, data.id, save),
        managers: quarkifyManagers(data.managers, data.id, save)
    };
    const onChange = (topo: Topo) => sync.topoUpdate(topo);
    const q = quark(topo, { onChange });
    // Bit of hackery so that the delete handlers of the QuarkArrays for boulders and sectors
    // can have a reference to the quark of the topo
    q().sectors.onDelete = (sector) => onSectorDelete(sector, q);
    q().boulders.onDelete = (boulder) => onBoulderDelete(boulder, q);

    if (save) onChange(topo);

    return q;
}

// terrible hack
export function quarkifyLightTopos(data: DBLightTopo[]): LightTopo[] {
    return data.map(t => ({
        ...t,
        liked: quark(t.liked, { onChange: (like) => sync.likeTopo(t, like) })
    }))
}

function quarkifyParkings(parkings: Parking[], topoId: UUID, save: boolean): QuarkArray<Parking> {
    const onChange = (parking: Parking) => sync.parkingUpdate(parking, topoId);
    if (save) parkings.forEach(onChange);

    return new QuarkArray(parkings, {
        quarkifier: (p) => quark(p, { onChange }),
        onAdd: onChange,
        onDelete: (parking) => sync.parkingDelete(parking)
    });
}

function quarkifyTopoAccesses(accesses: TopoAccess[], topoId: UUID, save: boolean): QuarkArray<TopoAccess> {
    const onChange = (access: TopoAccess) => sync.topoAccessUpdate(access, topoId);
    if (save) accesses.forEach(onChange);

    return new QuarkArray(accesses, {
        quarkifier: (a) => quark(a, { onChange }),
        onAdd: onChange,
        onDelete: (access) => sync.topoAccessDelete(access)
    });
}

function quarkifyWaypoints(waypoints: Waypoint[], topoId: UUID, save: boolean): QuarkArray<Waypoint> {
    const onChange = (waypoint: Waypoint) => sync.waypointUpdate(waypoint, topoId);
    if (save) waypoints.forEach(onChange);

    return new QuarkArray(waypoints, {
        quarkifier: (w) => quark(w, { onChange }),
        onAdd: onChange,
        onDelete: (waypoint) => sync.waypointDelete(waypoint)
    });
}

function quarkifyManagers(managers: Manager[], topoId: UUID, save: boolean): QuarkArray<Manager> {
    const onChange = (manager: Manager) => sync.managerUpdate(manager, topoId);
    if (save) managers.forEach(onChange);

    return new QuarkArray(managers, {
        quarkifier: (s) => quark(s, { onChange }),
        onAdd: onChange,
        onDelete: (manager) => sync.managerDelete(manager)
    });
}

function quarkifySectors(sectors: Sector[], topoId: UUID, save: boolean): QuarkArray<Sector> {
    const onChange = (sector: Sector) => sync.sectorUpdate(sector, topoId);
    if (save) sectors.forEach(onChange);

    return new QuarkArray(sectors, {
        quarkifier: (s) => quark(s, { onChange }),
        onAdd: onChange,
        onDelete: (sector) => sync.sectorDelete(sector)
    });
}

function quarkifyBoulders(data: BoulderData[], topoId: UUID, save: boolean): QuarkArray<Boulder> {
    const onChange = (boulder: Boulder) => sync.boulderUpdate(boulder, topoId);
    const boulders: Boulder[] = data.map(boulder => ({
        ...boulder,
        liked: quark(boulder.liked, { onChange: (value) => sync.likeBoulder(boulder, value) }),
        tracks: quarkifyTracks(boulder.tracks, topoId, boulder.id, save),
    }));
    if (save) boulders.forEach(onChange);

    return new QuarkArray(boulders, {
        quarkifier: (b) => quark(b, { onChange }),
        onAdd: onChange,
        onDelete: (boulder) => sync.boulderDelete(boulder)
    });
}


function quarkifyTracks(data: TrackData[], topoId: UUID, boulderId: UUID, save: boolean): QuarkArray<Track> {
    const onChange = (track: Track) => sync.trackUpdate(track, topoId, boulderId);
    const tracks: Track[] = data.map(track => ({
        ...track,
        lines: quarkifyLines(track.lines, topoId, track.id, save),
        ratings: new QuarkArray()
    }));
    if (save) tracks.forEach(onChange);

    return new QuarkArray(tracks, {
        quarkifier: (t) => quark(t, { onChange }),
        onAdd: onChange,
        onDelete: (track) => sync.trackDelete(track)
    });
}

function quarkifyLines(lines: Line[], topoId: UUID, trackId: UUID, save: boolean): QuarkArray<Line> {
    const onChange = (line: Line) => sync.lineUpdate(line, topoId, trackId);
    if (save) lines.forEach(onChange);

    return new QuarkArray(lines, {
        quarkifier: (l) => quark(l, { onChange }),
        onAdd: onChange,
        onDelete: (line) => sync.lineDelete(line)
    });
}