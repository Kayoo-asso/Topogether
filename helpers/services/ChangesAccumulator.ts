const DBNAME = "__CHANGES_ACCUMULATOR__"

let dbRequest = window.indexedDB.open(DBNAME);
let db: IDBDatabase | undefined;
let stores: Map<string, IDBObjectStore> = new Map();

// ready = false means the DB is being opened, or an upgrade is underway
let ready = false;
let storesToCreate: string[] = [];

function onDbSuccess() {
    db = dbRequest.result;
    for (const store of storesToCreate) {
        if (!db.objectStoreNames.contains(store)) {
            requestUpgrade();
        }
    }
    ready = true;
}

function onUpgradeNeeded(ev: IDBVersionChangeEvent) {
    const db = (ev.target as any).result as IDBDatabase;

    for (const store of storesToCreate) {
        db.createObjectStore(store);
    }
}

dbRequest.onsuccess = onDbSuccess;

dbRequest.onupgradeneeded = (ev) => {
    const db = (ev.target as any).result as IDBDatabase;

    for (const store of storesToCreate) {
        db.createObjectStore(store); 
    }
    storesToCreate = [];
    upgradeRequested = false;
};

function requestUpgrade() {
    // the DB will check the requested stores after opening
    if (!db) return;

    if (ready) {
        ready = false;
        dbRequest = window.indexedDB.open(DBNAME, db.version + 1);
        dbRequest.onsuccess = onDbSuccess;
    }
}

const DELETED = Symbol("DELETED");

// Idea: accumulate changes and queue a microtask that opens a transaction
export class ChangeAccumulator<K extends IDBValidKey, T> {
    id: string;
    pendingChanges: Map<K, T> = new Map();
    pendingDeletes: Set<K> = new Set();
    persistedChanges: Map<K, T> = new Map();
    persistedDeletes: Set<K> = new Set();

    scheduled: boolean = false;

    constructor(id: string) {
        this.id = id;
        if (!db.objectStoreNames.contains(id)) {
            storesToCreate.push(id);
            requestUpgrade();
        }
    }

    onOpen(store: IDBObjectStore) {
        store.
    }

    scheduleFlush() {
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            queueMicrotask(() => {}) // do stuff;
        }
    }

    add(key: K, value: T) {
        this.pendingChanges.set(key, value);
        this.scheduleFlush();
    }

    delete(key: K) {
        this.pendingChanges.set(key, DELETED);
    }


}