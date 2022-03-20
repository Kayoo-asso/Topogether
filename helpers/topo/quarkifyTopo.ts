import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';
import { Quark, quark, QuarkArray } from 'helpers/quarky';
import { sync } from 'helpers/services';
import { withCoalescedInvoke } from 'next/dist/lib/coalesced-function';
import { BoulderData, TrackData, TopoData, UUID, Track, Boulder, Topo, SectorData, Line, Sector, Manager, Waypoint, TopoAccess, Parking } from 'types';

export function quarkifyTopo(data: TopoData): Quark<Topo> {
    const topo: Topo = {
        ...data,
        sectors: quarkifySectors(data.sectors, data.id),
        boulders: quarkifyBoulders(data.boulders, data.id),
        waypoints: quarkifyWaypoints(data.waypoints, data.id),
        accesses: quarkifyTopoAccesses(data.accesses, data.id),
        parkings: quarkifyParkings(data.parkings, data.id),
        managers: quarkifyManagers(data.managers, data.id)
    };
    const onChange = (topo: Topo) => sync.topoUpdate(topo);
    const q = quark(topo, { onChange });
    // Bit of hackery so that the delete handlers of the QuarkArrays for boulders and sectors
    // can have a reference to the quark of the topo
    q().sectors.onDelete = (sector) => onSectorDelete(sector, q);
    q().boulders.onDelete = (boulder) => onBoulderDelete(boulder, q);

    return q;
}

export type TopoCreate = Omit<TopoData, 'sectors' | 'boulders' | 'waypoints' | 'accesses' | 'parkings' | 'managers' | 'lonelyBoulders'>;

export function createTopo(data: TopoCreate): Quark<Topo> {
    const dataWithArrays: TopoData = {
        ...data,
        sectors: [],
        boulders: [],
        managers: [],
        waypoints: [],
        accesses: [],
        parkings: [],
        lonelyBoulders: [],
    }
    sync.topoUpdate(dataWithArrays);
    return quarkifyTopo(dataWithArrays);
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


function quarkifyParkings(parkings: Parking[], topoId: UUID): QuarkArray<Parking> {
    const onChange = (parking: Parking) => sync.parkingUpdate(parking, topoId);
    return new QuarkArray(parkings, {
        quarkifier: (p) => quark(p, { onChange }),
        onAdd: onChange,
        onDelete: (parking) => sync.parkingDelete(parking)
    });
}

function quarkifyTopoAccesses(accesses: TopoAccess[], topoId: UUID): QuarkArray<TopoAccess> {
    const onChange = (access: TopoAccess) => sync.topoAccessUpdate(access, topoId);
    return new QuarkArray(accesses, {
        quarkifier: (a) => quark(a, { onChange }),
        onAdd: onChange,
        onDelete: (access) => sync.topoAccessDelete(access)
    });
}

function quarkifyWaypoints(waypoints: Waypoint[], topoId: UUID): QuarkArray<Waypoint> {
    const onChange = (waypoint: Waypoint) => sync.waypointUpdate(waypoint, topoId);
    return new QuarkArray(waypoints, {
        quarkifier: (w) => quark(w, { onChange }),
        onAdd: onChange,
        onDelete: (waypoint) => sync.waypointDelete(waypoint)
    });
}

function quarkifyManagers(managers: Manager[], topoId: UUID): QuarkArray<Manager> {
    const onChange = (manager: Manager) => sync.managerUpdate(manager, topoId);
    return new QuarkArray(managers, {
        quarkifier: (s) => quark(s, { onChange }),
        onAdd: onChange,
        onDelete: (manager) => sync.managerDelete(manager)
    });
}

function quarkifySectors(sectors: Sector[], topoId: UUID): QuarkArray<Sector> {
    const onChange = (sector: Sector) => sync.sectorUpdate(sector, topoId);
    return new QuarkArray(sectors, {
        quarkifier: (s) => quark(s, { onChange }),
        onAdd: onChange,
        onDelete: (sector) => sync.sectorDelete(sector)
    });
}

function quarkifyBoulders(data: BoulderData[], topoId: UUID): QuarkArray<Boulder> {
    const onChange = (boulder: Boulder) => sync.boulderUpdate(boulder, topoId);
    const boulders: Boulder[] = data.map(boulder => ({
        ...boulder,
        tracks: quarkifyTracks(boulder.tracks, topoId, boulder.id),
    }));
    return new QuarkArray(boulders, {
        quarkifier: (b) => quark(b, { onChange }),
        onAdd: onChange,
        onDelete: (boulder) => sync.boulderDelete(boulder)
    });
}


function quarkifyTracks(data: TrackData[], topoId: UUID, boulderId: UUID): QuarkArray<Track> {
    const onChange = (track: Track) => sync.trackUpdate(track, topoId, boulderId);
    const tracks: Track[] = data.map(track => ({
        ...track,
        lines: quarkifyLines(track.lines, topoId, track.id),
        ratings: new QuarkArray()
    }));
    return new QuarkArray(tracks, {
        quarkifier: (t) => quark(t, { onChange }),
        onAdd: onChange,
        onDelete: (track) => sync.bouderDelete(track)
    });
}

function quarkifyLines(lines: Line[], topoId: UUID, trackId: UUID): QuarkArray<Line> {
    const onChange = (line: Line) => sync.lineUpdate(line, topoId, trackId);
    return new QuarkArray(lines, {
        quarkifier: (l) => quark(l, { onChange }),
        onAdd: onChange,
        onDelete: (line) => sync.lineDelete(line)
    });
}



// function enableSync(topoQuark: Quarkify<TopoData, Entities>): Effect {
//     // not lazy
//     const root = effect(() => {
//         const topo = read(topoQuark);
//         // sync topo...
//         effect(() => {
//             const sectors = read(topo.sectors);
//             // compare to previous run for created / deleted sectors
//             // previous run should be stored in the parent effect? 

//             for (let i = 0; i < sectors.length; i++) {
//                 effect(() => {
//                     const sector = read(sectors[i]);
//                     // sync sector...

//                     effect(() => {
//                         const boulders = read(sector.boulders);
//                         // compare to previous run for created / deleted boulders

//                         for (let i = 0; i < boulders.length; i++) {
//                             effect(() => {
//                                 const boulder = read(boulders[i]);
//                             });
//                         }
//                     });
//                 })
//             }
//         })
//     });
//     return root;
// }

// function syncTopo(topoQuark: Quarkify<TopoData, Entities>, create: boolean): Effect {
//     return effect(() => {
//         const topo = read(topoQuark);
//         // send to ApiService
//     }, { lazy: !create });
// }