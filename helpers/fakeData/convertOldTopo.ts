import {
	BoulderData,
	Description,
	Difficulty,
	Parking,
	Sector,
	SectorData,
	TopoAccess,
	TopoData,
	TopoType,
	TrackData,
} from "types";
import { v4 } from "uuid";

export const convertOldTopo = (t: any) => {
	const accesses: TopoAccess[] = [
		{
			id: v4(),
			difficulty: Difficulty.Good,
			duration: t.approachTime,
			steps: [
				{
					description: t.approachDescription,
					image: undefined,
				},
			],
		},
	];

	const boulders: BoulderData[] = [];
	for (const s of t.sectors) {
		for (const b of s.boulders) {
			const newTracks: TrackData[] = [];
			let i = 0;
			for (const tr of b.tracks) {
				const newTr: TrackData = {
					id: v4(),
					hasMantle: tr.hasMantle,
					isSittingStart: tr.isSittingStart,
					isTraverse: tr.isTraverse,
					mustSee: false,
					index: i,
					height: tr.height || undefined,
					name: tr.name || undefined,
					ratings: [],
					lines: [],
					creatorId: undefined,
				};
				i++;
			}
			const newB: BoulderData = {
				id: v4(),
				name: b.name,
				liked: false,
				isHighball: b.isHighball,
				mustSee: b.isMustSee,
				location: [b.location.lat, b.location.lng],
				dangerousDescent: false,
				images: [],
				tracks: newTracks,
			};
			boulders.push(newB);
		}
	}

	const newTopo: TopoData = {
		id: v4(),
		name: t.name,
		liked: false,
		altitude: t.altitude,
		closestCity: t.closestCity,
		location: [t.location.lat, t.location.lng],
		image: t.image,
		status: t.status,
		type: TopoType.Boulder,
		forbidden: false,

		// Date strings in ISO format
		// Convert into Date objects if needed
		modified: Date(),
		submitted: "",
		validated: "",
		// this one is about the physical spot
		cleaned: "",

		rockTypes: undefined,
		amenities: undefined,

		// these are optional, in case the profile has been deleted
		// (or the topo has not yet been validated)
		creator: undefined,
		validator: undefined,

		description: t.description as Description,
		faunaProtection: undefined,
		ethics: undefined,
		danger: t.dangerDescription as Description,
		otherAmenities: undefined,

		lonelyBoulders: [],

		sectors: [],
		boulders: boulders,
		waypoints: [],
		parkings: [],
		accesses: accesses,
		managers: [],
	};

	return newTopo;
};
