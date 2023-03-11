import { Sector, SectorData, UUID } from "types";
import create from "zustand";

type BoulderOrderStore = {
    value: globalThis.Map<UUID, number>,
    sort: (sectors: Iterable<SectorData>, lonelyBoulders: UUID[]) => void,
}

export function sortBoulders(
	sectors: Iterable<Sector>,
	lonelyBoulders: UUID[]
): Map<UUID, number> {
	let idx = 1;
	let order: Map<UUID, number> = new Map();
	for (const sector of sectors) {
		for (const boulderId of sector.boulders) {
			order.set(boulderId, idx++);
		}
	}
	for (const boulderId of lonelyBoulders) {
		order.set(boulderId, idx++);
	}
	return order;
}

export const useBoulderOrder = create<BoulderOrderStore>()((set, get) => ({
    value: new Map(),
    sort: (sectors: Iterable<Sector>, lonelyBoulders: UUID[]) => set(bo => ({ value: sortBoulders(sectors, lonelyBoulders) })),
}));