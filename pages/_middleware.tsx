import { getServerSession } from "helpers/getServerSession";
import { NextResponse } from "next/server";
import type { NextMiddleware } from "next/server";

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
            const url = req.nextUrl.clone();
            url.pathname = encodeURIComponent(`/user/login?redirectTo=${pathname}`);
            return NextResponse.rewrite(url);
        }
    }
    return NextResponse.next();
}