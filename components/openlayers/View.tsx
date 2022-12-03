import { OpenLayersContext, MainContext } from "./init";
import OLView from "ol/View";
import { createBehavior, events, InferPropsWithChildren, viewEvents } from "./core";
import { forwardRef, useEffect, useMemo, useRef } from "react";

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

export const View = forwardRef<OLView, InferPropsWithChildren<typeof useBehavior>>(
	({ children, ...props }, ref) => {
		const view = useBehavior(props, ref);
		const { current: ctx } = useRef<OpenLayersContext>(new OpenLayersContext());


		useEffect(() => {
			if (!view) return;
			
			ctx.view = view;
			ctx.flush();
		});

		return (
			<MainContext.Provider value={ctx}>{children}</MainContext.Provider>
		);
	}
);
