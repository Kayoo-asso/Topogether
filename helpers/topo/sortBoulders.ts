import { splitArray } from "helpers";
import { Quark, QuarkIter } from "helpers/quarky";
import { Boulder, Sector, UUID } from "types";

export type BoulderOrder = {
    id: UUID,
    name: String,
    sectorId: UUID | String,
    index: number,
}

export function sortBoulders(boulders: Iterable<Boulder>, sectors: Iterable<Sector>): Map<UUID, number> {
    let idx = 1;
    let map: Map<UUID, number> = new Map();
    for (const sector of sectors) {
        for (const boulderId of sector.boulders) {
            map.set(boulderId, idx++)
        }
    }
    for (const boulder of boulders) {
        if (!map.has(boulder.id)) {
            map.set(boulder.id, idx++);
        }
    }
    return map;
} 

export const getOrderIndexes = (boulders: QuarkIter<Quark<Boulder>>, sectors: QuarkIter<Quark<Sector>>): BoulderOrder[] => {
    const boulderIndexes = [];
    const bouldersIdInSectors = sectors.toArray().map(s => s().boulders).flat();
    const [bouldersIn, bouldersOut] = splitArray(boulders.toArray(), b => bouldersIdInSectors.includes(b().id))
    
    // Boulders in a sector
    for (const boulderQuark of bouldersIn) {
        const boulder = boulderQuark();
        const sectorOfBoulderIndex = sectors.toArray().findIndex(s => s().boulders.includes(boulder.id));
        if (sectorOfBoulderIndex > -1) {
            let lengthOfPreviousSectors = 0
            for (let i = 0; i < sectorOfBoulderIndex; i++) {
                const sector = sectors.toArray().at(i);
                if (sector) lengthOfPreviousSectors += sector().boulders.length;
            }
            const sectorOfBoulder = sectors.toArray().at(sectorOfBoulderIndex);
            const indexInSector = sectorOfBoulder!().boulders.findIndex(id => id === boulder.id);
            boulderIndexes.push({ 
                id: boulder.id,
                name: boulder.name,
                sectorId: sectorOfBoulder!().id,
                index: lengthOfPreviousSectors + indexInSector 
            });
        }
    }

    // Boulders without sectors
    let lengthOfAllSectors = bouldersIdInSectors.length;
    for (let i = 0; i < bouldersOut.length; i++) {
        const boulder = bouldersOut.at(i)!();
        boulderIndexes.push({ 
            id: boulder.id,
            name: boulder.name,
            sectorId: 'NONE',
            index: lengthOfAllSectors + i 
        })
    }

    return boulderIndexes;
}