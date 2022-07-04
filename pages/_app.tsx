import "styles/globals.css";
import App from "next/app";
import type { AppProps, AppContext, AppInitialProps } from "next/app";
import Head from "next/head";
import { supabaseClient } from "helpers/services";
import { AuthProvider } from "components/AuthProvider";
import { ShellMobile } from "components/layouts/ShellMobile";
import { DeviceManager, UserPositionProvider } from "helpers/hooks";
import { initSupabaseSession, getUserInitialProps } from "helpers/serverStuff";
import { resetServerContext } from "react-beautiful-dnd";
import { User } from "types";
import { NavigationLoader } from "components/layouts/NavigationLoader";

type CustomProps = {
	session: User | null;
	userAgent?: string;
};

const isServer = typeof window === "undefined";

type InitialProps = AppInitialProps & CustomProps;
type Props = AppProps & CustomProps;

const CustomApp = ({ Component, pageProps, session, userAgent }: Props) => {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
				/>
				<meta
					name="description"
					content="Des topos gratuits, complets et collaboratifs"
				/>
				<meta name="theme-color" content="#04D98B" />
				<meta
					name="keywords"
					content="Escalade Climbing Topo Topographie Grimpe Cartographie"
				/>

				<title>Topogether</title>
				<link rel="manifest" href="/manifest.json" />

				<link
					rel="apple-touch-icon"
					href="/assets/touch/icon-512x512.png"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen640.png"
					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen750.png"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen1125.png"
					media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen1242.png"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen1536.png"
					media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen1668.png"
					media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
				></link>
				<link
					rel="apple-touch-startup-image"
					href="/assets/splash/splashscreen2048.png"
					media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
				></link>
			</Head>

			<AuthProvider initial={session}>
				<DeviceManager userAgent={userAgent}>
					<UserPositionProvider>
						<NavigationLoader>
							<div
								id="content"
								className="absolute flex h-full w-screen flex-1 flex-col overflow-hidden bg-grey-light md:h-screen"
							>
								<Component {...pageProps} />
							</div>
							<div
								id="footer"
								className="absolute bottom-0 z-500 h-shell bg-dark md:hidden"
							>
								<ShellMobile />
							</div>
						</NavigationLoader>
					</UserPositionProvider>
				</DeviceManager>
			</AuthProvider>
		</>
	);
};

CustomApp.getInitialProps = async (
	context: AppContext
): Promise<InitialProps> => {
	const req = context.ctx.req;

	const userAgent = isServer ? req?.headers["user-agent"] : navigator.userAgent;

	const sessionId = isServer
		? await initSupabaseSession(req)
		: supabaseClient.auth.user()?.id;

	// Hack to pass the sessionId to any page-level getInitialProps function
	(context.ctx as any).sessionId = sessionId;

	const [appProps, session] = await Promise.all([
		App.getInitialProps(context),
		getUserInitialProps(context.ctx),
	]);

	// Make React DnD happy
	resetServerContext();

	return { ...appProps, session, userAgent };
};

export default CustomApp;
