
import type { Coordinate } from "ol/coordinate";
import type BaseEvent from "ol/events/Event";
import Feature from "ol/Feature";
import type { GeometryLayout } from "ol/geom/Geometry";
import OLPolygon from "ol/geom/Polygon";
import type { ObjectEvent } from "ol/Object";
import { StyleLike } from "ol/style/Style";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useVectorSource } from "./contexts";

type Props = {
	id?: string;
	coordinates: Array<Array<Coordinate>>;
	layout?: GeometryLayout;
	// Internal use only
	// end?: Array<number>;
	style?: StyleLike;
	onChange?: (event: BaseEvent) => void;
	onError?: (event: BaseEvent) => void;
	onPropertyChange?: (event: ObjectEvent) => void;
};

export const Point = forwardRef<Feature, Props>(
	(
		{ coordinates, layout, id, style, onChange, onError, onPropertyChange },
		ref
	) => {
		const source = useVectorSource();
		const [geometry] = useState(() => new OLPolygon(coordinates, layout));
		const [feature] = useState(() => new Feature({ geometry }));

		feature.setId(id);
		feature.setStyle(style);
		geometry.setCoordinates(coordinates, layout);

		useImperativeHandle(ref, () => feature, []);

		useEffect(() => {
			source.addFeature(feature);
			return () => source.removeFeature(feature);
		}, []);

		useEffect(() => {
			onChange && feature.on("change", onChange);
			onError && feature.on("error", onError);
			onPropertyChange && feature.on("propertychange", onPropertyChange);

			return () => {
				onChange && feature.un("change", onChange);
				onError && feature.un("error", onError);
				onPropertyChange && feature.un("propertychange", onPropertyChange);
			};
		}, [onChange, onError, onPropertyChange]);

		return null;
	}
);
