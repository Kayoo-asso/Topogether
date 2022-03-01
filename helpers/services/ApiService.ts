import { createClient, SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import { DBBoulder, DBLine, DBManager, DBParking, DBSector, DBTopoAccess, DBTrack, DBWaypoint, Email, BoulderImage, ImageType, Name, TopoData, User, UUID, DBBoulderImage, Topo, DBTopo } from 'types';
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

    async getTopo(id: UUID): Promise<TopoData | null> {
        const { data, error } = await this.client
            .rpc<TopoData>("getTopo", { topo_id: id })
            .single();
        if (error || !data) {
            console.error("Error getting topo data: ", error);
            return null;
        }
        return data;
    }

    async saveTopo(topo: Topo): Promise<boolean> {
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

        for (const p of topo.parkings) {
            dbParkings.push(DBConvert.parking(p, topo.id));
        }

        for (const w of topo.waypoints) {
            dbWaypoints.push(DBConvert.waypoint(w, topo.id));
        }

        for (const m of topo.managers) {
            dbManagers.push(DBConvert.manager(m, topo.id));
        }

        for (const a of topo.accesses) {
            dbAccesses.push(DBConvert.topoAccess(a, topo.id));
        }

        for (const s of topo.sectors) {
            dbSectors.push(DBConvert.sector(s, topo.id));
        }

        for (const b of topo.boulders) {
            dbBoulders.push(DBConvert.boulder(b, topo.id));
            for (const i of b.images) {
                dbBoulderImages.push(DBConvert.boulderImage(i, topo.id));
            }
            for (const t of b.tracks) {
                dbTracks.push(DBConvert.track(t, topo.id, b.id));
                for (const l of t.lines) {
                    dbLines.push(DBConvert.line(l, topo.id, t.id));
                }
            }
        }
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
                .upsert(dbBoulderImages, { returning: "minimal" })
            ,
            this.client
                .from<DBTrack>("tracks")
                .upsert(dbTracks, { returning: "minimal" }),
            this.client
                .from<DBLine>("lines")
                .upsert(dbLines, { returning: "minimal" }),
        ];

        const results = await Promise.all(promises);
        let error = false;
        for (const res of results) {
            if (res.error) {
                error = true;
                console.error("Error saving topo to DB: ", res.error);
            }
        }
        return error;
    }
}

export const api = new ApiService();
api.initSession();
