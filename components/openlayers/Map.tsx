import { MapContext } from "./contexts";
import OLMap from "ol/Map";
import {
	createLifecycle,
	InferOptions,
} from "./createLifecycle";
import { forwardRef } from "react";

// VERY IMPORTANT
import "ol/ol.css";
import { events, mapEvents, renderEvents } from "./events";

// TODO: additional reactive properties that are not in the Options
const useLifecycle = createLifecycle(OLMap, {
	events: events(mapEvents, renderEvents),
	reactive: [
		// "size",
	],
	reset: [],
});

type Options = InferOptions<typeof useLifecycle>;

export type Props = Omit<
	Options,
	"view" | "target" | "interactions" | "overlays" | "layers"
> & React.PropsWithChildren<{
	id?: string;
	className?: string;
}>;

export const Map = forwardRef<OLMap, Props>(
	({ children, id, className, ...props }, ref) => {
		id = id || "map";
		const map = useLifecycle({ ...props, target: id }, ref);

		return (
			<div id={id} className={className}>
				<MapContext.Provider value={map}>{children}</MapContext.Provider>
			</div>
		);
	}
);
