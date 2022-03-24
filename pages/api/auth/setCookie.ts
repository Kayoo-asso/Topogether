import { NextApiHandler } from "next";
import { CookieSerializeOptions, serialize } from 'cookie';
import { jwtDecoder, AccessJWT } from "helpers";
import { AuthTokens } from "helpers/services";

export const AccessTokenCookie = "topogether-access";
export const RefreshTokenCookie = "topogether-refresh";

const cookieOptions: CookieSerializeOptions = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
}

const deleteCookie = (cookie: string): string =>
    serialize(cookie, "", { ...cookieOptions, expires: new Date(0) })

const handler: NextApiHandler<{}> = (req, res) => {
    console.log("Called setCookie API route");
    if (req.method === "DELETE") {
        res.setHeader("Set-Cookie", [
            deleteCookie(AccessTokenCookie),
            deleteCookie(RefreshTokenCookie)
        ]);
        res.status(200);
        res.json({});
        return;
    }
    else if (req.method === "POST") {
        const tokens = req.body as AuthTokens;
        // TODO: validation?
        const jwt = jwtDecoder(tokens.accessToken) as AccessJWT;
        const expires = new Date(jwt.exp * 1000);
        const cookies = [
            serialize(AccessTokenCookie, tokens.accessToken, {
                ...cookieOptions,
                expires
            })
        ];
        if (tokens.refreshToken) {
            cookies.push(
                serialize(RefreshTokenCookie, tokens.refreshToken, cookieOptions)
            );
        }
        res.setHeader("Set-Cookie", cookies);
        res.status(200);
        res.json({});
        return;
    }

    // error
    res.status(400);
    res.json({});
    return;
}

export default handler;