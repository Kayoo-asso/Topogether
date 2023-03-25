import create from "zustand";
import { SelectedBoulder, SelectedItem } from "./selectStore";
import { Boulder, Manager, TopoAccess, Track } from "types";
import { Quark } from "helpers/quarky";

export type DeletedItem = SelectedItem | 
{ type: 'track', value: Quark<Track>, boulder: Quark<Boulder>, selectedBoulder?: SelectedBoulder } |
{ type: 'manager', value: Quark<Manager> } |
{ type: 'topoAccess', value: Quark<TopoAccess>}

export type Deleters = {
	item: (i: DeletedItem) => void,
}
export type Flushers = {
    item: () => void,
}

export type DeleteStore = 
    { item: DeletedItem } &
	{ delete: Deleters } &
	{ flush: Flushers }

export const useDeleteStore = create<DeleteStore>()((set, get) => ({
    item: {
		type: 'none',
		value: undefined,
	},
    delete: {
		item: (item: DeletedItem) => set(d => ({ item: item })),
	},
    flush: {
        item: () => set(d => ({ item: { type: 'none', value: undefined } }))
    }
}));
