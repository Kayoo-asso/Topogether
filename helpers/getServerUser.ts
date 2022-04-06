import type { NextApiRequest } from "next";
import type { NextRequest } from "next/server";
import { AccessTokenCookie, RefreshTokenCookie, AccessJWT, jwtDecoder } from "helpers/auth";
import { Role, User, UUID } from "types";
import { supabaseClient } from "helpers/services/SupabaseClient";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

export type Req = NextApiRequest | NextRequest;

type Cookies = NextApiRequestCookies;

// TODO: store in a cookie on the request?
let sessions: Map<string, User | null> = new Map();

export type ServerSession = {
    id: UUID,
    role: Role,
    accessToken: string,
    refreshToken?: string
}

export async function getServerUser(cookies: Cookies): Promise<User | null> {
    console.log("[GetServerUser]");

    let accessToken: string | undefined = cookies[AccessTokenCookie];
    const refreshToken: string | undefined = cookies[RefreshTokenCookie];
    if ((!accessToken || jwtDecoder(accessToken).exp * 1000 < Date.now()) && refreshToken) {
        console.log("Refreshing access token. Refresh token =", refreshToken);
        const { session, error } = await supabaseClient.auth.setSession(refreshToken);
        if (error) console.error("Error refreshing access token:", error);
        accessToken = session?.access_token;
    } else if (accessToken) {
        console.log("Setting auth token");
        // otherwise fetching won't work
        supabaseClient.auth.setAuth(accessToken);
    }

    if (!accessToken) return null;
    
    const key = accessToken + (refreshToken || '');
    const previous = sessions.get(key);
    if (previous) {
        console.log("Found previous session");
        return previous;
    }

    let userId = jwtDecoder(accessToken).sub;

    console.log("Feching server user " + userId);

    const { data, error } = await supabaseClient
        .from<User>("users")
        .select('*')
        .eq('id', userId)
        .single();
    // Error cases fall back to returning null
    if (error || !data) {
        console.error("Error retrieving user information", error);
        return null;
    } 
    sessions.set(key, data);
    return data;
}