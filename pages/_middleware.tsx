import { getServerSession } from "helpers/getServerSession";
import { NextMiddleware, NextResponse } from "next/server";
import { AccessTokenCookie, RefreshTokenCookie } from "./api/auth/setCookie";

let protectedRoutes = [
    '/builder',
    '/admin',
    '/user/changePassword',
    '/user/profile',
];

export const middleware: NextMiddleware = async (req, event) => {
    let restricted = false;
    const pathname = req.nextUrl.pathname;
    for (const route of protectedRoutes) {
        if (pathname.startsWith(route)) {
            restricted = true;
            break;
        }
    }
    // TODO: improve security for admin and builder
    if (restricted) {
        const session = await getServerSession(req.headers.get('cookie'), false);
        if (!session) {
            console.log("Redirect to login");
            return NextResponse.redirect("/user/login");
        }
    }
    return NextResponse.next();
}