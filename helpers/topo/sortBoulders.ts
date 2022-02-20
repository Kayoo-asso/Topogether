import { splitArray } from "helpers";
import { Quark, QuarkIter } from "helpers/quarky";
import { Boulder, Sector, UUID } from "types";

export type BoulderOrder = {
    id: UUID,
    name: String,
    sectorId: UUID | String,
    index: number,
}

export function sortBoulders(sectors: Iterable<Sector>, lonelyBoulders: UUID[]): Map<UUID, number> {
    let idx = 1;
    let map: Map<UUID, number> = new Map();
    for (const sector of sectors) {
        for (const boulderId of sector.boulders) {
            map.set(boulderId, idx++)
        }
    }
    for (const boulderId of lonelyBoulders) {
        map.set(boulderId, idx++);
    }
    return map;
}