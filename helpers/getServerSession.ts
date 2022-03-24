import { IncomingMessage } from "http";
import type { NextApiRequestCookies } from "next/dist/server/api-utils";
import { AccessTokenCookie, RefreshTokenCookie } from "pages/api/auth/setCookie";
import { Email, Session, User, UUID } from "types";
import { AccessJWT, jwtDecoder } from "./jwtDecoder";
import { api, auth, makeSession, supabaseClient } from "./services";

export type NextRequest = IncomingMessage & {
    cookies: NextApiRequestCookies
};

export async function getServerSession(req: NextRequest): Promise<Session | null> {
    const accessToken = req.cookies[AccessTokenCookie];
    const refreshToken = req.cookies[RefreshTokenCookie];
    if (!accessToken) return null;

    // Get access token expiry date
    const jwt = jwtDecoder(accessToken) as AccessJWT;
    // the expiration timestamp is in seconds, not ms
    const expired = Date.now() > (jwt.exp * 1000);
    
    if (!expired) {
        // We have to build the Session manually from the JWT, since
        // `supabaseclient.auth.setAuth` does not set the User
        // supabaseClient.auth.setAuth(accessToken);
        const { sub: id, email, user_metadata } = jwt; 
        return {
            id: id as UUID,
            email: email as Email,
            role: user_metadata.role,
            user: null
        }
    } else if (refreshToken) {
        console.log("Refreshing auth session...");
        const { session } = await supabaseClient.auth.setSession(refreshToken);
        if (session) {
            // TODO: are there legitimate cases for this?
            if (!session.user) throw new Error("Session without user");

            return makeSession(session.user);
        }
    } 
    return null;
}