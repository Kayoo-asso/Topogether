import { quark, Quark } from "helpers/quarky/quarky";
import { Boulder, BoulderImage, DBBoulder, DBBoulderImage, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBWaypoint, Line, Manager, Parking, Sector, Topo, TopoAccess, TopoData, Track, User, UUID, Waypoint } from "types";
import { api } from "./";
import { DBConvert } from "./DBConvert";

export const enum SyncStatus {
    UnsavedChanges,
    Saving,
    UpToDate
}
 
export interface SyncService {
    status(): SyncStatus;
    isOnline(): boolean;

    attemptSync(): Promise<boolean>;

    // TODO: allow user profile updates?

    topoUpdate(topo: Topo | TopoData): Promise<void>;
    topoDelete(topo: Topo): Promise<void>;

    topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID): Promise<void>;
    topoAccessDelete(topoAccess: TopoAccess): Promise<void>;

    parkingUpdate(parking: Parking, topoId: UUID): Promise<void>;
    parkingDelete(parking: Parking): Promise<void>;

    waypointUpdate(waypoint: Waypoint, topoId: UUID): Promise<void>;
    waypointDelete(waypoint: Waypoint): Promise<void>;

    managerUpdate(manager: Manager, topoId: UUID): Promise<void>;
    managerDelete(manager: Manager): Promise<void>;

    sectorUpdate(sector: Sector, topoId: UUID): Promise<void>;
    sectorDelete(sector: Sector): Promise<void>;

    boulderUpdate(boulder: Boulder, topoId: UUID): Promise<void>;
    boulderDelete(boulder: Boulder): Promise<void>;

    trackUpdate(track: Track, topoId: UUID, boulderId: UUID): Promise<void>;
    bouderDelete(track: Track): Promise<void>; 

    lineUpdate(line: Line, topoId: UUID, trackId: UUID): Promise<void>;
    lineDelete(line: Line): Promise<void>;
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
        window.addEventListener('online', () => this._isOnline.set(true));
        window.addEventListener('offline', () => this._isOnline.set(false));
        if (process.env.NODE_ENV !== "test") {
            setInterval(async () => {
                if (this._isOnline()) {
                    await this.attemptSync();
                }
            }, 3000);
        }
    }

    private readonly _status: Quark<SyncStatus> = quark<SyncStatus>(SyncStatus.UpToDate);
    private readonly _isOnline: Quark<boolean> = quark(navigator.onLine);


    status(): SyncStatus {
        return this._status();
    }

    isOnline(): boolean {
        return this._isOnline();
    }

    updatedTopos: Map<UUID, DBTopo> = new Map();
    deletedTopos: Set<UUID> = new Set();

    async topoUpdate(topo: Topo | TopoData) {
        const dto = DBConvert.topo(topo);
        this.updatedTopos.set(dto.id, dto);
        this.deletedTopos.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    async topoDelete(topo: Topo) {
        this.deletedTopos.add(topo.id);
        this.updatedTopos.delete(topo.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedTopoAccesses: Map<UUID, DBTopoAccess> = new Map();
    deletedTopoAccesses: Set<UUID> = new Set();

    async topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID) {
        const dto = DBConvert.topoAccess(topoAccess, topoId);
        this.updatedTopoAccesses.set(dto.id, dto);
        this.deletedTopoAccesses.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    async topoAccessDelete(topoAccess: TopoAccess) {
        this.deletedTopoAccesses.add(topoAccess.id);
        this.updatedTopoAccesses.delete(topoAccess.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedParkings: Map<UUID, DBParking> = new Map();
    deletedParkings: Set<UUID> = new Set();

    async parkingUpdate(parking: Parking, topoId: UUID) {
        const dto = DBConvert.parking(parking, topoId);
        this.updatedParkings.set(dto.id, dto);
        this.deletedParkings.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    async parkingDelete(parking: Parking) {
        this.deletedParkings.add(parking.id);
        this.updatedParkings.delete(parking.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedWaypoints: Map<UUID, DBWaypoint> = new Map();
    deletedWaypoints: Set<UUID> = new Set();

    async waypointUpdate(waypoint: Waypoint, topoId: UUID) {
        const dto = DBConvert.waypoint(waypoint, topoId);
        this.updatedWaypoints.set(dto.id, dto);
        this.deletedWaypoints.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    async waypointDelete(waypoint: Waypoint) {
        this.deletedWaypoints.add(waypoint.id);
        this.updatedWaypoints.delete(waypoint.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedManagers: Map<UUID, DBManager> = new Map();
    deletedManagers: Set<UUID> = new Set();
    
    async managerUpdate(manager: Manager, topoId: UUID) {
        const dto = DBConvert.manager(manager, topoId);
        this.updatedManagers.set(dto.id, dto);
        this.deletedManagers.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    async managerDelete(manager: Manager) {
        this.deletedManagers.add(manager.id);
        this.updatedManagers.delete(manager.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedSectors: Map<UUID, DBSector> = new Map();
    deletedSectors: Set<UUID> = new Set();
    
    async sectorUpdate(sector: Sector, topoId: UUID) {
        const dto = DBConvert.sector(sector, topoId);
        this.updatedSectors.set(dto.id, dto);
        this.deletedSectors.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    async sectorDelete(sector: Sector) {
        this.deletedSectors.add(sector.id);
        this.updatedSectors.delete(sector.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    updatedBoulders: Map<UUID, DBBoulder> = new Map();
    deletedBoulders: Set<UUID> = new Set();
    
    // diff image changes?
    async boulderUpdate(boulder: Boulder, topoId: UUID) {
        const dto = DBConvert.boulder(boulder, topoId);
        this.updatedBoulders.set(dto.id, dto);
        this.deletedBoulders.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    async boulderDelete(boulder: Boulder) {
        this.deletedBoulders.add(boulder.id);
        this.updatedBoulders.delete(boulder.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedTracks: Map<UUID, DBTrack> = new Map();
    deletedTracks: Set<UUID> = new Set();
    
    async trackUpdate(track: Track, topoId: UUID, boulderId: UUID) {
        const dto = DBConvert.track(track, topoId, boulderId);
        this.updatedTracks.set(dto.id, dto);
        this.deletedTracks.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }
    
    async bouderDelete(track: Track) {
        this.deletedTracks.add(track.id);
        this.updatedTracks.delete(track.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    updatedLines: Map<UUID, DBLine> = new Map();
    deletedLines: Set<UUID> = new Set();

    async lineUpdate(line: Line, topoId: UUID, trackId: UUID) {
        const dto = DBConvert.line(line, topoId, trackId);
        this.updatedLines.set(dto.id, dto);
        this.deletedLines.delete(dto.id);
        this._status.set(SyncStatus.UnsavedChanges);
    }

    async lineDelete(line: Line) {
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
        this._status.set(SyncStatus.Saving);
        // no need for allSettled since the promises of the Supabase client never fail
        const results = await Promise.all([
            this.upsert("topos", "updatedTopos"),
            this.upsert("sectors", "updatedSectors"),
            this.upsert("boulders", "updatedBoulders"),
            this.upsert("tracks", "updatedTracks"),
            this.upsert("lines", "updatedLines"),
            this.upsert("managers", "updatedManagers"),
            this.upsert("parkings", "updatedParkings"),
            this.upsert("waypoints", "updatedWaypoints"),
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
        ]);
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
        return !results.some(x => !x);
    }

    // assumes `updates` have been swapped with a new Map for the property on the object
   private async upsert<K extends UpdateKey>(this: InMemorySync, table: string, key: K) {
       const updates = this[key] as Map<UUID, UpdateValue<K>>;
       const values = updates.values();
       this[key] = new Map();
       return api.client
           .from(table)
           .upsert(Array.from(values), { returning: "minimal" })
           .then(res => {
               if (res.error) {
                   console.warn("Error updating " + table + ":", res.error);
                   // added <any> type annotation because TypeScript is annoying
                   this[key] = mergeMaps(updates as Map<UUID, any>, this[key]);
                   return false;
               }
               return true;
           });
   }

    private async delete<K extends DeleteKey>(table: string, key: K) {
        const set = this[key];
        this[key] = new Set();
        return api.client
            .from(table)
            .delete({ returning: "minimal" })
            .in("id", Array.from(set))
            .then(res => {
                if (res.error) {
                    console.warn("Error deleting from " + table + ":", res.error);
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