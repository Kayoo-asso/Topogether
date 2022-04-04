import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";
import { AccessTokenCookie, RefreshTokenCookie } from "helpers/auth";

let protectedRoutes = [
    '/builder',
    '/builder/new',
    '/builder/dashboard',
    '/admin',
    '/user/changePassword',
    '/user/profile',
];

const route = (path: string) => {}

export const middleware: NextMiddleware = async (req, event) => {
    const pathname = req.nextUrl.pathname;
    const restricted = protectedRoutes.includes(pathname);
    // TODO: improve security for admin and builder
    if (restricted) {
        // const accessToken = req.cookies[AccessTokenCookie];
        // const refreshToken = req.cookies[RefreshTokenCookie];
        console.log("Middleware running for restricted route " + pathname);
        // const session = await getServerUser(req.headers.get('cookie'));
        // if (!session) {
        //     const url = req.nextUrl.clone();
        //     url.pathname = "/user/login";
        //     url.searchParams.set("redirectTo", pathname);
        //     console.log("Redirect to " + url);
        //     return NextResponse.rewrite(url);
        // }
    }
    return NextResponse.next();
}