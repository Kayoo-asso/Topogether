import { SupabaseClient } from "@supabase/supabase-js";
import { TopoData, UUID, LightTopo, TopoStatus, DBTopo, Topo } from 'types';
import { auth, sync } from ".";
import { ImageService } from "./ImageService";
import { supabaseClient } from "./SupabaseClient";

export type LightTopoFilters = {
    userId?: UUID,
    status?: TopoStatus
}

export enum UpdateResult {
    Ok,
    Unauthorized,
    Error
}

export class ApiService {
    client: SupabaseClient;
    images: ImageService = new ImageService();

    constructor(client: SupabaseClient) {
        this.client = client;
    }

    async getLightTopos(filters?: LightTopoFilters): Promise<LightTopo[]> {
        let query = this.client
            .from<LightTopo>("light_topos")
            .select('*');

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.userId) {
            query = query.eq('creator->>id' as any, filters.userId)
        }
        const { data, error } = await query;

        if (error || !data) {
            console.error("Error getting light topos: ", error);
            return [];
        }
        return data;
    }

    // 0.3 is the default similarity threshold for pg_trgm
    async searchLightTopos(query: string, limit: number, similarity: number = 0.3): Promise<LightTopo[]> {
        const { error, data } = await this.client
            .rpc<LightTopo>("search_light_topos", {
                _query: query,
                _nb: limit,
                _similarity: similarity 
            });
        if (error) {
            console.error(`Error searching light topos for \"${query}\": `, error);
            return [];
        }
        return data ?? [];
    }

    async setTopoStatus(topoId: UUID, status: TopoStatus): Promise<UpdateResult> {
        const { error, status: httpStatus } = await this.client
            .from<DBTopo>("topos")
            .update({ status })
            .eq('id', topoId);
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
            .from<TopoData>("topos")
            .select(`
                id,
                name,
                status,
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
                imagePath,
                location:location->coordinates,
                creator:profiles!creatorId (*),
                validator:profiles!validatorId (*),

                parkings:parkings!topoId (
                    id, name, spaces, description, imagePath,
                    location:location->coordinates
                ),

                waypoints:waypoints!topoId (
                    id, name, description, imagePath,
                    location: location->coordinates
                ),
                accesses:topo_accesses!topoId (*),
                managers:managers!topoId (*),
                sectors:sectors!topoId (
                    *,
                    path:path->coordinates
                ),
                boulders:boulders!topoId (
                    id, name, isHighball, mustSee, dangerousDescent,
                    location:location->coordinates,
                    images,
                    tracks:tracks!boulderId(
                        id, index, name, description, height, grade, orientation, reception, anchors, techniques,
                        isTraverse, isSittingStart, mustSee, hasMantle,
                        creatorId,
                        lines:lines!trackId(
                            id, index,
                            points:points->coordinates,
                            forbidden:forbidden->coordinates,
                            hand1:hand1->coordinates,
                            hand2:hand2->coordinates,
                            foot1:foot1->coordinates,
                            foot2:foot2->coordinates,
                            imageId
                        )
                    )
                )
            `)
            .match({ id })
            .maybeSingle();
        if (error) {
            console.error("Error getting topo data: ", error);
            return null;
        }
        return data;
    }
}

