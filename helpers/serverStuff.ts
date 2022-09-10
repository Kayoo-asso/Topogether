import { parse } from "cookie";
import { IncomingMessage } from "http";
import { Redirect, NextPageContext, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { UUID, Role, User } from "types";
import { auth, supabaseClient } from "./services";

export const AccessTokenCookie = "topogether-access";
export const RefreshTokenCookie = "topogether-refresh";

// Contains more, but we only need those
export type AccessJWT = {
	sub: UUID; // UUID
	exp: number; // expiry date, in seconds
	email: string;
	user_metadata: { role: Role };
};

export const loginRedirect = (source: string) => {
	console.log("Login redirect from " + source);
	return {
		redirect: {
			destination: `/user/login?redirectTo=${source}`,
			permanent: false,
		},
	};
};

export const jwtDecoder = (jwt: string): AccessJWT =>
	JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString("utf8"));

function isNotFound<P>(
	props: GetServerSidePropsResult<P>
): props is { notFound: true } {
	return (props as any).notFound === true;
}
function isRedirect<P>(
	props: GetServerSidePropsResult<P>
): props is { redirect: Redirect } {
	return (props as any).redirect !== undefined;
}

type RedirectWithStatusCode = {
	statusCode: 301 | 302 | 303 | 307 | 308;
	destination: string;
	basePath?: false;
};

const hasStatusCode = (r: Redirect): r is RedirectWithStatusCode => {
	return (r as any).statusCode !== undefined;
};

type WithRoutingOptions<Props> = {
	getInitialProps(
		ctx: NextPageContext
	): GetServerSidePropsResult<Props> | Promise<GetServerSidePropsResult<Props>>;
	render(props: Props): React.ReactElement<any, any> | null;
};

type GetServerSidePropsResult<P> =
	| { props: P }
	| { redirect: Redirect }
	| { notFound: true };

export function withRouting<Props>({
	render,
	getInitialProps,
}: WithRoutingOptions<Props>): NextPage<GetServerSidePropsResult<Props>> {
	const page: NextPage<GetServerSidePropsResult<Props>> = ({
		children,
		...props
	}) => {
		const router = useRouter();
		// Those two conditions should never be hit on the server,
		// since we send directly 404 or redirect responses in those cases
		if (isNotFound(props)) {
			router.push("/404");
			return null;
		}
		if (isRedirect(props)) {
			const r = props.redirect;
			const dest = (r.basePath || "") + r.destination;
			router.push(dest);
			return null;
		}
		return render({
			...props.props,
			children,
		});
	};

	page.getInitialProps = async (
		ctx: NextPageContext
	): Promise<GetServerSidePropsResult<Props>> => {
		const result = await getInitialProps(ctx);
		if (isNotFound(result)) {
			if (ctx.res) {
				ctx.res.writeHead(404);
				ctx.res.end();
			}
			return result;
		}
		if (isRedirect(result)) {
			if (ctx.res) {
				const r = result.redirect;
				const dest = (r.basePath || "") + r.destination;
				if (hasStatusCode(r)) {
					ctx.res.writeHead(r.statusCode, { Location: dest });
					ctx.res.end();
				} else {
					ctx.res.writeHead(r.permanent ? 301 : 307, { Location: dest });
					ctx.res.end();
				}
			}
			// If we couldn't handle the routing on the server, handle on client
			return result;
		}
		const props = result.props;
		return {
			props: await props,
		};
	};

	return page;
}

// Very hacky way of ensuring we only fetch the user's profile once,
// even if we do it in App.getInitialProps and in the data loading for some page
let ongoingFetches: Map<string, Promise<User | null>> = new Map();

export function getSessionId(ctx: NextPageContext): UUID | undefined {
	return (ctx as any).sessionId;
}

export async function getUserInitialProps(
	ctx: NextPageContext
): Promise<User | null> {
	if (auth) {
		return auth.session();
	}
	const userId = getSessionId(ctx);

	if (!userId) {
		return null;
	}
	const ongoing = ongoingFetches.get(userId);
	if (ongoing !== undefined) {
		return await ongoing;
	}

	let resolve: (result: User | null) => void;
	ongoingFetches.set(
		userId,
		new Promise<User | null>(
			(r) =>
				(resolve = (user) => {
					r(user);
					// Make sure to remove this ongoingFetch from the cache
					ongoingFetches.delete(userId);
				})
		)
	);

	const { data, error } = await supabaseClient
		.from<User>("accounts")
		.select("*")
		.eq("id", userId)
		.single();
	// Error cases fall back to returning null
	if (error || !data) {
		console.error("Error retrieving user information", error);
		resolve!(null);
		return null;
	}
	resolve!(data);
	return data;
}

export async function initSupabaseSession(req: IncomingMessage | undefined) {
	if (!req || !req.headers["cookie"]) return;

	const cookies = parse(req.headers["cookie"]);
	let accessToken: string | undefined = cookies[AccessTokenCookie];
	const refreshToken: string | undefined = cookies[RefreshTokenCookie];
	if (
		(!accessToken || jwtDecoder(accessToken).exp * 1000 < Date.now()) &&
		refreshToken
	) {
		const { session, error } = await supabaseClient.auth.setSession(
			refreshToken
		);
		if (error) console.error("Error refreshing access token:", error);
		accessToken = session?.access_token;
	} else if (accessToken) {
		// otherwise fetching won't work
		supabaseClient.auth.setAuth(accessToken);
	}
	// If we had a successful authentication
	if (accessToken) {
		return jwtDecoder(accessToken).sub;
	}
}
