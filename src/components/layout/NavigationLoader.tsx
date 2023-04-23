import Spinner from "assets/icons/spinner.svg";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Portal } from "~/components/ui/Modal";

export const LoaderContext = createContext((_: boolean) => {});

export const useLoader = () => useContext(LoaderContext);

export function NavigationLoader({ children }: React.PropsWithChildren<{}>) {
	const router = useRouter();
	const [active, setActive] = useState(false);
	useEffect(() => {
		const show = () => setActive(true);
		const hide = () => setActive(false);

		router.events.on("routeChangeStart", show);
		router.events.on("routeChangeError", hide);
		router.events.on("routeChangeComplete", hide);

		return () => {
			router.events.off("routeChangeStart", show);
			router.events.off("routeChangeComplete", hide);
			router.events.off("routeChangeError", hide);
		};
	}, []);

	return (
		<>
			<Portal id="loader" open={active}>
				{/* Leave zIndex into "style" (tailwind bug) */}
				<div
					className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
					style={{ zIndex: 10000 }}
				>
					<Spinner className="m-2 h-10 w-10 animate-spin stroke-main" />
				</div>
			</Portal>
			<LoaderContext.Provider value={setActive}>
				{children}
			</LoaderContext.Provider>
		</>
	);
}
