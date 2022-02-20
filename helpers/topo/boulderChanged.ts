import { polygonContains } from "helpers";
import { Quark } from "helpers/quarky";
import { GeoCoordinates, Topo, UUID } from "types";

export function boulderChanged(topoQuark: Quark<Topo>, boulderId: UUID, newLocation: GeoCoordinates) {
    const topo = topoQuark();
    let skipUpdate = false;
    let inSector = false;
    for (const sQ of topo.sectors.quarks()) {
        const sector = sQ();
        const idx = sector.boulders.indexOf(boulderId);
        if (idx >= 0) {
            // if the boulder is already in a sector and all is fine, we have nothing to do
            skipUpdate = polygonContains(sector.path, newLocation);
            inSector = true;
            // this means the boulder was in this sector but has now moved outside of it
            if (!skipUpdate) {
                // remove from sector
                sector.boulders.splice(idx, 1);
                sQ.set({ ...sector }); // trigger an update
            }
            break; // assumes the boulder is in a single sector
        }
    }
    if (!skipUpdate) {
        // add to the first sector that contains the boulder
        let found = false;
        for (const sQ of topo.sectors.quarks()) {
            const sector = sQ();
            if (polygonContains(sector.path, newLocation)) {
                found = true;
                sector.boulders.push(boulderId);
                sQ.set({ ...sector }); // trigger an update
                if (!inSector) {
                    topoQuark.set(t => ({
                        ...t,
                        lonelyBoulders: topo.lonelyBoulders.filter(id => id !== boulderId)
                    }))
                }
                break; // important
            }
        }
        if (!found && inSector) {
            topoQuark.set(t => ({
                ...t,
                lonelyBoulders: [...topo.lonelyBoulders, boulderId]
            }))
        }
    }

}