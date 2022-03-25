import { AuthChangeEvent, User as SupabaseUser, Session as SupabaseSession, SupabaseClient } from "@supabase/supabase-js";
import { quark, Quark } from "helpers/quarky";
import { Email, Name, Role, Session, User, UUID } from "types";
import { sync } from ".";

export type AuthTokens = {
    accessToken: string,
    refreshToken?: string
}

export enum AuthResult {
    Success,
    ConfirmationRequired,
    Error
}

const authCookieRoute = "/api/auth/setCookie";

export function makeSession(user: SupabaseUser): Session {
    const role = user.user_metadata.role;
    if (role !== "USER" && role !== "ADMIN") {
        throw new Error("User role not correctly saved in authentication token");
    }
    if (!user.email) {
        throw new Error("User does not have registered email!");
    }
    return {
        id: user.id as UUID,
        email: user.email as Email,
        role: role,
        user: null
    };
};

async function fetchOnClient(input: RequestInfo, init?: RequestInit): Promise<void> {
    if (typeof window !== "undefined") {
        console.log("Fetching client-side");
        await fetch(input, init);
    }
    else {
        console.log("Avoiding fetch server-side");
    }
}

export class AuthService {
    private client: SupabaseClient;
    private _session: Quark<Session | null>

    constructor(client: SupabaseClient) {
        this.client = client;
        const user = this.client.auth.user();
        // User was already logged in
        if (user) {
            // 1. Synchronously update session info
            const session: Session = makeSession(user);
            this._session = quark<Session | null>(session);
            // 2. Asynchronously fetch user data
            this._loadUser(session);
        } else {
            this._session = quark<Session | null>(null);
        }
        // initialize the quark before giving a callback to the Supabase client
        this.client.auth.onAuthStateChange(this._onAuthStateChange.bind(this));
        // User was not logged in
    }

    session(): Session | null {
        return this._session();
    }

    updateUserInfo(user: User) {
        const session = this._requireSession();
        sync.userUpdate(user);
        this._session.set({
            ...session,
            user
        });
    }

    async signUp(email: Email, password: string, pseudo: Name): Promise<AuthResult> {
        const role: Role = "USER"; 
        const { user, session, error } = await this.client.auth.signUp({
            email, password
        }, {
            redirectTo: "/",
            data: { userName: pseudo, role }
        });
        if (error) {
            // user already exists
            if (error.status === 400) {

            }
            // server error
            if (error.status === 500) {

            }
            console.error("Sign up error: ", error);
            console.error("Session: ", session);
            console.error("User: ", user);
            return AuthResult.Error;
        }

        // No confirmation required (probably dev environment)
        if (user) {
            const session = makeSession(user);
            return await this._loadUser(session);
        }
        // Regular scenario
        return AuthResult.ConfirmationRequired;
    }

    async signIn(email: Email, password: string): Promise<AuthResult> {
        const { user, error } = await this.client.auth.signIn({ email, password });
        if (error) {
            console.error("Sign in error: ", error);
            return AuthResult.Error;
        }
        if (!user) {
            return AuthResult.ConfirmationRequired;
        }
        const session = makeSession(user);
        return await this._loadUser(session);
    }

    async signOut(): Promise<AuthResult.Success | AuthResult.Error> {
        const { error } = await this.client.auth.signOut();
        if (error) {
            console.error("Sign out error: ", error);
            return AuthResult.Error;
        }
        this._session.set(null);
        return AuthResult.Success;
    }

    private async _loadUser(session: Session): Promise<AuthResult.Success | AuthResult.Error> {
        const { data, error } = await this.client
            .from<User>("users")
            .select("*")
            .match({ id: session.id })
            // single and not maybeSingle, since the row has to exist if we have a Supabase auth token
            .single();

        if (error || !data) {
            console.error("Error loading up user data.", error);
            return AuthResult.Error;
        }
        
        this._session.set({
            ...session,
            user: data
        });
        return AuthResult.Success;
    }

    private _requireSession(): Session {
        const session = this._session();
        if (!session) {
            throw new Error("Action requires user to be logged in!");
        }
        return session;
    }

    private async _onAuthStateChange(event: AuthChangeEvent, session: SupabaseSession | null) {
        if (!session || event === "SIGNED_OUT") {
            this._session.set(null);
            await fetchOnClient(authCookieRoute, {
                method: "DELETE"
            });
            return;
        }
        if (!session.user) {
            // TODO: are there legitimate cases where this can happen?
            throw new Error("Session without user!");
        }
        const currentSession = this._session();
        if (currentSession?.id !== session.user.id) {
            const newSession = makeSession(session.user);
            // async call
            this._loadUser(newSession);
        }

        let tokens: AuthTokens = {
            accessToken: session.access_token,
            refreshToken: session.refresh_token
        };
        // do we need to await this one?
        await fetchOnClient(authCookieRoute, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tokens)
        });
    }
}