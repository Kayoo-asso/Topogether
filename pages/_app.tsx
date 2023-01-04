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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PageCaching } from "helpers/services/PageCaching";

type CustomProps = {
	session: User | null;
	userAgent?: string;
};

const isServer = typeof window === "undefined";

type InitialProps = AppInitialProps & CustomProps;
type Props = AppProps & CustomProps;

const queryClient = new QueryClient();

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
					content="Escalade Climbing Topo Topographie Grimpe Cartographie Carte Map Bloc Boulder"
				/>

				<title>Topogether</title>
				<link rel="manifest" href="/manifest.json" />

				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
    			<meta name="apple-touch-fullscreen" content="yes" />

				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/assets/favicon/touch/Touch-icon-180.png"
				></link>

				<link
					rel="apple-touch-startup-image"
					media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
					href="/assets/splash/1136_640.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				href="/assets/splash/2436_1125.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				href="/assets/splash/1792_828.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/828_1792.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				href="/assets/splash/1334_750.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				href="/assets/splash/1242_2688.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				href="/assets/splash/2208_1242.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				href="/assets/splash/1125_2436.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				href="/assets/splash/1242_2208.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				href="/assets/splash/2732_2048.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
				href="/assets/splash/2688_1242.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				href="/assets/splash/2224_1668.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/750_1334.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/2048_2732.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
				href="/assets/splash/2388_1668.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/1668_2224.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/640_1136.png"
				/>
				<link
				rel="apple-touch-startup-image"
				media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				href="/assets/splash/1668_2388.png"
				/>
				<link
					rel="apple-touch-startup-image"
					media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
					href="/assets/splash/2048_1536.png"
				/>
				<link
					rel="apple-touch-startup-image"
					media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
					href="/assets/splash/1536_2048.png"
				/>

			</Head>

			<PageCaching />

			<AuthProvider initial={session}>
				<DeviceManager userAgent={userAgent}>
					<UserPositionProvider>
						<NavigationLoader>
							<QueryClientProvider client={queryClient}>
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
							</QueryClientProvider>
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
