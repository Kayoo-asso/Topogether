import { createClient, SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import { DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopoAccess, DBTrack, DBWaypoint, Email, BoulderImage, ImageType, Name, TopoData, User, UUID, DBBoulderImage, Topo, DBTopo, LightTopo } from 'types';
import { Quark, quark } from 'helpers/quarky';
import { DBConvert } from "./DBConvert";
import { DBSchema } from "idb";

export enum AuthResult {
    Success,
    ConfirmationRequired,
    Error
}

export interface ImageUploadSuccess {
    id: UUID,
    url: string,
}

export interface BasicUser {}

export class ApiService {
    client: SupabaseClient;
    private _user: Quark<User | null>;

    constructor() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const API_KEY = process.env.NEXT_PUBLIC_ANON_KEY!;
        this.client = createClient(API_URL, API_KEY);
        this._user = quark<User | null>(null);
    }

    async initSession() {
        const authUser = this.client.auth.user();
        if (authUser) {
            // this._user.set({
            //     id: authUser.id as UUID,
            //     email: authUser.email as Email
            // });
            // don't handle possible API error here
            await this._loadUser(authUser);
        }
    }

    private async _loadUser(authUser: AuthUser): Promise<AuthResult.Success | AuthResult.Error> {
        const { data, error } = await this.client
            .from<User>("users")
            .select("*")
            .match({ id: authUser.id })
            .single();

        if (error || !data) {
            console.debug("Error loading up user: ", error);
            return AuthResult.Error;
        }
        
        this._user.set(data);
        return AuthResult.Success;
    }

    user(): User | null {
        return this._user();
    }

    async signup(email: Email, password: string, pseudo: Name): Promise<AuthResult> {
        const { user, session, error } = await this.client.auth.signUp({
            email,
            password
        }, {
            redirectTo: "/",
            data: { userName: pseudo }
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

    async updateUserInfo(user: User): Promise<AuthResult.Success | AuthResult.Error> {
        const { error } = await this.client
            .from<User>("users")
            .update(user);
        if (error) {
            console.debug("Error updating user info: ", error);
            return AuthResult.Error;
        }
        // ASSUME the user is not null atm
        this._user.set(user);
        return AuthResult.Success;
    }

    // TODO: better error handling using try / catch?
    async uploadImages(files: [File, ImageType][]): Promise<(ImageUploadSuccess | null)[]> {
        const promises: Promise<Response>[] = files.map(([file, type]) => 
            fetch("api/images/upload?type=" + type, {
                method: "PUT",
                body: file
            })
        );
        const res = await Promise.all(promises);
        const output: (ImageUploadSuccess | null)[] = new Array(res.length);
        for (const response of res) {
            if (response.ok) {
                const data = await response.json() as ImageUploadSuccess;
                output.push(data);
            } else {
                output.push(null);
            }
        }
        return output;
    }

    async deleteImage(path: string): Promise<boolean> {
        const res = await fetch("/api/images/delete", {
            method: "DELETE",
            body: JSON.stringify({
                path
            })
        });
        return res.ok;
    }

    async getAllLightTopos(): Promise<LightTopo[]> {
        const { data, error } = await this.client
            .rpc<LightTopo>("all_light_topos");

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
            .from("topos")
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
                    images:boulder_images!boulderId(
                        id, index, width, height, imagePath
                    ),
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
            .single();
        if (error) {
            console.error("Error getting topo data: ", error);
            return null;
        }
        return data;
    }

    // Promises have to be awaited in order, to make sure
    // foreign key references do not fail
    async saveTopo(topo: Topo | TopoData): Promise<boolean> {
        const dbTopo = DBConvert.topo(topo);
        const dbSectors: DBSector[] = [];
        const dbWaypoints: DBWaypoint[] = [];
        const dbManagers: DBManager[] = [];
        const dbParkings: DBParking[] = [];
        const dbAccesses: DBTopoAccess[] = [];
        const dbBoulders: DBBoulder[] = [];
        const dbBoulderImages: DBBoulderImage[] = [];
        const dbTracks: DBTrack[] = [];
        const dbLines: DBLine[] = [];

        if (topo.parkings) {
            for (const p of topo.parkings) {
                dbParkings.push(DBConvert.parking(p, topo.id));
            }
        }

        if (topo.waypoints) {
            for (const w of topo.waypoints) {
                dbWaypoints.push(DBConvert.waypoint(w, topo.id));
            }
        }

        if (topo.managers) {
            for (const m of topo.managers) {
                dbManagers.push(DBConvert.manager(m, topo.id));
            }
        }

        if (topo.accesses) {
            for (const a of topo.accesses) {
                dbAccesses.push(DBConvert.topoAccess(a, topo.id));
            }
        }

        if (topo.sectors) {
            for (const s of topo.sectors) {
                dbSectors.push(DBConvert.sector(s, topo.id));
            }
        }

        if (topo.boulders) {
            for (const b of topo.boulders) {
                dbBoulders.push(DBConvert.boulder(b, topo.id));
                for (const i of b.images) {
                    dbBoulderImages.push(DBConvert.boulderImage(i, topo.id, b.id));
                }
                for (const t of b.tracks) {
                    dbTracks.push(DBConvert.track(t, topo.id, b.id));
                    for (const l of t.lines) {
                        dbLines.push(DBConvert.line(l, topo.id, t.id));
                    }
                }
            }
        }
        // Ordering is important, to make sure foreign key relations do not break!
        const promises = [
            this.client
                .from<DBTopo>("topos")
                .upsert(dbTopo, { returning: "minimal" }),
            this.client
                .from<DBParking>("parkings")
                .upsert(dbParkings, { returning: "minimal" }),
            this.client
                .from<DBWaypoint>("waypoints")
                .upsert(dbWaypoints, { returning: "minimal" }),
            this.client
                .from<DBManager>("managers")
                .upsert(dbManagers, { returning: "minimal" }),
            this.client
                .from<DBTopoAccess>("topo_accesses")
                .upsert(dbAccesses, { returning: "minimal" }),
            this.client
                .from<DBSector>("sectors")
                .upsert(dbSectors, { returning: "minimal" }),
            this.client
                .from<DBBoulder>("boulders")
                .upsert(dbBoulders, { returning: "minimal" }),
            this.client
                .from<DBBoulderImage>("boulder_images")
                .upsert(dbBoulderImages, { returning: "minimal" }),
            this.client
                .from<DBTrack>("tracks")
                .upsert(dbTracks, { returning: "minimal" }),
            this.client
                .from<DBLine>("lines")
                .upsert(dbLines, { returning: "minimal" }),
        ];
        let success = true;
        for (const promise of promises) {
           const res = await promise;
           if (res.error) {
               success = false;
               console.error("Error saving topo to DB: ", res.error);
           }
        }
        return success;

    }
}

