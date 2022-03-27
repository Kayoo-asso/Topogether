import { quark, Quark } from "helpers/quarky/quarky";
import { Boulder, DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBUserUpdate, DBWaypoint, LightTopo, Line, Manager, Parking, Sector, Topo, TopoAccess, TopoData, Track, User, UUID, Waypoint } from "types";
import { api } from "./";
import { DBConvert } from "./DBConvert";

export const enum SyncStatus {
    UnsavedChanges,
    Saving,
    UpToDate
}
 
// TODO:
// - Add warnings when there are unsaved changes IN MEMORY (so either, not saved in IDB, or the full sync service is in memory)
// - Prevent account switching when there are unsaved changes in general
export interface SyncService {
    status(): SyncStatus;
    isOnline(): boolean;

    attemptSync(): Promise<boolean>;

    // Everything is synchronous, since the SyncService should take care of making network requests in the background
    userUpdate(user: User): void;

    topoUpdate(topo: Topo | TopoData): void;
    topoDelete(topo: Topo | TopoData | LightTopo): void;

    topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID): void;
    topoAccessDelete(topoAccess: TopoAccess): void;

    parkingUpdate(parking: Parking, topoId: UUID): void;
    parkingDelete(parking: Parking): void;

    waypointUpdate(waypoint: Waypoint, topoId: UUID): void;
    waypointDelete(waypoint: Waypoint): void;

    managerUpdate(manager: Manager, topoId: UUID): void;
    managerDelete(manager: Manager): void;

    sectorUpdate(sector: Sector, topoId: UUID): void;
    sectorDelete(sector: Sector): void;

    boulderUpdate(boulder: Boulder, topoId: UUID): void;
    boulderDelete(boulder: Boulder): void;

    trackUpdate(track: Track, topoId: UUID, boulderId: UUID): void;
    bouderDelete(track: Track): void; 

    lineUpdate(line: Line, topoId: UUID, trackId: UUID): void;
    lineDelete(line: Line): void;
}

// 1. Synchronisation:
// Keep retrying every X seconds (or on `online` event), if there are pending changes.
// On operation fail, two scenarios:
// a) Authorization error: this should never happen to a user that sticks to the app' UI.
//    In that case, drop the operation and print an error in the console.
// b) Other errors: do nothing, the operation will be retried. The user has the information
//    that some changes still have not been saved.

// 2. Image uploads (TODO)
// - Try to upload immediately if online
// - Save to IDB if online, add temporary image ID to some list
//   (id is temporary because the upload image service generates a new ID,
//   to avoid malicious uploads that could delete existing images)
// - If both offline & IDB is not accessible, or IDB operation fails
//   -> show error message to the user + prevent further image uploads?

// 3. Account switching: prevent account switching when there are pending changes
//    (account switching should generally require to be online)
export class InMemorySync implements SyncService {
    constructor() {
        // for server-side rendering
        if (typeof window !== "undefined") {
            this._isOnline = quark(window.navigator.onLine);
            window.addEventListener('online', () => this._isOnline.set(true));
            window.addEventListener('offline', () => this._isOnline.set(false));
        } else {
            this._isOnline = quark<boolean>(false);
        }
        
        if (process.env.NODE_ENV !== "test") {
            setInterval(async () => {
                if (this._isOnline()) {
                    await this.attemptSync();
                }
            }, 3000);
        }
    }

    private readonly _status: Quark<SyncStatus> = quark<SyncStatus>(SyncStatus.UpToDate);
    // careful to handle SSR, where `window` is undefined
    private readonly _isOnline: Quark<boolean>;


    status(): SyncStatus {
        return this._status();
    }

    isOnline(): boolean {
        return this._isOnline();
    }

    // only one, since logging out when there are unsaved changes is not allowed
    userUpdateData: DBUserUpdate | undefined;
    userUpdate(user: User) {
        this.userUpdateData = DBConvert.user(user);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedTopos: Map<UUID, DBTopo> = new Map();
    deletedTopos: Set<UUID> = new Set();

    topoUpdate(topo: Topo | TopoData) {
        const dto = DBConvert.topo(topo);
        this.updatedTopos.set(dto.id, dto);
        this.deletedTopos.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    topoDelete(topo: Topo | TopoData | LightTopo) {
        this.deletedTopos.add(topo.id);
        this.updatedTopos.delete(topo.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedTopoAccesses: Map<UUID, DBTopoAccess> = new Map();
    deletedTopoAccesses: Set<UUID> = new Set();

    topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID) {
        const dto = DBConvert.topoAccess(topoAccess, topoId);
        this.updatedTopoAccesses.set(dto.id, dto);
        this.deletedTopoAccesses.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    topoAccessDelete(topoAccess: TopoAccess) {
        this.deletedTopoAccesses.add(topoAccess.id);
        this.updatedTopoAccesses.delete(topoAccess.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedParkings: Map<UUID, DBParking> = new Map();
    deletedParkings: Set<UUID> = new Set();

    parkingUpdate(parking: Parking, topoId: UUID) {
        const dto = DBConvert.parking(parking, topoId);
        this.updatedParkings.set(dto.id, dto);
        this.deletedParkings.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    parkingDelete(parking: Parking) {
        this.deletedParkings.add(parking.id);
        this.updatedParkings.delete(parking.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedWaypoints: Map<UUID, DBWaypoint> = new Map();
    deletedWaypoints: Set<UUID> = new Set();

    waypointUpdate(waypoint: Waypoint, topoId: UUID) {
        const dto = DBConvert.waypoint(waypoint, topoId);
        this.updatedWaypoints.set(dto.id, dto);
        this.deletedWaypoints.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    waypointDelete(waypoint: Waypoint) {
        this.deletedWaypoints.add(waypoint.id);
        this.updatedWaypoints.delete(waypoint.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedManagers: Map<UUID, DBManager> = new Map();
    deletedManagers: Set<UUID> = new Set();
    
    managerUpdate(manager: Manager, topoId: UUID) {
        const dto = DBConvert.manager(manager, topoId);
        this.updatedManagers.set(dto.id, dto);
        this.deletedManagers.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    managerDelete(manager: Manager) {
        this.deletedManagers.add(manager.id);
        this.updatedManagers.delete(manager.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedSectors: Map<UUID, DBSector> = new Map();
    deletedSectors: Set<UUID> = new Set();
    
    sectorUpdate(sector: Sector, topoId: UUID) {
        const dto = DBConvert.sector(sector, topoId);
        this.updatedSectors.set(dto.id, dto);
        this.deletedSectors.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    sectorDelete(sector: Sector) {
        this.deletedSectors.add(sector.id);
        this.updatedSectors.delete(sector.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    updatedBoulders: Map<UUID, DBBoulder> = new Map();
    deletedBoulders: Set<UUID> = new Set();
    
    // diff image changes?
    boulderUpdate(boulder: Boulder, topoId: UUID) {
        const dto = DBConvert.boulder(boulder, topoId);
        this.updatedBoulders.set(dto.id, dto);
        this.deletedBoulders.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    boulderDelete(boulder: Boulder) {
        this.deletedBoulders.add(boulder.id);
        this.updatedBoulders.delete(boulder.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedTracks: Map<UUID, DBTrack> = new Map();
    deletedTracks: Set<UUID> = new Set();
    
    trackUpdate(track: Track, topoId: UUID, boulderId: UUID) {
        const dto = DBConvert.track(track, topoId, boulderId);
        this.updatedTracks.set(dto.id, dto);
        this.deletedTracks.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    bouderDelete(track: Track) {
        this.deletedTracks.add(track.id);
        this.updatedTracks.delete(track.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedLines: Map<UUID, DBLine> = new Map();
    deletedLines: Set<UUID> = new Set();

    lineUpdate(line: Line, topoId: UUID, trackId: UUID) {
        const dto = DBConvert.line(line, topoId, trackId);
        this.updatedLines.set(dto.id, dto);
        this.deletedLines.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    lineDelete(line: Line) {
        this.deletedLines.add(line.id);
        this.updatedLines.delete(line.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    // Algorithm
    // 1. Perform updates
    // 2. Perform deletes
    // 3. If anything fails, keep all the information for that operation
    //    Operations should be idempotent, so we can just retry in bulk later.

    // Ordering
    // 1. Perform updates before deletes
    // Error 1: deleting a topo cascades on nested entities, we don't want to reinsert them
    // Error 2: deleting an entity that still has a foreign key referencing it, because some update
    // did not go through
    // 2. Perform updates in order, do not try to do a Promise.all() on promises of different types
    // Error 1: updating an entity with a foreign key to an entity that has not been created yet
    
    // TODO:
    // Actually enforce correct ordering using a SQL function?
    // Currently we keep retrying infinitely, even if some corruption happened in the updates
    async attemptSync(): Promise<boolean> {
        if (this._status() === SyncStatus.UpToDate) return true;
        this._status.set(SyncStatus.Saving);
        // no need for allSettled since the promises of the Supabase client never fail
        const promises = [
            this.upsert("topos", "updatedTopos"),
            this.upsert("boulders", "updatedBoulders"),
            this.upsert("sectors", "updatedSectors"),
            this.upsert("managers", "updatedManagers"),
            this.upsert("tracks", "updatedTracks"),
            this.upsert("parkings", "updatedParkings"),
            this.upsert("waypoints", "updatedWaypoints"),
            this.upsert("lines", "updatedLines"),
            this.upsert("topo_accesses", "updatedTopoAccesses"),

            this.delete("topos", "deletedTopos"),
            this.delete("sectors", "deletedSectors"),
            this.delete("boulders", "deletedBoulders"),
            this.delete("tracks", "deletedTracks"),
            this.delete("lines", "deletedLines"),
            this.delete("managers", "deletedManagers"),
            this.delete("parkings", "deletedParkings"),
            this.delete("waypoints", "deletedWaypoints"),
            this.delete("topo_accesses", "deletedTopoAccesses"),
        ];
        const results = [];
        for (const p of promises) {
            results.push(await p);
        }
        // const results = await promises;
        const hasUnsavedChanges = 
            this.updatedTopos.size !== 0 ||
            this.updatedSectors.size !== 0 ||
            this.updatedBoulders.size !== 0 ||
            this.updatedTracks.size !== 0 ||
            this.updatedLines.size !== 0 ||
            this.updatedManagers.size !== 0 ||
            this.updatedParkings.size !== 0 ||
            this.updatedWaypoints.size !== 0 ||
            this.updatedTopoAccesses.size !== 0 ||
            
            this.deletedTopos.size !== 0 ||
            this.deletedSectors.size !== 0 ||
            this.deletedBoulders.size !== 0 ||
            this.deletedTracks.size !== 0 ||
            this.deletedLines.size !== 0 ||
            this.deletedManagers.size !== 0 ||
            this.deletedParkings.size !== 0 ||
            this.deletedWaypoints.size !== 0 ||
            this.deletedTopoAccesses.size !== 0;
        this._status.set(hasUnsavedChanges ? SyncStatus.UnsavedChanges : SyncStatus.UpToDate);
        // return true if results only contains `true` booleans
        console.log("End of attemptSync. Unsaved changes: ", this.status() === SyncStatus.UnsavedChanges );
        return !results.some(x => !x);
    }

    // assumes `updates` have been swapped with a new Map for the property on the object
   private upsert<K extends UpdateKey>(this: InMemorySync, table: string, key: K) {
       const updates = this[key] as Map<UUID, UpdateValue<K>>;
       if(updates.size === 0) return Promise.resolve(true);
       const values = updates.values();
       this[key] = new Map();
       return api.client
           .from(table)
           .upsert(Array.from(values), { returning: "minimal" })
           .then(res => {
               if (res.error) {
                   console.error(`Error ${res.status} updating ${table}:`, res.error);
                   // added <any> type annotation because TypeScript is annoying
                   this[key] = mergeMaps(updates as Map<UUID, any>, this[key]);
                   return false;
               }
               return true;
           });
   }

    private delete<K extends DeleteKey>(table: string, key: K) {
        const set = this[key];
        if(set.size === 0) {
            return Promise.resolve(true);
        }
        this[key] = new Set();
        return api.client
            .from(table)
            .delete({ returning: "minimal" })
            .in("id", Array.from(set))
            .then(res => {
                if (res.error) {
                    console.error("Error deleting from " + table + ":", res.error);
                    this[key] = mergeSets(set, this[key]);
                    return false;
                }
                return true;
            })
    }
}

// modifies `dest`
function mergeMaps<T>(dest: Map<UUID, T>, source: Map<UUID, T>): Map<UUID, T> {
    for (const [k, v] of source) {
        dest.set(k, v);
    }
    return dest;
}

// modifies `dest`
function mergeSets(dest: Set<UUID>, source: Set<UUID>): Set<UUID> {
    for (const x of source) {
        dest.add(x);
    }
    return dest;
}

type UpdateKey = {
    [K in keyof InMemorySync]: InMemorySync[K] extends Map<UUID, any> ? K : never
}[keyof InMemorySync];

type UpdateValue<K extends UpdateKey> = MapValue<InMemorySync[K]>;

type DeleteKey = {
    [K in keyof InMemorySync]: InMemorySync[K] extends Set<UUID> ? K : never
}[keyof InMemorySync];

type MapValue<T extends Map<unknown, unknown>> = T extends Map<infer _, infer V> ? V : never;

