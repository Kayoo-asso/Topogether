import { withClerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
 
// Set the paths that don't require the user to be signed in
const publicPaths = ["/", "/topo*", "/sign-up"];
// Separate, so we can redirect the user to the dashboard if they're already signed in
const loginPath = "/login";
 
const findMatch = (patterns: string[], path: string) => {
  return patterns.find((x) =>
    path.match(new RegExp(`^${x}$`.replace("*$", "($|/)")))
  );
};
 
export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);
  // If the user is already logged in and navigating to /login, redirect to world map
  if(userId && findMatch([loginPath], request.nextUrl.pathname)) {
    const rootUrl = new URL("/", request.url)
    return NextResponse.redirect(rootUrl)
  }

  const isPublic = findMatch([...publicPaths, loginPath], request.nextUrl.pathname); 
  // if the user is not signed in and this is not a public page, redirect them to the login page.
  if (!userId && !isPublic) {
    const logInUrl = new URL(loginPath, request.url);
    logInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(logInUrl);
  }
  // otherwise, let them through
  return NextResponse.next();
});
 
// Stop Middleware running on static files and public folder
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next
     * - static (static files)
     * - favicon.ico (favicon file)
     * - public folder
     * - trpc API route
     */
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/",
  ],
}