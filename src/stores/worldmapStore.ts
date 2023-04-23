import { TopoTypes, UUID } from "types";
import { create } from "zustand";
import { TopoFilters } from "~/components/map/TopoFilters";

interface WorldMapStore {
	selectedTopo?: UUID;
	filters: TopoFilters;
	filtersOpen: boolean;
	filtersDomain: TopoFilters;
	toggleFilters(): void;
	selectTopo(id: UUID | undefined): void;
	setFilters(update: Partial<TopoFilters>): void;
	resetFilters(): void;
}

const defaultFilters: TopoFilters = {
	types: TopoTypes.None,
	gradeRange: [3, 9],
	rockRange: [0, 99999],
	adaptedToChildren: false,
};

export const useWorldMapStore = create<WorldMapStore>((set) => ({
	selectedTopo: undefined,
	filters: { ...defaultFilters },
	filtersOpen: false,
	filtersDomain: { ...defaultFilters },
	toggleFilters() {
		set((s) => ({ filtersOpen: !s.filtersOpen }));
	},
	selectTopo(id) {
		set({ selectedTopo: id });
	},
	setFilters(update) {
		set((state) => ({
			filters: {
				...state.filters,
				...update,
			},
		}));
	},
	resetFilters() {
		set((state) => ({ filters: state.filtersDomain }));
	},
}));
