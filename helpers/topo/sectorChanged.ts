import { polygonContains } from "helpers";
import { Boulder, Topo, UUID } from "types";

export function sectorChanged(topo: Topo, sectorId: UUID, boulderOrder: Map<UUID, number>) {
    const sQ = topo.sectors.findQuark(x => x.id === sectorId)!;
    const sector = sQ();

    // We need different things from toAdd and toRemove for updating (see below)
    const toAdd: UUID[] = [];
    const toRemove: Boulder[] = [];
    const existing = new Set(sector.boulders);

    for (const boulder of topo.boulders) {
        const geoContains = polygonContains(sector.path, boulder.location);
        const arrayContains = existing.has(boulder.id);

        // The boulder is within the sector, but not in the array
        if (geoContains && !arrayContains) {
            toAdd.push(boulder.id);
        }
        // The boulder is in the array, but not within the sector anymore
        else if (arrayContains && !geoContains) {
            toRemove.push(boulder);
        }
    }

    // Add new boulders to this sector & remove them from other sectors
    if (toAdd.length > 0) {
        // Sort them according to their ordering numbers
        toAdd.sort((id1, id2) =>
            compareNbs(boulderOrder.get(id1)!, boulderOrder.get(id2)!)
        );

        // faster lookup while iterating over the sectors
        const addedSet = new Set(toAdd);
        for (const sQ of topo.sectors.quarks()) {
            const s = sQ();
            // skip the sector that just changed (probably not necessary but does not hurt)
            if (s.id === sectorId) continue;
            const newBoulders = s.boulders.filter(b => !addedSet.has(b));
            // only update the sector if some boulders have been removed
            if (newBoulders.length !== s.boulders.length) {
                sQ.set({ ...s, boulders: newBoulders })
            }
        }
    }

    // Remove boulders from this sector, and assign them to another sector if possible
    if (toRemove.length > 0) {
        // check for each removed boulder if it should be assigned to a new sector
        for (const removed of toRemove) {
            // remove from this sector
            existing.delete(removed.id)
            // try to add to another sector
            for (const sector of topo.sectors) {
                if (polygonContains(sector.path, removed.location)) {
                    sector.boulders.push(removed.id);
                    break; // only add to a single sector
                }
            }
        }
    }

    // Update the boulder list for this sector
    sQ.set({
        ...sector,
        boulders: [...existing, ...toAdd]
    });
}


// Returns -1 if a < b
// Returns 0 if a === b
// Returns 1 if a > b
const compareNbs = (a: number, b: number) => a < b ? -1 : a > b ? 1 : 0;