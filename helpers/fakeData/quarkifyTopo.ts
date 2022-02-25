import { BoulderBuilderSlideagainstDesktop } from 'components';
import { CleanupHelper, effect, Effect, Quark, quark, QuarkArray } from 'helpers/quarky';
import { syncQuark } from 'helpers/quarky/quarky-sync';
import { BoulderData, Grade, Line, Name, Image, TrackData, Description, Difficulty, ClimbTechniques, SectorData, TopoData, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, UUID, Track, Boulder, Sector, Topo, BoulderDTO, TrackDTO } from 'types';

export function quarkifyTopo(topo: TopoData): Quark<Topo> {
    const topoQuark = quark<Topo>({
        ...topo,
        sectors: new QuarkArray(topo.sectors),
        boulders: new QuarkArray(topo.boulders.map(quarkifyBoulder), {
            onAdd: (boulder) => syncQuark<Boulder, BoulderDTO>(boulder.id, boulder, {
                export: getBoulderExport(topo.id),
                import: ({ topoId, ...dto }, boulder) => ({
                    ...boulder,
                    ...dto
                })
            }),
        }),
        waypoints: new QuarkArray(topo.waypoints),
        parkings: new QuarkArray(topo.parkings),
        accesses: new QuarkArray(topo.accesses),
        managers: new QuarkArray(topo.managers),
    });

    topoQuark().boulders.onDelete = (boulderQuark) => onBoulderDelete(boulderQuark(), topoQuark);
    return topoQuark;
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
}

const getBoulderExport = (topoId: UUID) => (boulder: Boulder): BoulderDTO => ({
    id: boulder.id,
    topoId,
    location: boulder.location,
    name: boulder.name,
    orderIndex: boulder.orderIndex,
    isHighball: boulder.isHighball,
    mustSee: boulder.mustSee,
    dangerousDescent: boulder.dangerousDescent
});

const getTrackExport = (boulderId: UUID) => (track: Track): TrackDTO => ({
    id: track.id,
    boulderId,
    index: track.index,
    name: track.name,
    description: track.description,
    height: track.height,
    grade: track.grade,
    anchors: track.anchors,
    techniques: track.techniques,
    reception: track.reception,
    orientation: track.orientation,
    isTraverse: track.isTraverse,
    isSittingStart: track.isSittingStart,
    mustSee: track.mustSee,
    hasMantle: track.hasMantle,
    creatorId: track.creatorId,
})

const quarkifyBoulder = (boulder: BoulderData): Boulder => ({
    ...boulder,
    tracks: new QuarkArray(boulder.tracks.map(quarkifyTrack), {
        onAdd: (track) => syncQuark<Track, TrackDTO>(track.id, track, {
            export: getTrackExport(boulder.id),
            // remove the boulderId
            import: ({ boulderId, ...dto }, track) => ({
                ...track,
                ...dto
            }),
        })
    })
});

const quarkifyTrack = (track: TrackData): Track => ({
    ...track,
    lines: new QuarkArray(track.lines, {
        onAdd: (line) => syncQuark(line.id, line)
    }),
    ratings: new QuarkArray(track.ratings, {
        onAdd: (rating) => syncQuark(rating.id, rating)
    })
});


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