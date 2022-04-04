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
    const accessToken = cookies[AccessTokenCookie];
    const refreshToken = cookies[RefreshTokenCookie];
    if (!accessToken) return null;
    
    const key = accessToken + (refreshToken || '');
    const previous = sessions.get(key);
    if (previous) {
        console.log("Found result from previous getServerUser run:", previous);
        return previous;
    }
    console.log("First getServerUser");

    // Get access token expiry date
    const jwt = jwtDecoder(accessToken) as AccessJWT;
    // the expiration timestamp is in seconds, not ms
    const expired = Date.now() > (jwt.exp * 1000);


    let id: UUID | null = null;
    if (!expired) {
        supabaseClient.auth.setAuth(accessToken);
        id = jwt.sub;
    }
    // TODO: do we need to send the refreshed access token back to the client?
    else if (refreshToken) {
        console.log("Refreshing access token...");
        await supabaseClient.auth.api.refreshAccessToken(refreshToken)
        const { session } = await supabaseClient.auth.setSession(refreshToken);
        if (session?.user?.id) {
            id = session.user.id as UUID;
        }
    }
    if (id) {
        const { data, error } = await supabaseClient
            .from<User>("users")
            .select('*')
            .eq('id', id)
            .single();
        // Error cases fall back to returning null
        if (error) {
            console.error("Error retrieving user information", error);
        } else if (!data) {
            console.error("Error retrieving user information for " + id);
        } else {
            sessions.set(key, data);
            return data;
        }
    }
    sessions.set(key, null);
    return null;
}