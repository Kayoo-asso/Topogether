import { AuthChangeEvent, Session as SupabaseSession, SupabaseClient } from "@supabase/supabase-js";
import { quark, Quark } from "helpers/quarky";
import { DBUserUpdate, Email, Name, Role, User } from "types";
import { createContext, useContext } from "react";
import { DBConvert } from "./DBConvert";
import { AccessTokenCookie, RefreshTokenCookie } from "helpers/auth";

export enum SignUpRes {
    LoggedIn,
    ConfirmationRequired,
    AlreadyExists,
    Error
}

export enum SignInRes {
    Ok,
    ConfirmationRequired,
    Error
}

export enum SignOutRes {
    Ok,
    Error
}

export const AuthContext = createContext<AuthService>(undefined!);

export function useAuth(): AuthService {
    return useContext(AuthContext);
}

export function useSession() {
    return useContext(AuthContext).session();
}

// Model for testing sessions from URL:
// http://localhost:3000/#access_token=&expires_in=3600&refresh_token=&token_type=bearer&type=signup
export class AuthService {
    private client: SupabaseClient;
    private _session: Quark<User | null>;

    constructor(client: SupabaseClient, serverSession: User | null = null) {
        this.client = client;

        // ensures consistent rendering
        this._session = quark<User | null>(serverSession);

        // no need to check URL or setup a callback on the server
        if (typeof window === "undefined") {
            return;
        }

        // setup callback
        this.client.auth.onAuthStateChange(this._onAuthStateChange.bind(this));

        // Check for a session from the URL, which takes precedence
        client.auth.getSessionFromUrl({ storeSession: true }).then(({ data }) => {
            if (data?.user) {
                return this._loadDetails(data.user.id);
            }
        });
    }

    session(): User | null {
        return this._session();
    }

    async updateUserInfo(user: User): Promise<boolean> {
        const session = this._session();
        if (!session) {
            throw new Error("Action requires user to be logged in!");
        }
        const dto = DBConvert.user(user);
        const { error } = await this.client
            .from<DBUserUpdate>("users")
            .update(dto)
            .eq('id', dto.id);
        if (error) {
            console.error("Error updating user info:", error);
            return false;
        }
        // this is safe, since even modifying role or email won't bypass DB authorizations
        this._session.set(user);
        return true;
    }

    async signUp(email: Email, password: string, pseudo: Name): Promise<SignUpRes> {
        const role: Role = "USER";
        const { user, session, error } = await this.client.auth.signUp({
            email, password
        }, {
            data: { userName: pseudo, role }
        });
        if (error) {
            console.error("Sign up error: ", error);
            console.error("Session: ", session);
            console.error("User: ", user);

            return error.status === 400
                ? SignUpRes.AlreadyExists
                : SignUpRes.Error; // generic server error
        }
        // No confirmation required (probably dev environment)
        if (user) {
            return await this._loadDetails(user.id) ? SignUpRes.LoggedIn : SignUpRes.Error;
        }
        // Regular scenario
        return SignUpRes.ConfirmationRequired;
    }

    async signIn(email: Email, password: string): Promise<SignInRes> {
        const { user, error } = await this.client.auth.signIn({ email, password });
        if (error) {
            console.error("Sign in error: ", error);
            return SignInRes.Error;
        }
        if (!user) {
            return SignInRes.ConfirmationRequired;
        }
        return await this._loadDetails(user.id) ? SignInRes.Ok : SignInRes.Error;
    }

    async signOut(): Promise<boolean> {
        const { error } = await this.client.auth.signOut();
        if (error) {
            console.error("Sign out error!", error);
            return false;
        }
        return true;
    }

    async changeEmail(email: Email): Promise<boolean> {
        const { user, error } = await this.client.auth.update({ email });
        if (error) {
            console.error("Error updating email:", error);
            return false;
        }
        console.log("Updated email, received user:", user);
        return true;
    }

    // doesn't change the user as far as I know
    async changePassword(password: string): Promise<boolean> {
        const { error } = await this.client.auth.update({ password });
        if (error) {
            console.error("Error updating password:", error);
            return false;
        }
        return true;
    }

    private async _loadDetails(id: string | undefined): Promise<boolean> {
        if (!id) {
            this._session.set(null);
            return true;
        }
        const { data, error } = await this.client
            .from<User>("users")
            .select("*")
            .match({ id })
            // single and not maybeSingle, since the row has to exist if we have a Supabase user
            .single();
        if (error || !data) {
            console.error("Error loading up user data.", error);
            return false;
        }
        this._session.set(data);
        return true;
    }

    // Manually setting cookies w/ those options is as safe as localStorage,
    // which is where Supabase usually stores auth tokens
    private async _onAuthStateChange(event: AuthChangeEvent, session: SupabaseSession | null) {
        if (event === "SIGNED_OUT") {
            this._session.set(null);
            deleteCookie(AccessTokenCookie);
            deleteCookie(RefreshTokenCookie);
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            if (session) {
                const expires = session.expires_at
                    ? new Date(1000 * session.expires_at)
                    : undefined;
                setCookie(AccessTokenCookie, session.access_token, { expires });
                if (session.refresh_token) {
                    setCookie(RefreshTokenCookie, session.refresh_token);
                }
            }
        } else {
            console.log(`Skipping event ${event} and session:`, session);
        }
    }
}

type CookieOptions = {
    domain?: string,
    path?: string,
    maxAge?: number,
    expires?: Date,
    sameSite?: true | false | 'lax' | 'strict' | 'none',
    secure?: boolean
};


function setCookie(name: string | number | boolean, value: string | number | boolean, options: CookieOptions = {}) {
    options = {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === "production",
        // add other defaults here if necessary
        ...options
    };

    if (options.expires instanceof Date) {
        (options as any).expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey as keyof CookieOptions];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

const deleteCookie = (name: string) => setCookie(name, '', { expires: new Date(0) });