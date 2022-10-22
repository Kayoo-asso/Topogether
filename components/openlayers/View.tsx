import { ViewContext } from "./contexts";
import OLView, { ViewOptions } from "ol/View";
import { createBehavior, Props, PropsWithChildren } from "./core";
import { forwardRef } from "react";

const useBehavior = createBehavior(OLView, {
	events: ["change", "change:center", "change:resolution", "change:rotation"],
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
