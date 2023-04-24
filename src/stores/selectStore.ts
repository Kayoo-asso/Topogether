// import { Quark } from "helpers/quarky";
import {
	Boulder,
	Img,
	MapToolEnum,
	Parking,
	Sector,
	Track,
	Waypoint,
} from "types";
import { create } from "zustand";
import { Breakpoint, getBreakpoint } from "~/components/providers/DeviceProvider";

type Quark<T> = () => T

export type SelectedInfo =
	| "MENU"
	| "INFO"
	| "ACCESS"
	| "MANAGEMENT"
	| "CONTRIBUTORS"
	| "SEARCHBAR"
	| "FILTERS"
	| "NONE";

export type SelectedNone = {
	type: "none";
	value: undefined;
};
export type SelectedSector = {
	type: "sector";
	value: Quark<Sector>;
};
export type SelectedBoulder = {
	type: "boulder";
	value: Quark<Boulder>;
	selectedTrack?: Quark<Track>;
	selectedImage?: Img;
};
export type SelectedParking = {
	type: "parking";
	value: Quark<Parking>;
};
export type SelectedWaypoint = {
	type: "waypoint";
	value: Quark<Waypoint>;
};

export type Item =
	| Quark<Sector>
	| Quark<Boulder>
	| Quark<Parking>
	| Quark<Waypoint>;
export type SelectedItem =
	| SelectedNone
	| SelectedSector
	| SelectedBoulder
	| SelectedParking
	| SelectedWaypoint;
export type DropdownItem = {
	position: { x: number; y: number };
	item: SelectedItem;
};

export type Selectors = {
	info: (s: SelectedInfo) => void;
	tool: (t: MapToolEnum) => void;
	sector: (s: Quark<Sector>) => void;
	boulder: (b: Quark<Boulder>) => void;
	track: (t: Quark<Track>, b?: Quark<Boulder>) => void;
	image: (i: Img) => void;
	parking: (p: Quark<Parking>) => void;
	waypoint: (w: Quark<Waypoint>) => void;
};
export type Flushers = {
	info: () => void;
	tool: () => void;
	item: () => void;
	track: () => void;
	image: () => void;
	all: () => void;
};

export type SelectStore = { info: SelectedInfo } & { item: SelectedItem } & {
	tool: MapToolEnum;
} & { select: Selectors } & { flush: Flushers } & { isEmpty: () => boolean };

export const useSelectStore = create<SelectStore>()((set, get) => ({
	info: "NONE",
	item: {
		type: "none",
		value: undefined,
	},
	tool: undefined,
	isEmpty: function () {
		return !get() || (get().info === "NONE" && get().item.type === "none");
	},
	select: {
		info(i: SelectedInfo) {
			if (getBreakpoint().isMobile) {
				get().flush.item();
			} else {
				get().flush.track();
			}
			set({ info: i });
		},
		tool: (t: MapToolEnum) => set({ tool: t }),
		sector: (s: Quark<Sector>) => set({ item: { type: "sector", value: s } }),
		boulder(b: Quark<Boulder>) {
			set({
				item: {
					type: "boulder",
					value: b,
					selectedTrack: undefined,
					selectedImage: b().images.length > 0 ? b().images[0] : undefined,
				},
			});
		},
		track(t: Quark<Track>, b?: Quark<Boulder>) {
			set((s) => {
				if (s.item.type === "boulder") {
					if (b) {
						if (s.item.value === b)
							return {
								item: {
									...s.item,
									selectedTrack: t,
									selectedImage: getImageFromTrack(s.item.value(), t()),
								},
							};
						else
							return {
								item: {
									type: "boulder",
									value: b,
									selectedTrack: t,
									selectedImage: getImageFromTrack(s.item.value(), t()),
								},
							};
					} else
						return {
							item: {
								...s.item,
								selectedTrack: t,
								selectedImage: getImageFromTrack(s.item.value(), t()),
							},
						};
				} else {
					if (b)
						return {
							item: {
								type: "boulder",
								value: b,
								selectedTrack: t,
								selectedImage: getImageFromTrack(b(), t()),
							},
						};
					else throw new Error("Trying to select a Track without boulder");
				}
			});
		},
		image: (i: Img) =>
			set((s) => {
				const boulder = s.item as SelectedBoulder;
				if (boulder.selectedImage?.id === i.id) return s;
				return { item: { ...boulder, selectedImage: i } };
			}),
		parking: (p: Quark<Parking>) =>
			set({ item: { type: "parking", value: p } }),
		waypoint: (w: Quark<Waypoint>) =>
			set({ item: { type: "waypoint", value: w } }),
	},
	flush: {
		info: () =>
			set((s) => {
				if (s.info === "NONE") return s;
				else return { info: "NONE" };
			}),
		tool: () => set({ tool: undefined }),
		item: () =>
			set((s) => {
				if (s.item.type === "none") return s;
				else return { item: { type: "none", value: undefined } };
			}),
		track: () =>
			set((s) => ({ item: { ...s.item, selectedTrack: undefined } })),
		image: () =>
			set((s) => ({ item: { ...s.item, selectedImage: undefined } })),
		all: function () {
			get().flush.info();
			get().flush.item();
			get().flush.tool();
		},
	},
}));

const getImageFromTrack = (b: Boulder, t: Track) => {
	return (
		b.images.find((i) => i.id === t.lines.at(0)?.imageId) ||
		(b.images.length === 0 ? b.images[0] : undefined)
	);
};
