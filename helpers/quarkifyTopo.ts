import { Quark, quark, QuarkArray } from "helpers/quarky";
import { supabaseClient, sync } from "helpers/services";
import { DBConvert } from "helpers/services/DBConvert";
import {
	BoulderData,
	TrackData,
	TopoData,
	UUID,
	Track,
	Boulder,
	Topo,
	Line,
	Sector,
	Manager,
	Waypoint,
	TopoAccess,
	Parking,
	DBLightTopo,
	LightTopoOld,
	DBTopo,
	Contributor,
} from "types";

export type TopoCreate = Omit<
	TopoData,
	| "liked"
	| "sectors"
	| "boulders"
	| "waypoints"
	| "accesses"
	| "parkings"
	| "managers"
	| "contributors"
	| "lonelyBoulders"
>;

let topoUnderEdit: UUID | null = null;

// Quick hack for now
export async function createTopo(create: TopoCreate): Promise<TopoData | null> {
	const dataWithArrays: TopoData = {
		...create,
		location: create.location,
		liked: false,
		sectors: [],
		boulders: [],
		managers: [],
		contributors: [],
		waypoints: [],
		accesses: [],
		parkings: [],
		lonelyBoulders: [],
	};
	const dto = DBConvert.topo(dataWithArrays);
	const { error, status } = await supabaseClient
		.from<DBTopo>("topos")
		.insert(dto, { returning: "minimal" });
	if (error) {
		console.error("Error creating new topo: ", error);
		return null;
	}
	return {
		...dataWithArrays,
	};
}

export function editTopo(topo: TopoData): Quark<Topo> {
	return quarkifyTopo(topo, false);
}

function onBoulderDelete(boulder: Boulder, topoQuark: Quark<Topo>) {
	const topo = topoQuark();
	const aloneIdx = topo.lonelyBoulders.indexOf(boulder.id);
	if (aloneIdx >= 0) {
		topo.lonelyBoulders.splice(aloneIdx, 1);
		topoQuark.set({ ...topo }); // force update
	} else {
		for (const sectorQuark of topo.sectors.quarks()) {
			const sector = sectorQuark();
			const idx = sector.boulders.indexOf(boulder.id);
			if (idx >= 0) {
				sector.boulders.splice(idx, 1);
				sectorQuark.set({ ...sector }); // force update
				break;
			}
		}
	}
	sync.boulderDelete(boulder);
}

function onSectorDelete(sector: Sector, topoQuark: Quark<Topo>) {
	topoQuark.set((prev) => ({
		...prev,
		lonelyBoulders: [...prev.lonelyBoulders, ...sector.boulders],
	}));
	sync.sectorDelete(sector);
}

export function quarkifyTopo(data: TopoData, seedData: boolean): Quark<Topo> {
	topoUnderEdit = data.id;
	const topo: Topo = {
		...data,
		liked: quark(data.liked, {
			onChange: (value) => sync.likeTopo(topo, value),
		}),
		sectors: quarkifySectors(data.sectors, data.id, seedData),
		boulders: quarkifyBoulders(data.boulders, data.id, seedData),
		waypoints: quarkifyWaypoints(data.waypoints, data.id, seedData),
		accesses: quarkifyTopoAccesses(data.accesses, data.id, seedData),
		parkings: quarkifyParkings(data.parkings, data.id, seedData),
		managers: quarkifyManagers(data.managers, data.id, seedData),
		contributors: quarkifyContributors(data.contributors, data.id, seedData),
	};
	const onChange = (topo: Topo) => sync.topoUpdate(topo);
	const q = quark(topo, { onChange });
	// Bit of hackery so that the delete handlers of the QuarkArrays for boulders and sectors
	// can have a reference to the quark of the topo
	q().sectors.onDelete = (sector) => onSectorDelete(sector, q);
	q().boulders.onDelete = (boulder) => onBoulderDelete(boulder, q);

	if (seedData) onChange(topo);

	return q;
}

// terrible hack
export function quarkifyLightTopos(data: DBLightTopo[]): LightTopoOld[] {
	return data.map((t) => ({
		...t,
		liked: quark(t.liked, { onChange: (like) => sync.likeTopo(t, like) }),
	}));
}

function quarkifyParkings(
	parkings: Parking[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Parking> {
	const onChange = (parking: Parking) => sync.parkingUpdate(parking, topoId);
	if (seedData) parkings.forEach(onChange);

	return new QuarkArray(parkings, {
		quarkifier: (p) => quark(p, { onChange }),
		onAdd: onChange,
		onDelete: (parking) => sync.parkingDelete(parking),
	});
}

function quarkifyTopoAccesses(
	accesses: TopoAccess[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<TopoAccess> {
	const onChange = (access: TopoAccess) =>
		sync.topoAccessUpdate(access, topoId);
	if (seedData) accesses.forEach(onChange);

	return new QuarkArray(accesses, {
		quarkifier: (a) => quark(a, { onChange }),
		onAdd: onChange,
		onDelete: (access) => sync.topoAccessDelete(access),
	});
}

function quarkifyWaypoints(
	waypoints: Waypoint[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Waypoint> {
	const onChange = (waypoint: Waypoint) =>
		sync.waypointUpdate(waypoint, topoId);
	if (seedData) waypoints.forEach(onChange);

	return new QuarkArray(waypoints, {
		quarkifier: (w) => quark(w, { onChange }),
		onAdd: onChange,
		onDelete: (waypoint) => sync.waypointDelete(waypoint),
	});
}

function quarkifyManagers(
	managers: Manager[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Manager> {
	const onChange = (manager: Manager) => sync.managerUpdate(manager, topoId);
	if (seedData) managers.forEach(onChange);

	return new QuarkArray(managers, {
		quarkifier: (s) => quark(s, { onChange }),
		onAdd: onChange,
		onDelete: (manager) => sync.managerDelete(manager),
	});
}

function quarkifyContributors(
	contributors: Contributor[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Contributor> {
	const onChange = (contributor: Contributor) =>
		sync.contributorUpdate(contributor, topoId);
	if (seedData) contributors.forEach(onChange);

	return new QuarkArray(contributors, {
		quarkifier: (s) => quark(s, { onChange }),
		onAdd: onChange,
		onDelete: (contributor) => sync.contributorDelete(contributor),
	});
}

function quarkifySectors(
	sectors: Sector[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Sector> {
	const onChange = (sector: Sector) => sync.sectorUpdate(sector, topoId);
	if (seedData) sectors.forEach(onChange);

	return new QuarkArray(sectors, {
		quarkifier: (s) => quark(s, { onChange }),
		onAdd: onChange,
		onDelete: (sector) => sync.sectorDelete(sector),
	});
}

export function setupBoulder(track: BoulderData): Boulder;
export function setupBoulder(
	boulder: BoulderData,
	seedData: boolean = false
): Boulder {
	return {
		...boulder,
		liked: quark(boulder.liked, {
			onChange: (value) => sync.likeBoulder(boulder, value),
		}),
		tracks: quarkifyTracks(
			boulder.tracks,
			topoUnderEdit!,
			boulder.id,
			seedData
		),
	};
}

function quarkifyBoulders(
	data: BoulderData[],
	topoId: UUID,
	seedData: boolean
): QuarkArray<Boulder> {
	const onChange = (boulder: Boulder) => sync.boulderUpdate(boulder, topoId);
	const boulders: Boulder[] = data.map((b) =>
		(setupBoulder as Function)(b, seedData)
	);
	if (seedData) boulders.forEach(onChange);

	return new QuarkArray(boulders, {
		quarkifier: (b) => quark(b, { onChange }),
		onAdd: onChange,
		onDelete: (boulder) => sync.boulderDelete(boulder),
	});
}

export function setupTrack(track: TrackData): Track;
export function setupTrack(track: TrackData, seedData: boolean = false): Track {
	return {
		...track,
		lines: quarkifyLines(track.lines, topoUnderEdit!, track.id, seedData),
		ratings: new QuarkArray(),
	};
}

function quarkifyTracks(
	data: TrackData[],
	topoId: UUID,
	boulderId: UUID,
	seedData: boolean
): QuarkArray<Track> {
	const onChange = (track: Track) => sync.trackUpdate(track, topoId, boulderId);
	const tracks: Track[] = data.map((track) =>
		(setupTrack as Function)(track, seedData)
	);
	if (seedData) tracks.forEach(onChange);

	return new QuarkArray(tracks, {
		quarkifier: (t) => quark(t, { onChange }),
		onAdd: onChange,
		onDelete: (track) => sync.trackDelete(track),
	});
}

function quarkifyLines(
	lines: Line[],
	topoId: UUID,
	trackId: UUID,
	seedData: boolean
): QuarkArray<Line> {
	const onChange = (line: Line) => sync.lineUpdate(line, topoId, trackId);
	if (seedData) lines.forEach(onChange);

	return new QuarkArray(lines, {
		quarkifier: (l) => quark(l, { onChange }),
		onAdd: onChange,
		onDelete: (line) => sync.lineDelete(line),
	});
}
