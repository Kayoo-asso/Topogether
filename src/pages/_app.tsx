import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Initializers } from "helpers/services/Initializers";
import type { AppType } from "next/app";
import Head from "next/head";
import { NavigationLoader } from "~/components/layout/NavigationLoader";
import { ShellMobile } from "~/components/layout/ShellMobile";
import { DeviceProvider } from "~/components/providers/DeviceProvider";
import { UserPositionProvider } from "~/components/providers/UserPositionProvider";
import { Mobile } from "~/components/responsive";
import { api } from "~/server/api";
import "~/styles/globals.css";

const queryClient = new QueryClient();

const App: AppType<{}> = ({ Component, pageProps }) => {
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

			<Initializers />

			<ClerkProvider {...pageProps}>
				<QueryClientProvider client={queryClient}>
					<DeviceProvider>
						<UserPositionProvider>
							<NavigationLoader>
								<div
									id="content"
									className="flex h-screen w-screen flex-1 bg-grey-light"
								>
									<Component {...pageProps} />
								</div>
								<Mobile>
									<div
										id="footer"
										className="absolute bottom-0 z-500 h-shell bg-dark"
									>
										<ShellMobile />
									</div>
								</Mobile>
							</NavigationLoader>
						</UserPositionProvider>
					</DeviceProvider>
				</QueryClientProvider>
			</ClerkProvider>
		</>
	);
};

export default api.withTRPC(App);
