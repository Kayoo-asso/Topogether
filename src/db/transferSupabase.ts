import { db } from "~/db";
import postgres from "postgres";
import { env } from "../env.mjs";
import {
	Amenities,
	Difficulty,
	Orientation,
	Reception,
	TopoStatus,
	TrackDanger,
	UUID,
} from "types";
import {
	contributors,
	lines,
	managers,
	parkings,
	rockLikes,
	rocks,
	sectors,
	topoAccesses,
	topoLikes,
	topos,
	tracks,
	waypoints,
} from "~/db/schema";
import { ApiService } from "helpers/services";
import { createClient } from "@supabase/supabase-js";
import { hasFlag } from "helpers/bitflags";
import { InferModel } from "drizzle-orm";

const sql = postgres(env.SUPABASE_PGURL);
const api = new ApiService(
	createClient(env.SUPABASE_API_URL, env.SUPABASE_MASTER_KEY)
);

const rows = await sql`SELECT id from public.topos`;
const topoIds = rows.map((x) => x.id) as UUID[];

const topoRows: Array<InferModel<typeof topos, "insert">> = [];
const managerRows: Array<InferModel<typeof managers, "insert">> = [];
const parkingRows: Array<InferModel<typeof parkings, "insert">> = [];
const waypointRows: Array<InferModel<typeof waypoints, "insert">> = [];
const sectorRows: Array<InferModel<typeof sectors, "insert">> = [];
const topoAccessRows: Array<InferModel<typeof topoAccesses, "insert">> = [];
const rockRows: Array<InferModel<typeof rocks, "insert">> = [];
const trackRows: Array<InferModel<typeof tracks, "insert">> = [];
const lineRows: Array<InferModel<typeof lines, "insert">> = [];

const contributorRows: Array<InferModel<typeof contributors, "insert">> = [];
const topoLikeRows: Array<InferModel<typeof topoLikes, "insert">> = [];
const rockLikeRows: Array<InferModel<typeof rockLikes, "insert">> = [];

for (const id of topoIds) {
	const topo = (await api.getTopo(id))!;
	let status: "draft" | "submitted" | "validated";
	if (topo.status === TopoStatus.Draft) {
		status = "draft";
	} else if (topo.status === TopoStatus.Submitted) {
		status = "submitted";
	} else if (topo.status === TopoStatus.Validated) {
		status = "validated";
	} else {
		throw new Error("Unexpected topo status flag: " + topo.status);
	}

	topoRows.push({
		id: topo.id,
		name: topo.name,
		status,
		type: topo.type,
		trashed: false,

		location: topo.location,
		rockTypes: topo.rockTypes,
		bestSeason: null,
		forbidden: topo.forbidden,
		oldGear: false,
		adaptedToChildren: hasFlag(topo.amenities, Amenities.AdaptedToChildren),

		cleaned: topo.cleaned,
		modified: new Date(topo.modified),
		submitted: topo.submitted ? new Date(topo.submitted) : null,
		validated: topo.validated ? new Date(topo.validated) : null,

		closestCity: topo.closestCity,
		description: topo.description,
		faunaProtection: topo.faunaProtection,
		ethics: topo.ethics,
		danger: topo.danger,
		altitude: topo.altitude,
		otherAmenities: topo.otherAmenities,

		image: topo.image,
		creatorId: topo.creator?.id,
		validatorId: topo.validator?.id,
	});

	for (const m of topo.managers) {
		managerRows.push({
			id: m.id,
			name: m.name,
			contactName: m.contactName,
			contactPhone: m.contactPhone,
			contactMail: m.contactMail,
			description: m.description,
			address: m.address,
			zip: m.zip,
			city: m.city,
			image: m.image,
			topoId: topo.id,
		});
	}

	for (const s of topo.sectors) {
		sectorRows.push({
			id: s.id,
			name: s.name,
			index: s.index,
			path: [s.path],
			topoId: topo.id,
		});
	}
	for (const w of topo.waypoints) {
		waypointRows.push({
			id: w.id,
			name: w.name,
			location: w.location,
			description: w.description,
			image: w.image,
			topoId: topo.id,
		});
	}

	for (const p of topo.parkings) {
		parkingRows.push({
			id: p.id,
			spaces: p.spaces,
			name: p.name,
			location: p.location,
			description: p.description,
			image: p.image,
			topoId: topo.id,
		});
	}

	for (const ta of topo.accesses) {
		let difficulty: "good" | "ok" | "bad" | "dangerous";
		if (ta.difficulty === Difficulty.Good) {
			difficulty = "good";
		} else if (ta.difficulty === Difficulty.OK) {
			difficulty = "ok";
		} else if (ta.difficulty === Difficulty.Bad) {
			difficulty = "bad";
		} else if (ta.difficulty === Difficulty.Dangerous) {
			difficulty = "dangerous";
		} else {
			throw new Error("Unsupported difficulty value " + ta.difficulty);
		}
		topoAccessRows.push({
			id: ta.id,
			duration: ta.duration,
			danger: ta.danger,
			difficulty,
			steps: ta.steps,
			topoId: topo.id,
		});
	}

	for (const b of topo.boulders) {
		rockRows.push({
			id: b.id,
			name: b.name,
			location: b.location,
			mustSee: b.mustSee,
			isHighball: b.isHighball,
			dangerousDescent: b.dangerousDescent,
			images: b.images,
			topoId: topo.id,
		});
		for (const track of b.tracks) {
			let reception: "good" | "ok" | "dangerous" | undefined = undefined;
			if (track.reception === Reception.OK) {
				reception = "ok";
			} else if (track.reception === Reception.Good) {
				reception = "good";
			} else if (track.reception === Reception.Dangerous) {
				reception = "dangerous";
			}
			trackRows.push({
				id: track.id,
				name: track.name,
				grade: track.grade,
				index: track.index,
				description: track.description,
				height: track.height,
				reception,
				anchors: track.anchors,
				orientation: track.orientation || Orientation.None,
				mustSee: track.mustSee,
				isTraverse: track.isTraverse,
				isSittingStart: track.isSittingStart,
				isMultipitch: false,
				isTrad: false,
				hasMantle: track.hasMantle,
				spec: track.spec,
				dangers: TrackDanger.None,
				topoId: topo.id,
				rockId: b.id,
			});
			for (const line of track.lines) {
				lineRows.push({
					id: line.id,
					index: line.index,
					points: line.points,
					forbidden: line.forbidden || [],
					hand1: line.hand1,
					hand2: line.hand2,
					foot1: line.foot1,
					foot2: line.foot2,
					belays: [],
					imageId: line.imageId,
					topoId: topo.id,
					trackId: track.id,
					variantId: null,
				});
			}
		}
	}
}

contributorRows.push(
	...((await sql`SELECT topo_id as "topoId", user_id as "userId", role FROM topo_contributors;`) as any)
);

topoLikeRows.push(...((await sql`SELECT * from topo_likes`) as any));
rockLikeRows.push(
	...((await sql`SELECT "boulderId" as "rockId", "userId", created from boulder_likes`) as any)
);

await db.transaction(async (tx) => {
	// Remove previous transfer
	await tx.delete(topos);
	await tx.delete(topoAccesses);
	await tx.delete(managers);
	await tx.delete(waypoints);
	await tx.delete(parkings);
	await tx.delete(sectors);
	await tx.delete(rocks);
	await tx.delete(tracks);
	await tx.delete(lines);
	await tx.delete(contributors);
	await tx.delete(topoLikes);
	await tx.delete(rockLikes);

	await tx.insert(topos).values(topoRows);
	await tx.insert(topoAccesses).values(topoAccessRows);
	await tx.insert(managers).values(managerRows);
	await tx.insert(waypoints).values(waypointRows);
	await tx.insert(parkings).values(parkingRows);
	await tx.insert(sectors).values(sectorRows);
	await tx.insert(rocks).values(rockRows);
	await tx.insert(tracks).values(trackRows);
	await tx.insert(lines).values(lineRows);
	await tx.insert(contributors).values(contributorRows);
	await tx.insert(topoLikes).values(topoLikeRows);
	await tx.insert(rockLikes).values(rockLikeRows);
});

process.exit(0);
