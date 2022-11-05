import OLSelect from "ol/interaction/Select";
import { forwardRef, useEffect } from "react";
import { useMap } from "../contexts";
import { createBehavior, Props } from "../core";

const useBehavior = createBehavior(OLSelect, {
	events: ["change:active", "select"],
	reactive: ["hitTolerance"],
});

type P = Props<typeof useBehavior> & {
	active?: boolean;
};

export const Select = forwardRef<OLSelect, P>(
	({ active, ...props }, ref) => {
		const select = useBehavior(props, ref);
		const map = useMap();

		// Additional property
		if (active) {
			select?.setActive(!!active);
		}

		useEffect(() => {
			if (select) {
				map.addInteraction(select);
				return () => {
					map.removeInteraction(select);
				};
			}
		}, [select, map]);

return null;
	}
);
