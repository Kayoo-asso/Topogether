import { AuthChangeEvent, Session as SupabaseSession, SupabaseClient } from "@supabase/supabase-js";
import { quark, Quark } from "helpers/quarky";
import { DBUserUpdate, Email, Name, Role, User, UUID } from "types";
import { createContext, useContext } from "react";
import { DBConvert } from "./DBConvert";

export type AuthTokens = {
    accessToken: string,
    refreshToken?: string
}

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

const authCookieRoute = "/api/auth/setCookie";

async function fetchOnClient(input: RequestInfo, init?: RequestInit): Promise<void> {
    if (typeof window !== "undefined") {
        await fetch(input, init);
    }
}

export const AuthContext = createContext<AuthService>(undefined!);

export function useAuth(): AuthService {
    return useContext(AuthContext);
}

export function useSession() {
    return useContext(AuthContext).session();
}

export class AuthService {
    private client: SupabaseClient;
    private _session: Quark<User | null>

    constructor(client: SupabaseClient, initialSession: User | null = null) {
        this.client = client;
        this._session = quark<User | null>(initialSession);
        this.client.auth.onAuthStateChange(this._onAuthStateChange.bind(this));
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
            // user already exists
            if (error.status === 400) {
                return SignUpRes.AlreadyExists;
            }
            // server error (all other statuses)
            return SignUpRes.Error;
        }

        // No confirmation required (probably dev environment)
        if (session) {
            if (user) {
                const [, signIn] = await Promise.allSettled([
                    this._setCookie(session),
                    this._loadUser(user.id as UUID)
                ]);
                return signIn.status === "fulfilled" ? SignUpRes.LoggedIn : SignUpRes.Error;
            } else {
                await this._setCookie(session);
            }
        }
        // Regular scenario
        return SignUpRes.ConfirmationRequired;
    }

    async signIn(email: Email, password: string, redirectTo?: string): Promise<SignInRes> {
        const { user, error } = await this.client.auth.signIn({ email, password }, { redirectTo });
        if (error) {
            console.error("Sign in error: ", error);
            return SignInRes.Error;
        }
        if (!user) {
            return SignInRes.ConfirmationRequired;
        }
        return await this._loadUser(user.id as UUID) ? SignInRes.Ok : SignInRes.Error;
    }

    async signOut(): Promise<boolean> {
        const [res1, res2] = await Promise.allSettled([
            this.client.auth.signOut(),
            this._deleteCookie()
        ]);
        if (res1.status === "rejected" || res2.status === "rejected" || res1.value.error) {
            console.error("Sign out error!", (res1 as any)?.value?.error);
            return false;
        }
        return true;
    }

    private async _loadUser(id: UUID): Promise<boolean> {
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

    private async _setCookie(session: SupabaseSession) {
        const tokens: AuthTokens = {
            accessToken: session.access_token,
            refreshToken: session.refresh_token
        };

        await fetchOnClient(authCookieRoute, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tokens)
        });
    }

    private async _deleteCookie() {
        await fetchOnClient(authCookieRoute, {
            method: "DELETE"
        });
        this._session.set(null);
    }

    private async _onAuthStateChange(event: AuthChangeEvent, session: SupabaseSession | null) {
        // those events are already handled in their functions, so that UI code can redirect immediately after receiving the result
        if (event !== "TOKEN_REFRESHED") return;

        // We have a session, update server cookies
        if (session) {
            const cookiePromise = this._setCookie(session);
            // We have a user different from the one in session quark => refresh data
            if (session.user && session.user.id !== this._session()?.id) {
                await Promise.allSettled([
                    cookiePromise,
                    this._loadUser(session.user.id as UUID)
                ]);
            }
            // We have no user in auth, but one in the session quark => remove it
            else if (!session.user && this._session()) {
                this._session.set(null);
                await cookiePromise;
                // Regular case, user stays the same, so we just refresh cookies on the server
            } else {
                await cookiePromise
            }
        }
        // No more session, so we just clear the quark and the cookies
        else {
            await this._deleteCookie();
        }

    }
}
