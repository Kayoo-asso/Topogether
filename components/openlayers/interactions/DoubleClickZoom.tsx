import OLDoubleClickZoom from "ol/interaction/DoubleClickZoom";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createBehavior, Props } from "../core";

const useBehavior = createBehavior(OLDoubleClickZoom, {
	events: ["change:active"],
	reactive: [],
});

type P = Props<typeof useBehavior> & {
	active?: boolean;
};

export const Modify = forwardRef<OLDoubleClickZoom, P>(
	({ children, active, ...props }, ref) => {
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
