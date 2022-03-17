import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { useAsyncEffect } from "helpers/hooks";
import { useEffect } from "react";
import { Boulder, BoulderImage, DBBoulder, DBBoulderImage, DBLine, DBManager, DBParking, DBSector, DBTopo, DBTopoAccess, DBTrack, DBWaypoint, Line, Manager, Parking, Sector, Topo, TopoAccess, Track, User, UUID, Waypoint } from "types";
import { api } from "./ApiService";
import { DBConvert } from "./DBConvert";
 
export interface SyncService {
    readonly unsavedChanges: boolean;

    // TODO: allow user profile updates?

    topoUpdate(topo: Topo): Promise<void>;
    topoDelete(id: UUID): Promise<void>;

    topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID): Promise<void>;
    topoAccessDelete(id: UUID): Promise<void>;

    parkingUpdate(parking: Parking, topoId: UUID): Promise<void>;
    parkingDelete(id: UUID): Promise<void>;

    waypointUpdate(waypoint: Waypoint, topoId: UUID): Promise<void>;
    waypointDelete(id: UUID): Promise<void>;

    managerUpdate(manager: Manager, topoId: UUID): Promise<void>;
    managerDelete(id: UUID): Promise<void>;

    sectorUpdate(sector: Sector, topoId: UUID): Promise<void>;
    sectorDelete(id: UUID): Promise<void>;

    boulderUpdate(boulder: Boulder, topoId: UUID): Promise<void>;
    boulderDelete(id: UUID): Promise<void>;

    boulderImageUpdate(boulderImage: BoulderImage, topoId: UUID, boulderId: UUID): Promise<void>;
    boulderImageDelete(id: UUID): Promise<void>;
    
    trackUpdate(track: Track, topoId: UUID, boulderId: UUID): Promise<void>;
    trackDelete(id: UUID): Promise<void>; 

    lineUpdate(line: Line, topoId: UUID, trackId: UUID): Promise<void>;
    lineDelete(id: UUID): Promise<void>;
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
    unsavedChanges: boolean = false;

    updatedTopos: Map<UUID, DBTopo> = new Map();
    deletedTopos: Set<UUID> = new Set();

    async topoUpdate(topo: Topo) {
        const dto = DBConvert.topo(topo);
        this.updatedTopos.set(dto.id, dto);
        this.deletedTopos.delete(dto.id);
        this.unsavedChanges = true;
    }

    async topoDelete(id: UUID) {
        this.deletedTopos.add(id);
        this.updatedTopos.delete(id);
        this.unsavedChanges = true;
    }

    updatedTopoAccesses: Map<UUID, DBTopoAccess> = new Map();
    deletedTopoAccesses: Set<UUID> = new Set();

    async topoAccessUpdate(topoAccess: TopoAccess, topoId: UUID) {
        const dto = DBConvert.topoAccess(topoAccess, topoId);
        this.updatedTopoAccesses.set(dto.id, dto);
        this.deletedTopoAccesses.delete(dto.id);
        this.unsavedChanges = true;
    }

    async topoAccessDelete(id: UUID) {
        this.deletedTopoAccesses.add(id);
        this.updatedTopoAccesses.delete(id);
        this.unsavedChanges = true;
    }

    updatedParkings: Map<UUID, DBParking> = new Map();
    deletedParkings: Set<UUID> = new Set();

    async parkingUpdate(parking: Parking, topoId: UUID) {
        const dto = DBConvert.parking(parking, topoId);
        this.updatedParkings.set(dto.id, dto);
        this.deletedParkings.delete(dto.id);
        this.unsavedChanges = true;
    }

    async parkingDelete(id: UUID) {
        this.deletedParkings.add(id);
        this.updatedParkings.delete(id);
        this.unsavedChanges = true;
    }

    updatedWaypoints: Map<UUID, DBWaypoint> = new Map();
    deletedWaypoints: Set<UUID> = new Set();

    async waypointUpdate(waypoint: Waypoint, topoId: UUID) {
        const dto = DBConvert.waypoint(waypoint, topoId);
        this.updatedWaypoints.set(dto.id, dto);
        this.deletedWaypoints.delete(dto.id);
        this.unsavedChanges = true;
    }

    async waypointDelete(id: UUID) {
        this.deletedWaypoints.add(id);
        this.updatedWaypoints.delete(id);
        this.unsavedChanges = true;
    }

    updatedManagers: Map<UUID, DBManager> = new Map();
    deletedManagers: Set<UUID> = new Set();
    
    async managerUpdate(manager: Manager, topoId: UUID) {
        const dto = DBConvert.manager(manager, topoId);
        this.updatedManagers.set(dto.id, dto);
        this.deletedManagers.delete(dto.id);
        this.unsavedChanges = true;
    }
    
    async managerDelete(id: UUID) {
        this.deletedManagers.add(id);
        this.updatedManagers.delete(id);
        this.unsavedChanges = true;
    }

    updatedSectors: Map<UUID, DBSector> = new Map();
    deletedSectors: Set<UUID> = new Set();
    
    async sectorUpdate(sector: Sector, topoId: UUID) {
        const dto = DBConvert.sector(sector, topoId);
        this.updatedSectors.set(dto.id, dto);
        this.deletedSectors.delete(dto.id);
        this.unsavedChanges = true;
    }
    
    async sectorDelete(id: UUID) {
        this.deletedSectors.add(id);
        this.updatedSectors.delete(id);
        this.unsavedChanges = true;
    }
    
    updatedBoulders: Map<UUID, DBBoulder> = new Map();
    deletedBoulders: Set<UUID> = new Set();
    
    async boulderUpdate(boulder: Boulder, topoId: UUID) {
        const dto = DBConvert.boulder(boulder, topoId);
        this.updatedBoulders.set(dto.id, dto);
        this.deletedBoulders.delete(dto.id);
        this.unsavedChanges = true;
    }
    
    async boulderDelete(id: UUID) {
        this.deletedBoulders.add(id);
        this.updatedBoulders.delete(id);
        this.unsavedChanges = true;
    }

    updatedBoulderImages: Map<UUID, DBBoulderImage> = new Map();
    deletedBoulderImages: Set<UUID> = new Set();

    async boulderImageUpdate(boulderImage: BoulderImage, topoId: UUID, boulderId: UUID) {
        const dto = DBConvert.boulderImage(boulderImage, topoId, boulderId);
        this.updatedBoulderImages.set(dto.id, dto);
        this.deletedBoulderImages.delete(dto.id);
        this.unsavedChanges = true;
    }
    
    async boulderImageDelete(id: UUID) {
        this.deletedBoulderImages.add(id);
        this.updatedBoulderImages.delete(id);
        this.unsavedChanges = true;
    }

    updatedTracks: Map<UUID, DBTrack> = new Map();
    deletedTracks: Set<UUID> = new Set();
    
    async trackUpdate(track: Track, topoId: UUID, boulderId: UUID) {
        const dto = DBConvert.track(track, topoId, boulderId);
        this.updatedTracks.set(dto.id, dto);
        this.deletedTracks.delete(dto.id);
        this.unsavedChanges = true;
    }
    
    async trackDelete(id: UUID) {
        this.deletedTracks.add(id);
        this.updatedTracks.delete(id);
        this.unsavedChanges = true;
    }

    updatedLines: Map<UUID, DBLine> = new Map();
    deletedLines: Set<UUID> = new Set();

    async lineUpdate(line: Line, topoId: UUID, trackId: UUID) {
        const dto = DBConvert.line(line, topoId, trackId);
        this.updatedLines.set(dto.id, dto);
        this.deletedLines.delete(dto.id);
        this.unsavedChanges = true;
    }

    async lineDelete(id: UUID) {
        this.deletedLines.add(id);
        this.updatedLines.delete(id);
        this.unsavedChanges = true;
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
    async attemptSync() {
        const topoUpdate = await upsert("topos", this.updatedTopos);

        if (topoUpdate.error) {
            return false;
        }

        

        const sectorUpdate = await upsert("sectors", this.updatedSectors);
        if (sectorUpdate.error) {
            return false;
        }

        // if we arrived here, all operations went through
        // Q: is there a possibility of concurrent additions to the collections?
        // Since this is an sync function
        this.unsavedChanges = false;
    }
}

function upsert<T>(table: string, updates: Map<UUID, T>): PostgrestFilterBuilder<T> {
    return api.client
        .from<T>(table)
        .upsert(Array.from(updates.values()), { returning: "minimal" });
}

