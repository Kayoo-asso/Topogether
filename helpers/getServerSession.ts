import { parse } from "cookie";
import type { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { NextRequest } from "next/server";
import { AccessTokenCookie, RefreshTokenCookie } from "pages/api/auth/setCookie";
import { Email, Session, User, UUID } from "types";
import { AccessJWT, jwtDecoder } from "./jwtDecoder";
import { makeSession, supabaseClient } from "./services";

export type Req = IncomingMessage & {
    cookies?: NextApiRequestCookies
} | NextRequest;

export async function getServerSession(cookieHeader: string | null | undefined, includeUser: boolean = true): Promise<Session | null> {
    if (!cookieHeader) return null; 
    const cookies = parse(cookieHeader);
    const accessToken = cookies[AccessTokenCookie];
    const refreshToken = cookies[RefreshTokenCookie];
    if (!accessToken) return null;

    // Get access token expiry date
    const jwt = jwtDecoder(accessToken) as AccessJWT;
    // the expiration timestamp is in seconds, not ms
    const expired = Date.now() > (jwt.exp * 1000);
    
    let session: Session | null = null;
    if (!expired) {
        // We have to build the Session manually from the JWT, since
        // `supabaseclient.auth.setAuth` does not set the User
        supabaseClient.auth.setAuth(accessToken);
        const { sub: id, email, user_metadata } = jwt; 
        session = {
            id: id as UUID,
            email: email as Email,
            role: user_metadata.role,
            user: null
        }
    } else if (refreshToken) {
        console.log("Refreshing auth session...");
        const { session: supaSession } = await supabaseClient.auth.setSession(refreshToken);
        if (supaSession) {
            // TODO: are there legitimate cases for this?
            if (!supaSession.user) throw new Error("Session without user");

            session = makeSession(supaSession.user);
        }
    } 
    if (session && includeUser) {
        const { data, error } = await supabaseClient
            .from<User>("users")
            .select('*')
            .eq('id', session.id)
            .single();
        if (error || !data) {
            console.error("Error retrieving user information for " + session.email);
        } else {
            session.user = data;
        }
    }
    return session;
}