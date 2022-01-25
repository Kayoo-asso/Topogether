import { LineDTO, TrackDTO, UUID } from "types";
import { del, get, set } from "idb-keyval";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
 
export class SyncService {


    updatedTracks: Map<UUID, TrackDTO> = new Map();
    deletedTracks: Set<UUID> = new Set();

    updatedLines: Map<UUID, LineDTO> = new Map();
    deletedLines: Set<UUID> = new Set();

    onTrackAdd(track: TrackDTO) {
        this.deletedTracks.delete(track.id);
        this.updatedTracks.set(track.id, track);
    }
}


let request = window.indexedDB.open("Sets")

export class IDBSet<T extends IDBValidKey> {
    unsaved: Set<T>;
    toDelete: Set<T>;

    constructor(items?: Iterable<T> | readonly T[] | null) {
        this.unsaved = new Set();
        this.toDelete = new Set();
    }

    add(item: T) {
        set(item, true).catch(() => this.unsaved.push(item));
    }

    delete(item: T) {
        del(item).catch(() => this.toDelete.add(item));
    }

    async has(item: T): Promise<boolean> {
        const x = await get(item);
        return !!x;
    }

    attemptSync() {

    }


}