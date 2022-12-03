import OLDragRotate from "ol/interaction/DragRotate";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createBehavior, InferProps } from "../core";

const useBehavior = createBehavior(OLDragRotate, {
	events: ["change:active"],
	reactive: [],
});

type P = InferProps<typeof useBehavior> & {
	active?: boolean;
};

export const DragRotate = forwardRef<OLDragRotate, P>(
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
