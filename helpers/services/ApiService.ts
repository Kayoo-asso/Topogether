import { createClient, SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import { DBUser, DBUserUpdate, Email, Name, User } from 'types';
import { Quark, quark } from 'helpers/quarky';
import { DBConvert } from "./DBConvert";

export enum AuthResult {
    Success,
    ConfirmationRequired,
    Error
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
            .from<DBUser>("users")
            .select("*")
            .match({ id: authUser.id })
            .single();

        if (error || !data) {
            console.debug("Error loading up user: ", error);
            return AuthResult.Error;
        }
        
        const user = DBConvert.userFromDB(data!);
        this._user.set(user);
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
            data: { user_name: pseudo }
        });
        this.client.from("topos").select
        if (error) {
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
        return AuthResult.Success;
    }

    async updateUserInfo(user: User): Promise<AuthResult.Success | AuthResult.Error> {
        const update = DBConvert.userToDB(user);
        const { error } = await this.client
            .from<DBUserUpdate>("users")
            .update(update);
        if (error) {
            console.debug("Error updating user info: ", error);
            return AuthResult.Error;
        }
        // ASSUME the user is not null atm
        this._user.set(user);
        return AuthResult.Success;
    }

}

export const api = new ApiService();
api.initSession();
