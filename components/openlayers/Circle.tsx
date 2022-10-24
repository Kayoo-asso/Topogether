import type { Coordinate } from "ol/coordinate";
import Feature from "ol/Feature";
import type { GeometryLayout } from "ol/geom/Geometry";
import OLCircle from "ol/geom/Circle";
import { StyleLike } from "ol/style/Style";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useVectorSource } from "./contexts";
import BaseEvent from "ol/events/Event";
import { ObjectEvent } from "ol/Object";

type Props = {
	id?: string;
	center: Coordinate;
	radius: number;
	layout?: GeometryLayout;
	style?: StyleLike;
	onChange?: (event: BaseEvent) => void;
	onError?: (event: BaseEvent) => void;
	onPropertyChange?: (event: ObjectEvent) => void;
};

export const Circle = forwardRef<Feature, Props>(
	({ center, radius, layout, id, style, onChange, onError, onPropertyChange }, ref) => {
		const source = useVectorSource();
		const [geometry] = useState(() => new OLCircle(center, radius, layout));
		const [feature] = useState(() => new Feature({ geometry }));

		feature.setId(id);
		feature.setStyle(style);
		geometry.setCenterAndRadius(center, radius, layout);

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
