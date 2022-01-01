import { apiService } from 'helpers/globals/apiService';
import { CleanupHelper, effect, Effect, quark, quarkArray, Quarkify, read, write } from 'helpers/quarky';
import { Boulder, Grade, Line, Name, Image, Track, Description, Difficulty, ClimbTechniques, Sector, Topo, Amenities, TopoStatus, TopoType, RockTypes, TopoAccess, UUID, Entities } from 'types';

export const quarkifyTopo = (topo: Topo): Quarkify<Topo, Entities> => quark({
    ...topo,
    sectors: quarkArray(topo.sectors, { quarkifier: quarkifySector }),
    parkings: quarkArray(topo.parkings),
    access: quarkArray(topo.access)
});

const quarkifySector = (sector: Sector): Quarkify<Sector, Entities> => quark({
    ...sector,
    boulders: quarkArray(sector.boulders, { quarkifier: quarkifyBoulder }),
    waypoints: quarkArray(sector.waypoints)
});

const quarkifyBoulder = (boulder: Boulder): Quarkify<Boulder, Entities> => quark({
    ...boulder,
    tracks: quarkArray(boulder.tracks, { quarkifier: quarkifyTrack }),
});

const quarkifyTrack = (track: Track): Quarkify<Track, Entities> => quark({
    ...track,
    lines: quarkArray(track.lines),
    ratings: quarkArray(track.ratings)
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