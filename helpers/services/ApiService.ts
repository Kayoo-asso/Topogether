import { SupabaseClient } from "@supabase/supabase-js";
import {
	TopoData,
	UUID,
	LightTopo,
	TopoStatus,
	DBTopo,
	Topo,
	DBLightTopo,
} from "types";
import { sync } from ".";
import { ImageService } from "./ImageService";
import { get, set } from "idb-keyval";

export type LightTopoFilters = {
	userId?: UUID;
	onlyOwned?: boolean;
	status?: TopoStatus;
};

export enum UpdateResult {
	Ok,
	Unauthorized,
	Error,
}

export class ApiService {
	client: SupabaseClient;
	images: ImageService = new ImageService();

	constructor(client: SupabaseClient) {
		this.client = client;
	}

	async getLightTopos(filters?: LightTopoFilters): Promise<DBLightTopo[]> {
		let query = this.client.from<DBLightTopo>("light_topos").select("*");

		if (filters?.status) {
			query = query.eq("status", filters.status);
		}
		if (filters?.userId) {
			if (filters?.onlyOwned) {
				query = query.eq("creator->>id" as any, filters.userId);
			} else {
				// Can't do this one using regular PostgREST functionality,
				// as the relation from topo_contributors to the light_topos view
				// is not detected by PostgREST
				query = this.client.rpc<DBLightTopo>("get_contributor_topos", {
					_user_id: filters.userId,
				});
			}
		}
		const { data, error } = await query;

		if (error || !data) {
			console.error("Error getting light topos: ", error);
			return [];
		}
		return data;
	}

	async getLikedTopos(userId: UUID): Promise<DBLightTopo[]> {
		const { data, error } = await this.client.rpc<DBLightTopo>(
			"liked_topos_of_user",
			{
				_user_id: userId,
			}
		);
		if (error || !data) {
			console.error("Error getting liked topos:", error);
			return [];
		}
		return data;
	}

	// 0.3 is the default similarity threshold for pg_trgm
	async searchLightTopos(
		query: string,
		limit: number,
		similarity: number = 0.3
	): Promise<LightTopo[]> {
		const { error, data } = await this.client.rpc<LightTopo>(
			"search_light_topos",
			{
				_query: query,
				_nb: limit,
				_similarity: similarity,
			}
		);
		if (error) {
			console.error(`Error searching light topos for \"${query}\": `, error);
			return [];
		}
		return data ?? [];
	}

	async setTopoStatus(topoId: UUID, status: TopoStatus): Promise<UpdateResult> {
		const { error } = await this.client
			.from<DBTopo>("topos")
			.update({ status })
			.eq("id", topoId);
		if (error) {
			// Postgres error code
			// see: https://postgrest.org/en/stable/api.html#http-status-codes
			return error.code === "42501"
				? UpdateResult.Unauthorized
				: UpdateResult.Error;
		}
		return UpdateResult.Ok;
	}

	deleteTopo(topo: Topo | TopoData | LightTopo) {
		sync.topoDelete(topo);
	}

	async getTopo(id: UUID): Promise<TopoData | null> {
		// Hack to avoid trying to get from IDB on the server
		const local = typeof window === "undefined" ? undefined : await get(id);
		if (local) {
			// revalidate cache
			this.fetchTopo(id).then((topo) => topo && set(topo.id, topo));
			console.log("Returning local topo:", local);
			return local;
		} else {
			return await this.fetchTopo(id);
		}
	}

	private async fetchTopo(id: UUID): Promise<TopoData | null> {
		// Notes on this query:
		//
		// 1. If multiple tables reference a parent with the same name for the foreign key,
		// we disambiguate by specifying the name of the table we want to retrieve.
		// https://postgrest.org/en/stable/api.html#hint-disambiguation
		//
		// 2. We map each geometry column purely to its coordinates array
		//
		// 3. In some cases, we specify properties explicitly, to strip away the additional
		// "topoId" foreign key that exist in the DB for performant joins.
		// This applies for tracks, boulder images and lines, for instance.
		const { data, error } = await this.client
			.from<TopoData>("topos_with_like")
			.select(
				`
                id,
                name,
                status,
                liked,
                forbidden,
                modified,
                submitted,
                validated,
                amenities,
                rockTypes,
                type,
                description,
                faunaProtection,
                ethics,
                danger,
                cleaned,
                altitude,
                closestCity,
                otherAmenities,
                lonelyBoulders,
                image,
                location:location->coordinates,
                creator:profiles!creatorId (*),
                validator:profiles!validatorId (*),

                parkings:parkings!topoId (
                    id, name, spaces, description, image,
                    location:location->coordinates
                ),

                waypoints:waypoints!topoId (
                    id, name, description, image,
                    location: location->coordinates
                ),
                accesses:topo_accesses!topoId (*),
                managers:managers!topoId (*),
				contributors:topo_contributors!topo_id (
					id: user_id,
					role
				),
                sectors:sectors!topoId (
                    *,
                    path:path->coordinates
                ),
                boulders:boulders_with_like!topoId (
                    id, name, liked, isHighball, mustSee, dangerousDescent,
                    location:location->coordinates,
                    images,
                    tracks:tracks!boulderId(
                        id, index, name, description, height, grade, orientation, reception, anchors, techniques, spec,
                        isTraverse, isSittingStart, mustSee, hasMantle,
                        creatorId,
                        lines:lines!trackId(
                            id, index,
                            points,
                            forbidden:forbidden->coordinates,
                            hand1:hand1->coordinates,
                            hand2:hand2->coordinates,
                            foot1:foot1->coordinates,
                            foot2:foot2->coordinates,
                            imageId
                        )
                    )
                )
            `
			)
			.match({ id })
			.maybeSingle();
		if (error) {
			console.error("Error getting topo data: ", error);
			return null;
		}
		return data;
	}

	// async downloadTopo(id: UUID, progressBar?: ProgressBar): Promise<boolean> {
	// 	// TODO: improve this to revalidate the cached topo
	// 	if (await get(id)) {
	// 		console.log("--- Found cached topo, skipping download ---");
	// 		return true;
	// 	}

	// 	console.log(`--- Downloading topo... ---`);
	// 	const start = Date.now();
	// 	const topo = await this.fetchTopo(id);
	// 	if (!topo) return false;

	// 	await Promise.all([
	// 		set(topo.id, topo),
	// 		downloadTopoMap(topo),
	// 		this.images.downloadTopoImages(topo),
	// 	]);

	// 	const end = Date.now();
	// 	console.log(`Finished downloading topo in ${end - start}ms`);
	// 	return true;
	// }
}
