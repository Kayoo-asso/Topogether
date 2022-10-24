import { useView, MapContext } from "./contexts";
import OLMap from "ol/Map";
import {
	createBehavior,
	events,
	PropsWithChildren,
	renderEvents,
	mapEvents
} from "./core";
import { forwardRef, useEffect } from "react";

// VERY IMPORTANT
import "ol/ol.css";

// TODO: way to omit some Props
// TODO: additional reactive properties that are not in the Options
const useBehavior = createBehavior(OLMap, {
	events: events(mapEvents, renderEvents),
	reactive: [
		// "size",
	],
	reset: [],
});

type InternalProps = PropsWithChildren<typeof useBehavior> & {
	id?: string;
	className?: string;
};

type ExternalProps = Omit<InternalProps, "view" | "target">;

export const Map = forwardRef<OLMap, ExternalProps>(
	({ children, id, className, ...props }, ref) => {
		const options = props as InternalProps;
		id = id || "map";
		options.target = id;
		const map = useBehavior(props, ref);
		console.log("Map:", map);
		const view = useView();

		useEffect(() => {
			if (map) {
				map.setView(view);
			}
		}, [map, view]);

		return (
			<div id={id} className={className}>
				{map ? (
					<MapContext.Provider value={map}>{children}</MapContext.Provider>
				) : null}
			</div>
		);
	}
);
