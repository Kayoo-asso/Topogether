import { createClient, SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import { DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopoAccess, DBTrack, DBWaypoint, Email, BoulderImage, Name, TopoData, User, UUID, Topo, DBTopo, LightTopo, Session, Role, TopoStatus } from 'types';
import { Quark, quark } from 'helpers/quarky';
import { DBConvert } from "./DBConvert";
import { sync } from ".";
import { ImageService } from "./Images";

export enum AuthResult {
    Success,
    ConfirmationRequired,
    Error
}

export type LightTopoFilters = {
    userId?: UUID,
    status?: TopoStatus
}

export const masterApi: SupabaseClient | null =
    process.env.API_MASTER_KEY_LOCAL
        ? createClient(process.env.NEXT_PUBLIC_API_URL!, process.env.API_MASTER_KEY_LOCAL!)
        : null;

export class ApiService {
    client: SupabaseClient;
    private _user: Quark<User | null>;
    images: ImageService = new ImageService();

    constructor() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const API_KEY = process.env.NEXT_PUBLIC_ANON_KEY!;
        this.client = createClient(API_URL, API_KEY);
        const supabaseUser = this.client.auth.user();
        if (supabaseUser) {
            // Security checks
            const role = supabaseUser.user_metadata.role;
            if (role !== 'USER' && role !== 'ADMIN') {
                throw new Error("Role not correctly saved in authentication token.");
            }
            if (!supabaseUser.email) {
                throw new Error("Supabase user does not have email!");
            }

            const user: User = {
                id: supabaseUser.id as UUID,
                userName: "Loading..." as Name,
                role: role,
                email: supabaseUser.email as Email,
            };
            this._user = quark<User | null>(user);
            // start loading the full profile from the network
            // handles offline by caching request results
            this._loadUser(supabaseUser);
        } else {
            this._user = quark<User | null>(null);
        }

    }


    private async _loadUser(authUser: AuthUser): Promise<AuthResult.Success | AuthResult.Error> {
        const { data, error } = await this.client
            .from<User>("users")
            .select("*")
            .match({ id: authUser.id })
            // single and not maybeSingle, since the row has to exist if we have a Supabase auth token
            .single();

        if (error || !data) {
            console.debug("Error loading up user: ", error);
            return AuthResult.Error;
        }
        
        this._user.set(data);
        return AuthResult.Success;
    }

    updateUserInfo(user: User) {
        sync.userUpdate(user);
        this._user.set(user);
    }

    user(): User | null {
        return this._user();
    }

    async signup(email: Email, password: string, pseudo: Name): Promise<AuthResult> {
        const role: Role = "USER";
        const { user, session, error } = await this.client.auth.signUp({
            email,
            password
        }, {
            redirectTo: "/",
            data: { userName: pseudo, role  }
        });
        if (error) {
            // user already exists
            if (error.status === 400) {

            }
            // server error
            if (error.status === 500) {

            }
            console.debug("Sign up error: ", error);
            console.debug("Session: ", session);
            console.debug("User: ", user);
            return AuthResult.Error;
        }

        if (!user) {
            return AuthResult.ConfirmationRequired;
        }
        return await this._loadUser(user);
    }

    async signIn(email: Email, password: string): Promise<AuthResult> {
        const { user, error } = await this.client.auth.signIn({ email, password });
        if (error) {
            console.debug("Sign in error: ", error);
            return AuthResult.Error;
        }
        if (!user) {
            return AuthResult.ConfirmationRequired;
        }
        return await this._loadUser(user);
    }

    async signOut(): Promise<AuthResult.Success | AuthResult.Error> {
        const { error } = await this.client.auth.signOut();
        if (error) {
            console.debug("Sign out error: ", error);
            return AuthResult.Error;
        }
        this._user.set(null);
        return AuthResult.Success;
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
                    id, spaces, description, imagePath,
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

