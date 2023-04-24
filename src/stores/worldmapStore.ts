import { TopoTypes } from "types";
import { create } from "zustand";
import { TopoFilters } from "~/components/map/TopoFilters";

interface WorldMapStore {
	filters: TopoFilters;
	filtersOpen: boolean;
	filtersDomain: TopoFilters;
	searchOpen: boolean;
	toggleFilters(): void;
	toggleSearch(): void;
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
	filters: { ...defaultFilters },
	filtersOpen: false,
	filtersDomain: { ...defaultFilters },
	searchOpen: false,
	toggleFilters() {
		set((s) => ({ filtersOpen: !s.filtersOpen, searchOpen: false }));
	},
	toggleSearch() {
		set((s) => ({ searchOpen: !s.searchOpen, filtersOpen: false }));
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
