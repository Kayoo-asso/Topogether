import { MapContext } from "./contexts";
import OLMap from "ol/Map";
import { createLifecycle, InferOptions } from "./createLifecycle";
import { forwardRef } from "react";

// VERY IMPORTANT
import "ol/ol.css";
import { baseEvents, e, mapEvents, renderEvents } from "./events";
import { Collection } from "ol";
import { createRotationConstraint } from "ol/View";

// TODO: additional reactive properties that are not in the Options
const useLifecycle = createLifecycle(
	OLMap,
	[...e(mapEvents), ...e(renderEvents)],
	[
		// "size",
	],
	["controls"]
);

type Options = InferOptions<typeof useLifecycle>;

export type Props = Omit<
	Options,
	"view" | "target" | "interactions" | "overlays" | "layers"
> &
	React.PropsWithChildren<{
		id?: string;
		className?: string;
	}>;

export const Map = forwardRef<OLMap, Props>(
	({ children, id, className, ...props }, ref) => {
		id = id || "map";
		const map = useLifecycle({ ...props, target: id }, ref);

		return (
			<div id={id} className={className}>
				{map && (
					<MapContext.Provider value={map}>{children}</MapContext.Provider>
				)}
			</div>
		);
	}
);
