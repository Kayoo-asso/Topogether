import { quark, Quark } from "helpers/quarky";
import {
	Boulder,
	BoulderData,
	Contributor,
	DBBoulder,
	DBContributor,
	DBLightTopo,
	DBLine,
	DBManager,
	DBParking,
	DBSector,
	DBTopo,
	DBTopoAccess,
	DBTrack,
	DBUserUpdate,
	DBWaypoint,
	LightTopo,
	Line,
	Manager,
	Parking,
	Sector,
	Topo,
	TopoAccess,
	TopoData,
	Track,
	User,
	UUID,
	Waypoint,
} from "types";
import { DBConvert } from "./DBConvert";
import { supabaseClient } from "./SupabaseClient";

export const enum SyncStatus {
	UnsavedChanges,
	Saving,
	UpToDate,
}

// TODO:
// - Add warnings when there are unsaved changes IN MEMORY (so either, not saved in IDB, or the full sync service is in memory)
// - Prevent account switching when there are unsaved changes in general
export interface SyncService {
	status(): SyncStatus;
	isOnline(): boolean;

	attemptSync(): Promise<boolean>;

	likeTopo(
		topo: Topo | TopoData | LightTopo | DBLightTopo,
		value: boolean
	): void;
	likeBoulder(boulder: Boulder | BoulderData, value: boolean): void;

	topoCreate(topo: DBTopo): void;
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

	contributorUpdate(contributor: Contributor, topoId: UUID): void;
	contributorDelete(contributor: Contributor): void;

	sectorUpdate(sector: Sector, topoId: UUID): void;
	sectorDelete(sector: Sector): void;

	boulderUpdate(boulder: Boulder, topoId: UUID): void;
	boulderDelete(boulder: Boulder): void;

	trackUpdate(track: Track, topoId: UUID, boulderId: UUID): void;
	trackDelete(track: Track): void;

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
			window.addEventListener("online", () => this._isOnline.set(true));
			window.addEventListener("offline", () => this._isOnline.set(false));
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

	private readonly _status: Quark<SyncStatus> = quark<SyncStatus>(
		SyncStatus.UpToDate
	);
	// careful to handle SSR, where `window` is undefined
	private readonly _isOnline: Quark<boolean>;

	status(): SyncStatus {
		return this._status();
	}

	isOnline(): boolean {
		return this._isOnline();
	}

	// same name as RPC function
	like_topos: Set<UUID> = new Set();
	unlike_topos: Set<UUID> = new Set();

	likeTopo(topo: Topo | TopoData | LightTopo, value: boolean): void {
		if (value) {
			this.like_topos.add(topo.id);
			this.unlike_topos.delete(topo.id);
			this._status.set(SyncStatus.UnsavedChanges);
		} else {
			this.like_topos.delete(topo.id);
			this.unlike_topos.add(topo.id);
		}
		this._status.set(SyncStatus.UnsavedChanges);
	}

	// same name as RPC function
	like_boulders: Set<UUID> = new Set();
	unlike_boulders: Set<UUID> = new Set();

	likeBoulder(boulder: Boulder | BoulderData, value: boolean): void {
		if (value) {
			this.like_boulders.add(boulder.id);
			this.unlike_boulders.delete(boulder.id);
		} else {
			this.like_boulders.delete(boulder.id);
			this.unlike_boulders.add(boulder.id);
		}
		this._status.set(SyncStatus.UnsavedChanges);
	}

	createdTopos: DBTopo[] = [];

	topoCreate(topo: DBTopo) {
		this.createdTopos.push(topo);
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

	updatedContributors: Map<UUID, DBContributor> = new Map();
	deletedContributors: Set<UUID> = new Set();

	contributorUpdate(contributor: Contributor, topoId: UUID) {
		const dto = DBConvert.contributor(contributor, topoId);
		this.updatedContributors.set(dto.id, dto);
		this.deletedContributors.delete(dto.id);
		this._status.set(SyncStatus.UnsavedChanges);
	}

	contributorDelete(contributor: Contributor) {
		this.deletedContributors.add(contributor.id);
		this.updatedContributors.delete(contributor.id);
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

	trackDelete(track: Track) {
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
			this.insert("createdTopos"),
			this.update("topos", "updatedTopos"),
			this.upsert("boulders", "updatedBoulders"),
			this.upsert("sectors", "updatedSectors"),
			this.upsert("managers", "updatedManagers"),
			this.upsert("contributors", "updatedContributors"),
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
			this.delete("contributors", "deletedContributors"),
			this.delete("parkings", "deletedParkings"),
			this.delete("waypoints", "deletedWaypoints"),
			this.delete("topo_accesses", "deletedTopoAccesses"),

			this.like_rpc("like_topos"),
			this.like_rpc("like_boulders"),
			this.like_rpc("unlike_topos"),
			this.like_rpc("unlike_boulders"),
		];
		await Promise.allSettled(promises);
		// all changes went through
		let unsavedChanges = true;
		if (this._status() === SyncStatus.Saving) {
			this._status.set(SyncStatus.UpToDate);
			unsavedChanges = false;
		}
		// return true if results only contains `true` booleans
		console.log("End of attemptSync. Unsaved changes: ", unsavedChanges);
		return unsavedChanges;
	}

	// Terrible hack to avoid problems with the INSERT policy we have for `public.topos`,
	// which prevents upserts from working for anyone that is not the creator of the topo.
	// Will be deleted with proper offline mode.
	private update(this: InMemorySync, table: "topos", key: "updatedTopos") {
		const updates = this[key];
		if (updates.size === 0) return Promise.resolve(true);
		const values = updates.values();
		this[key] = new Map();

		return supabaseClient
			.from(table)
			.update(Array.from(values), {
				returning: "minimal",
			})
			.in("id", Array.from(updates.keys()))
			.then((res) => {
				if (res.error) {
					console.error(`Error ${res.status} updating ${table}:`, res.error);
					// added <any> type annotation because TypeScript is annoying
					this[key] = mergeMaps(updates as Map<UUID, any>, this[key]);
					this._status.set(SyncStatus.UnsavedChanges);
					return false;
				}
				return true;
			});
	}

	// assumes `updates` have been swapped with a new Map for the property on the object
	private upsert<K extends UpdateKey>(
		this: InMemorySync,
		table: string,
		key: K
	) {
		const updates = this[key] as Map<UUID, UpdateValue<K>>;
		if (updates.size === 0) return Promise.resolve(true);
		const values = updates.values();
		this[key] = new Map();
		return supabaseClient
			.from(table)
			.upsert(Array.from(values), {
				returning: "minimal",
			})
			.then((res) => {
				if (res.error) {
					console.error(`Error ${res.status} updating ${table}:`, res.error);
					// added <any> type annotation because TypeScript is annoying
					this[key] = mergeMaps(updates as Map<UUID, any>, this[key]);
					this._status.set(SyncStatus.UnsavedChanges);
					return false;
				}
				return true;
			});
	}

	private delete<K extends DeleteKey>(table: string, key: K) {
		const set = this[key];
		if (set.size === 0) {
			return Promise.resolve(true);
		}
		this[key] = new Set();
		return supabaseClient
			.from(table)
			.delete({ returning: "minimal" })
			.in("id", Array.from(set))
			.then((res) => {
				if (res.error) {
					console.error("Error deleting from " + table + ":", res.error);
					this[key] = mergeSets(set, this[key]);
					this._status.set(SyncStatus.UnsavedChanges);
					return false;
				}
				return true;
			});
	}

	private like_rpc<K extends LikeKey>(key: K): PromiseLike<boolean> {
		const ids = this[key];
		if (ids.size === 0) return Promise.resolve(true);
		this[key] = new Set();
		return supabaseClient.rpc(key, { _ids: Array.from(ids) }).then((res) => {
			if (res.error) {
				console.error(`Error calling ${key}:`, res.error);
				this[key] = mergeSets(ids, this[key]);
				this._status.set(SyncStatus.UnsavedChanges);
				return false;
			}
			return true;
		});
	}

	private insert(key: "createdTopos"): PromiseLike<boolean> {
		const topos = this[key];
		if (topos.length === 0) return Promise.resolve(true);
		this[key] = [];
		return supabaseClient
			.from<DBTopo>("topos")
			.insert(topos, { returning: "minimal" })
			.then(({ error, status }) => {
				if (error) {
					console.error(`Error ${status} creating topos:`, error);
					this[key].push(...topos);
					this._status.set(SyncStatus.UnsavedChanges);
					return false;
				}
				return true;
			});
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
	[K in keyof InMemorySync]: InMemorySync[K] extends Map<UUID, any>
		? K extends `updated${infer _}`
			? K
			: never
		: never;
}[keyof InMemorySync];

type UpdateValue<K extends UpdateKey> = MapValue<InMemorySync[K]>;

type DeleteKey = {
	[K in keyof InMemorySync]: InMemorySync[K] extends Set<UUID>
		? K extends `deleted${infer _}`
			? K
			: never
		: never;
}[keyof InMemorySync];

type MapValue<T extends Map<unknown, unknown>> = T extends Map<infer _, infer V>
	? V
	: never;

type LikeKey = {
	[K in keyof InMemorySync]: InMemorySync[K] extends Set<UUID>
		? K extends `like_${infer _}`
			? K
			: K extends `unlike_${infer _}`
			? K
			: never
		: never;
}[keyof InMemorySync];
