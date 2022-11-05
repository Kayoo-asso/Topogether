import OLDragZoom from "ol/interaction/DragZoom";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createBehavior, Props } from "../core";

const useBehavior = createBehavior(OLDragZoom, {
	events: ["change:active"],
	reactive: [],
});

type P = Props<typeof useBehavior> & {
	active?: boolean;
};

export const DragZoom = forwardRef<OLDragZoom, P>(
	({ active, ...props }, ref) => {
		const draw = useBehavior(props, ref);
		const map = useMap();

		if (active) draw?.setActive(active);

		useEffect(() => {
			if (draw) {
				map.addInteraction(draw);
				return () => {
					map.removeInteraction(draw);
				};
			}
		}, [draw, map]);

		return null;
	}
);
