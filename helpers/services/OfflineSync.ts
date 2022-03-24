import { IDBPDatabase, openDB } from "idb";
import type { DBSchema } from "idb";
import { DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBUserUpdate, DBWaypoint, UUID } from "types";

type KVStore<T extends { id: UUID }> = {
    key: UUID,
    value: T
};

// IMPORTANT: changing schema means changing the DB version

// Some TypeScript trickery, so that we can extract the keys of Schema
// & still provide a type that extends idb's DBSchema
type Schema = {
    users: KVStore<DBUserUpdate>,

    topos: KVStore<DBTopo>,
    sectors: KVStore<DBSector>,
    boulders: KVStore<DBBoulder>,
    tracks: KVStore<DBTrack>,
    lines: KVStore<DBLine>,

    managers: KVStore<DBManager>,
    parkings: KVStore<DBParking>,
    waypoints: KVStore<DBWaypoint>,
    accesses: KVStore<DBTopoAccess>,
}

interface DB extends DBSchema, Schema {} 

type Store = keyof Schema;
type StoreValue<Name extends Store> = Schema[Name]['value'];

let idbOpen = false;

interface LocalDB {
    iterate<K extends Store>(store: K): AsyncIterableIterator<StoreValue<K>>;
    set<K extends Store>(store: K, value: StoreValue<K>): void;
    delete(store: Store, id: UUID): void;
}

export class SyncDB implements LocalDB {
    db: IDBPDatabase<DB> | undefined;

    users: Map<UUID, DBUserUpdate> = new Map();
    topos: Map<UUID, DBTopo> = new Map();
    sectors: Map<UUID, DBSector> = new Map();
    boulders: Map<UUID, DBBoulder> = new Map();
    tracks: Map<UUID, DBTrack> = new Map();
    lines: Map<UUID, DBLine> = new Map();

    managers: Map<UUID, DBManager> = new Map();
    parkings: Map<UUID, DBParking> = new Map();
    waypoints: Map<UUID, DBWaypoint> = new Map();
    accesses: Map<UUID, DBTopoAccess> = new Map();

    constructor() {
        // ensure we have no problems with `this`
        const terminated = (() => this.db = undefined).bind(this);
        const assign = ((db: IDBPDatabase<DB>) => this.db = db).bind(this);

        openDB<DB>('topogether', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                const storeNames: Store[] = [
                    'users',
                    'topos',
                    'sectors',
                    'boulders',
                    'tracks',
                    'lines',
                    'managers',
                    'waypoints',
                    'parkings',
                    'accesses'
                ];
                const stores = storeNames.map(name =>
                    db.createObjectStore(name, { keyPath: 'id' })
                );
                // TODO: indices etc...
            },
            terminated
        }).then(assign);
    }
    iterate<K extends keyof Schema>(store: K): AsyncIterableIterator<StoreValue<K>> {
        throw new Error("Method not implemented.");
    }
    set<K extends keyof Schema>(store: K, value: StoreValue<K>): void {
        const map: Map<UUID, StoreValue<K>> = this[store];
        map.set(value.id, value);
    }
    delete(store: keyof Schema, id: UUID): void {
        throw new Error("Method not implemented.");
    }
}

// const db = await openDB<DB>('topogether', 1, {
//     upgrade(db, oldVersion, newVersion, transaction) {
//         const storeNames: Store[] = [
//             'users',
//             'topos',
//             'sectors',
//             'boulders',
//             'tracks',
//             'lines',
//             'managers',
//             'waypoints',
//             'parkings',
//             'accesses'
//         ];
//         const stores = storeNames.map(name =>
//             db.createObjectStore(name, { keyPath: 'id' })   
//         );
//         // TODO: indices etc...
//     },

//     terminated() {
//         idbOpen = false;
//     }
// });
// db.onclose = () => idbOpen = false;

// idbOpen = true;