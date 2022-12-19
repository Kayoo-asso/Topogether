import OLView from "ol/View";
import { createLifecycle, InferOptions } from "./createLifecycle";
import { forwardRef, useEffect } from "react";
import { useMap } from "./contexts";
import { events, viewEvents } from "./events";

const useLifecycle = createLifecycle(OLView, {
	events: events(viewEvents),
	reactive: [
		"center",
		"constrainResolution",
		"resolution",
		"rotation",
		"zoom",
		"minZoom",
		"maxZoom",
	],
	reset: [],
});

type Props = React.PropsWithChildren<InferOptions<typeof useLifecycle>>;

export const View = forwardRef<OLView, Props>(
	({ children, ...props }, ref) => {
		const view = useLifecycle(props, ref);
		const map = useMap();

		useEffect(() => {
			if(map && view) {
				map.setView(view);
			}
		}, [map, view]);

		return <>{children}</>;
	}
);
