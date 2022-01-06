import { CleanupHelper, effect, Effect, Quark, quark, quarkArray, Quarkify, read, write } from 'helpers/quarky';
import { BoulderData, Grade, Line, Name, Image, TrackData, Description, Difficulty, ClimbTechniques, SectorData, TopoData, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, UUID, Track, Boulder, Sector, Topo } from 'types';

export const quarkifyTopo = (topo: TopoData): Quark<Topo> => quark({
    ...topo,
    sectors: quarkArray(topo.sectors, quarkifySector),
    parkings: quarkArray(topo.parkings),
    access: quarkArray(topo.access)
});

const quarkifySector = (sector: SectorData): Quark<Sector> => quark({
    ...sector,
    boulders: quarkArray(sector.boulders, quarkifyBoulder),
    waypoints: quarkArray(sector.waypoints)
});

const quarkifyBoulder = (boulder: BoulderData): Quark<Boulder> => quark({
    ...boulder,
    tracks: quarkArray(boulder.tracks, quarkifyTrack)
});

const quarkifyTrack = (track: TrackData): Quark<Track> => quark({
    ...track,
    lines: quarkArray(track.lines),
    ratings: quarkArray(track.ratings)
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