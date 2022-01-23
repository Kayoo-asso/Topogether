import { CleanupHelper, effect, Effect, Quark, quark, QuarkArray } from 'helpers/quarky';
import { BoulderData, Grade, Line, Name, Image, TrackData, Description, Difficulty, ClimbTechniques, SectorData, TopoData, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, UUID, Track, Boulder, Sector, Topo } from 'types';

export const quarkifyTopo = (topo: TopoData): Quark<Topo> => quark<Topo>({
    ...topo,
    sectors: new QuarkArray(topo.sectors.map(quarkifySector)),
    parkings: new QuarkArray(topo.parkings),
    accesses: new QuarkArray(topo.accesses),
    managers: new QuarkArray(topo.managers),
});

const quarkifySector = (sector: SectorData): Sector => ({
    ...sector,
    boulders: new QuarkArray(sector.boulders.map(quarkifyBoulder)),
    waypoints: new QuarkArray(sector.waypoints)
});

const quarkifyBoulder = (boulder: BoulderData): Boulder => ({
    ...boulder,
    tracks: new QuarkArray(boulder.tracks.map(quarkifyTrack))
});

const quarkifyTrack = (track: TrackData): Track => ({
    ...track,
    lines: new QuarkArray(track.lines),
    ratings: new QuarkArray(track.ratings)
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