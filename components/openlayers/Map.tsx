import { MainContext, useMainContext } from "./init";
import OLMap from "ol/Map";
import {
	createBehavior,
	events,
	InferPropsWithChildren,
	renderEvents,
	mapEvents,
} from "./core";
import { forwardRef, useContext, useEffect, useState } from "react";

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

type InternalProps = InferPropsWithChildren<typeof useBehavior> & {
	id?: string;
	className?: string;
};

export type ExternalProps = Omit<
	InternalProps,
	"view" | "target" | "layers" | "interactions" | "overlays"
>;

export const Map = forwardRef<OLMap, ExternalProps>(
	({ children, id, className, ...props }, ref) => {
		const options = props as InternalProps;
		id = id || "map";
		options.target = id;

		const map = useBehavior(props, ref);
		const ctx = useMainContext();

		useEffect(() => {
			if (map && ctx.view) {
				map.setView(ctx.view);
			}
		}, [map, ctx.view]);

		return (
			<div id={id} className={className}>
				{children}
			</div>
		);
	}
);
