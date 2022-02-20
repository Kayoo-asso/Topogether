import { polygonContains } from "helpers";
import { GeoCoordinates, Topo, UUID } from "types";

export function boulderChanged(topo: Topo, boulderId: UUID, newLocation: GeoCoordinates) {
    let skipUpdate = false;
    for (const sQ of topo.sectors.quarks()) {
        const sector = sQ();
        const idx = sector.boulders.indexOf(boulderId);
        if (idx >= 0) {
            // if the boulder is already in a sector and all is fine, we have nothing to do
            skipUpdate = polygonContains(sector.path, newLocation);
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
        for (const sQ of topo.sectors.quarks()) {
            const sector = sQ();
            if (polygonContains(sector.path, newLocation)) {
                sector.boulders.push(boulderId);
                sQ.set({ ...sector }); // trigger an update
                break; // important
            }
        }
    }

}