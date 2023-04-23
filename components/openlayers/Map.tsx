import { MapContext } from "./contexts";
import OLMap from "ol/Map";
import { createLifecycle, InferOptions } from "./createLifecycle";
import { forwardRef, useId } from "react";

// VERY IMPORTANT
import "ol/ol.css";
import { e, mapEvents, renderEvents } from "./events";

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
		className?: string;
	}>;

export const Map = forwardRef<OLMap, Props>(
	({ children, className, ...props }, ref) => {
		const id = useId();
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
