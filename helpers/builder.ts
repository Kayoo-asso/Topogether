import { batch, quark, Quark } from "helpers/quarky";
import { sync } from "helpers/services";
import { setupBoulder, setupTrack } from "helpers/quarkifyTopo";
import {
	Boulder,
	GeoCoordinates,
	Img,
	Name,
	Parking,
	Sector,
	SectorData,
	Topo,
	Track,
	UUID,
	Waypoint,
} from "types";
import { v4 } from "uuid";
import { SelectedBoulder, SelectedParking, SelectedSector, SelectedWaypoint } from "components/store/selectStore";

export const createSector = (
	topoQuark: Quark<Topo>,
	creatingSector: GeoCoordinates[],
	boulderOrder: Map<UUID, number>
) => {
	const topo = topoQuark();
	const newSector: SectorData = {
		id: v4(),
		index: topo.sectors.length,
		name: "Nouveau secteur" as Name,
		path: [...creatingSector],
		boulders: [],
	};
	topo.sectors.push(newSector);
	sectorChanged(topoQuark, newSector.id, boulderOrder);

	const newSectorQuark = topo.sectors.quarkAt(-1);
	return newSectorQuark;
};
export const deleteSector = ( 
	topoQuark: Quark<Topo>,
	sectorQuark: Quark<Sector>,
	flushStore: () => void,
	selectedSector?: SelectedSector,
) => {
	const topo = topoQuark();
	topo.sectors.removeQuark(sectorQuark);
	if (selectedSector && selectedSector.value().id === sectorQuark().id) flushStore();
}

export const createBoulder = (
	topoQuark: Quark<Topo>,
	location: GeoCoordinates,
	image?: Img
) => {
	const topo = topoQuark();
	// terrible hack around `liked` for now
	const newBoulder: Boulder = setupBoulder({
		id: v4(),
		name: `Caillou sans nom` as Name,
		liked: undefined!,
		location,
		isHighball: false,
		mustSee: false,
		dangerousDescent: false,
		tracks: [],
		images: image ? [image] : [],
	});
	newBoulder.liked = quark<boolean>(false, {
		onChange: (value) => sync.likeBoulder(newBoulder, value),
	});
	topo.boulders.push(newBoulder);
	boulderChanged(topoQuark, newBoulder.id, newBoulder.location, true);

	const newBoulderQuark = topo.boulders.quarkAt(-1);
	return newBoulderQuark;
};
export const deleteBoulder = (
	topoQuark: Quark<Topo>,
	boulderQuark: Quark<Boulder>,
	flushStore: () => void,
	selectedBoulder?: SelectedBoulder,
) => {
	const topo = topoQuark();
	topo.boulders.removeQuark(boulderQuark);
	const sectors = topo.sectors;
	const boulder = boulderQuark();
	const sectorWithBoulder = sectors.findQuark((s) =>
		s.boulders.some((id) => id === boulder.id)
	);
	if (sectorWithBoulder)
		//The boulder to delete is in a sector
		sectorWithBoulder.set((s) => ({
			...s,
			boulders: s.boulders.filter((id) => id !== boulder.id),
		}));
	else {
		//The boulder to delete is in lonelyboulders
		topoQuark.set((t) => ({
			...t,
			lonelyBoulders: t.lonelyBoulders.filter(
				(id) => id !== boulder.id
			),
		}));
	}
	if (selectedBoulder && selectedBoulder.value().id === boulder.id) flushStore()
}

export const deleteImage = (
	img: Img,
	selectedBoulder: SelectedBoulder,
	flushImage: () => void,
	selectImage: (i: Img) => void,
	flushTrack: () => void,
) => {
	const boulder = selectedBoulder.value();
	const tracksOnTheImage = boulder.tracks.quarks().filter(t => !!t().lines?.find((l) => l.imageId === img.id)).toArray();
	deleteTracks(tracksOnTheImage, boulder, flushTrack, selectedBoulder);

	const imgIndex = boulder.images.indexOf(boulder.images.find(i => i.id === img.id)!);
	const newImages = boulder.images.filter(i => i.id !== img.id);
	if (newImages.length === 0) flushImage();
	//Select the image that come just after (or just before if it was the last one)
	else if (selectedBoulder.selectedImage?.id === img.id) {
		if (imgIndex === -1) flushImage();
		else if (imgIndex < newImages.length) selectImage(newImages[imgIndex]);
		else selectImage(newImages[newImages.length - 1]);
	}
	selectedBoulder.value.set((b) => ({
		...b,
		images: newImages,
	}));
}

export const createParking = (
	topo: Topo,
	location: GeoCoordinates,
	image?: Img
) => {
	const newParking: Parking = {
		id: v4(),
		spaces: 0,
		name: `Parking ${topo.parkings ? topo.parkings.length + 1 : "1"}` as Name,
		image: image,
		location,
	};
	topo.parkings.push(newParking);
	const newParkingQuark = topo.parkings.quarkAt(-1);
	return newParkingQuark;
};
export const deleteParking = (
	topoQuark: Quark<Topo>,
	parkingQuark: Quark<Parking>,
	flushStore: () => void,
	selectedParking?: SelectedParking,
) => {
	const topo = topoQuark();
	topo.parkings.removeQuark(parkingQuark);
	if (selectedParking && selectedParking.value().id === parkingQuark().id) flushStore();
}

export const createWaypoint = (
	topo: Topo,
	location: GeoCoordinates,
	image?: Img
) => {
	const newWaypoint: Waypoint = {
		id: v4(),
		name: `Point de repère ${
			topo.waypoints ? topo.waypoints.length + 1 : "1"
		}` as Name,
		image: image,
		location,
	};
	topo.waypoints.push(newWaypoint);
	const newWaypointQuark = topo.waypoints.quarkAt(-1);
	return newWaypointQuark;
};
export const deleteWaypoint = (
	topoQuark: Quark<Topo>,
	waypointQuark: Quark<Waypoint>,
	flushStore: () => void,
	selectedWaypoint?: SelectedWaypoint,
) => {
	const topo = topoQuark();
	topo.waypoints.removeQuark(waypointQuark);
	if (selectedWaypoint && selectedWaypoint.value().id === waypointQuark().id) flushStore();
}

export const createTrack = (boulder: Boulder, creatorId: UUID) => {
	const newTrack: Track = setupTrack({
		id: v4(),
		creatorId: creatorId,
		index: boulder.tracks.length,
		name: "Voie sans nom" as Name,
		mustSee: false,
		isTraverse: false,
		isSittingStart: false,
		hasMantle: false,
		lines: [],
		ratings: [],
		spec: 0,
	});
	boulder.tracks.push(newTrack);
	const newTrackQuark = boulder.tracks.quarkAt(-1);
	return newTrackQuark;
};
export const deleteTrack = (
	boulder: Boulder,
	track: Quark<Track>,
	flushTrack: () => void,
	selectedBoulder?: SelectedBoulder,
) => {
	boulder.tracks.removeQuark(track);
	let i = 0;
	for (const track of boulder.tracks.quarks()) {
		track.set((t) => ({
			...t,
			index: i,
		}));
		i++;
	}
	if (selectedBoulder?.selectedTrack && selectedBoulder.selectedTrack().id === track().id) flushTrack();
};
export const deleteTracks = (
	tracksQuark: Quark<Track>[],
	boulder: Boulder,
	flushTrack: () => void,
	selectedBoulder?: SelectedBoulder,
) => {
	tracksQuark.forEach((tQ) => 
		deleteTrack(boulder, tQ, flushTrack, selectedBoulder)
	);
}

export const boulderChanged = (
	topoQuark: Quark<Topo>,
	boulderId: UUID,
	newLocation: GeoCoordinates,
	newBoulder: boolean = false
) =>
	batch(() => {
		const topo = topoQuark();
		let skipUpdate = false;
		let inSector = false;
		for (const sQ of topo.sectors.quarks()) {
			const sector = sQ();
			const idx = sector.boulders.indexOf(boulderId);
			if (idx >= 0) {
				// if the boulder is already in a sector and all is fine, we have nothing to do
				skipUpdate = polygonContains(sector.path, newLocation);
				inSector = true;
				// this means the boulder was in this sector but has now moved outside of it
				if (!skipUpdate) {
					// remove from sector
					sector.boulders.splice(idx, 1);
					sQ.set({ ...sector }); // trigger an update
				}
				break; // assumes the boulder is in a single sector
			}
		}
		if (!skipUpdate) {
			// add to the first sector that contains the boulder
			let found = false;
			for (const sQ of topo.sectors.quarks()) {
				const sector = sQ();
				if (polygonContains(sector.path, newLocation)) {
					found = true;
					sector.boulders.push(boulderId);
					sQ.set({ ...sector }); // trigger an update
					if (!inSector) {
						topoQuark.set((t) => ({
							...t,
							lonelyBoulders: topo.lonelyBoulders.filter(
								(id) => id !== boulderId
							),
						}));
					}
					break; // important
				}
			}
			if (!found && (inSector || newBoulder)) {
				topoQuark.set((t) => ({
					...t,
					lonelyBoulders: [...topo.lonelyBoulders, boulderId],
				}));
			}
		}
	});

export const sectorChanged = (
	topoQuark: Quark<Topo>,
	sectorId: UUID,
	boulderOrder: Map<UUID, number>
) =>
	batch(() => {
		const topo = topoQuark();
		const sQ = topo.sectors.findQuark((x) => x.id === sectorId)!;
		const sector = sQ();

		// We need different things from toAdd and toRemove for updating (see below)
		const toAdd: UUID[] = [];
		const toRemove: Boulder[] = [];
		const existing = new Set(sector.boulders);
		let lonelies = [...topo.lonelyBoulders];

		for (const boulder of topo.boulders) {
			const geoContains = polygonContains(sector.path, boulder.location);
			const arrayContains = existing.has(boulder.id);

			// The boulder is within the sector, but not in the array
			if (geoContains && !arrayContains) {
				toAdd.push(boulder.id);
			}
			// The boulder is in the array, but not within the sector anymore
			else if (arrayContains && !geoContains) {
				toRemove.push(boulder);
			}
		}

		// Add new boulders to this sector & remove them from other sectors
		if (toAdd.length > 0) {
			// Sort them according to their ordering numbers
			toAdd.sort((id1, id2) =>
				compareNbs(boulderOrder.get(id1)!, boulderOrder.get(id2)!)
			);

			// faster lookup while iterating over the sectors
			const addedSet = new Set(toAdd);
			for (const sQ of topo.sectors.quarks()) {
				const s = sQ();
				// skip the sector that just changed (probably not necessary but does not hurt)
				if (s.id === sectorId) continue;
				const newBoulders = s.boulders.filter((id) => !addedSet.has(id));
				// only update the sector if some boulders have been removed
				if (newBoulders.length !== s.boulders.length) {
					sQ.set({ ...s, boulders: newBoulders });
				}
			}
			lonelies = lonelies.filter((id) => !addedSet.has(id));
		}

		// Remove boulders from this sector, and assign them to another sector if possible
		if (toRemove.length > 0) {
			// check for each removed boulder if it should be assigned to a new sector
			for (const removed of toRemove) {
				// remove from this sector
				existing.delete(removed.id);
				// try to add to another sector
				let found = false;
				for (const sector of topo.sectors) {
					if (polygonContains(sector.path, removed.location)) {
						found = true;
						sector.boulders.push(removed.id);
						break; // only add to a single sector
					}
				}
				if (!found) lonelies.push(removed.id);
			}
		}

		// Update the lonely boulder list in the topo
		topoQuark.set((t) => ({
			...t,
			lonelyBoulders: lonelies,
		}));

		// Update the boulder list for this sector
		sQ.set({
			...sector,
			boulders: [...existing, ...toAdd],
		});
	});

// Returns -1 if a < b
// Returns 0 if a === b
// Returns 1 if a > b
const compareNbs = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0);

function polygonContains(
	polygon: GeoCoordinates[],
	point: GeoCoordinates
): boolean {
	if (polygon.length < 3) {
		throw new Error("Polygons should contain at least 3 points");
	}

	// We are using the raycasting algorithm:
	// https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
	// We cast a horizontal ray to the right of the point, which keeps the same y coordinate
	// Then, for each edge of the polygon, we determine the x coordinate of the intersection
	// between the corresponding infinite line and our horizontal ray
	// If that x coordinate is to the right of our point AND is contained in the edge, we have
	// an intersection.
	// If the ray intersects the polygon an odd number of times, the point is within the polygon
	// If it intersects it an even number of times, the point is outside.

	let intersectCount = 0;
	for (let i = 0; i < polygon.length - 1; ++i) {
		// intersectCount += true <=> intersectCount += 1
		// intersectCount += false <=> intersectCount += 0
		// this avoids an `if` statement
		intersectCount += rayIntersects(
			point[0],
			point[1],
			polygon[i],
			polygon[i + 1]
		) as any;
	}
	// check the last edge
	intersectCount += rayIntersects(
		point[0],
		point[1],
		polygon[polygon.length - 1],
		polygon[0]
	) as any;

	return intersectCount % 2 === 1;
}

function rayIntersects(
	x: number,
	y: number,
	p0: GeoCoordinates,
	p1: GeoCoordinates
): boolean {
	const [x0, y0] = p0;
	const [x1, y1] = p1;
	const minX = Math.min(x0, x1);
	const maxX = Math.max(x0, x1);
	if (y1 === y0) {
		return y === y0 && x >= minX && x <= maxX;
	} else {
		const slope = (x1 - x0) / (y1 - y0);
		// the latitude of the point is the Y-coordinate of the ray
		const targetX = x0 + slope * (y - y0);
		return targetX >= x && targetX >= minX && targetX <= maxX;
	}
}
