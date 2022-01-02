import { apiService } from 'helpers/globals/apiService';
import { CleanupHelper, effect, Effect, quark, quarkArray, Quarkify, read, write } from 'helpers/quarky';
import { Boulder, Grade, Line, Name, Image, Track, Description, Difficulty, ClimbTechniques, Sector, Topo, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, UUID, Entities } from 'types';

export const quarkifyTopo = (topo: Topo): Quarkify<Topo, Entities> => quark({
    ...topo,
    sectors: topo.sectors.map(quarkifySector),
    parkings: topo.parkings.map(x => quark(x)),
    access: topo.access.map(x => quark(x))
});

const quarkifySector = (sector: Sector): Quarkify<Sector, Entities> => quark({
    ...sector,
    boulders: sector.boulders.map(quarkifyBoulder),
    waypoints: sector.waypoints.map(x => quark(x))
});

const quarkifyBoulder = (boulder: Boulder): Quarkify<Boulder, Entities> => quark({
    ...boulder,
    tracks: boulder.tracks.map(quarkifyTrack),
    images: boulder.images.map(x => quark(x))
});

const quarkifyTrack = (track: Track): Quarkify<Track, Entities> => quark({
    ...track,
    lines: track.lines.map(x => quark(x)),
    ratings: track.ratings.map(r => quark(r))
});


function enableSync(topoQuark: Quarkify<Topo, Entities>): Effect {
    // not lazy
    const root = effect(() => {
        const topo = read(topoQuark);
        // sync topo...
        effect(() => {
            const sectors = read(topo.sectors);
            // compare to previous run for created / deleted sectors
            // previous run should be stored in the parent effect? 

            for (let i = 0; i < sectors.length; i++) {
                effect(() => {
                    const sector = read(sectors[i]);
                    // sync sector...

                    effect(() => {
                        const boulders = read(sector.boulders);
                        // compare to previous run for created / deleted boulders

                        for (let i = 0; i < boulders.length; i++) {
                            effect(() => {
                                const boulder = read(boulders[i]);
                            });
                        }
                    });
                })
            }
        })
    });
    return root;
}

function syncTopo(topoQuark: Quarkify<Topo, Entities>, create: boolean): Effect {
    return effect(() => {
        const topo = read(topoQuark);
        // send to ApiService
    }, { lazy: !create });
}