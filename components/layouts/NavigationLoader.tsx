import { Portal } from "helpers/hooks";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { LoaderContext } from "helpers/hooks/useLoader";

import Spinner from "assets/icons/spinner.svg";

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
					className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-80"
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
