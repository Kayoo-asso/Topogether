import OLDragBox from "ol/interaction/DragBox";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createBehavior, Props } from "../core";

const useBehavior = createBehavior(OLDragBox, {
	reactive: [],
	events: ["change:active", "boxcancel", "boxdrag", "boxend", "boxstart"],
});

type P = Props<typeof useBehavior> & {
	active?: boolean;
};

export const DragBox = forwardRef<OLDragBox, P>(
	({ active, ...props }, ref) => {
		const dragbox = useBehavior(props, ref);
		const map = useMap();

		if (active) dragbox?.setActive(active);

		useEffect(() => {
			if (dragbox) {
				map.addInteraction(dragbox);
				return () => {
					map.removeInteraction(dragbox);
				};
			}
		}, [dragbox, map]);

		return null;
	}
);
