import { ViewContext } from "./contexts";
import OLView from "ol/View";
import { createBehavior, events, PropsWithChildren, viewEvents } from "./core";
import { forwardRef } from "react";

const useBehavior = createBehavior(OLView, {
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

export const View = forwardRef<OLView, PropsWithChildren<typeof useBehavior>>(
	({ children, ...props }, ref) => {
		const view = useBehavior(props, ref);

		return view ? (
			<ViewContext.Provider value={view}>{children}</ViewContext.Provider>
		) : null;
	}
);
