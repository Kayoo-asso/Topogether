import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import { GeometryLayout } from "ol/geom/Geometry";
import { ObjectEvent } from "ol/Object";
import { StyleLike } from "ol/style/Style";
import {
	ForwardedRef,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
} from "react";
import { useVectorSource } from "./contexts";

import {
	Circle as OLCircle,
	Point as OLPoint,
	LineString as OLLineString,
	Polygon as OLPolygon,
	MultiPoint as OLMultiPoint,
	MultiLineString as OLMultiLineString,
	MultiPolygon as OLMultiPolygon,
} from "ol/geom";

interface CoordinatesTypeMap {
	point: Coordinate;
	linestring: Array<Coordinate>;
	polygon: Array<Array<Coordinate>>;
	multipoint: Array<Coordinate>;
	multilinestring: Array<Array<Coordinate>>;
	multipolygon: Array<Array<Array<Coordinate>>>;
	// center and radius
	circle: [Coordinate, number];
}

type GeometryType = keyof CoordinatesTypeMap;

// TODO: generic properties
type Props<G extends GeometryType> = {
	geometry: G;
	coordinates: CoordinatesTypeMap[G];
	layout?: GeometryLayout;
	style?: StyleLike;
	// properties?: Record<string, any>;
	id?: string;
	onChange?: (event: BaseEvent) => void;
	onError?: (event: BaseEvent) => void;
	onPropertyChange?: (event: ObjectEvent) => void;
};

const constructors = {
	circle: OLCircle,
	point: OLPoint,
	linestring: OLLineString,
	polygon: OLPolygon,
	multipoint: OLMultiPoint,
	multilinestring: OLMultiLineString,
	multipolygon: OLMultiPolygon,
};

function implementation<G extends GeometryType>(
	{
		onChange,
		onError,
		onPropertyChange,
		geometry: type,
		id,
		layout,
		style,
		coordinates,
	}: Props<G>,
	ref: ForwardedRef<Feature>
) {
	const source = useVectorSource();

	const geometry = useMemo(() => {
		if (type === "circle") {
			// I don't know why TypeScript can't infer this by itself
			const [c, r] = coordinates as CoordinatesTypeMap["circle"];
			return new OLCircle(c, r, layout);
		}
		const fn = constructors[type];
		return new fn(coordinates as any, layout as any);
	}, []);

	const feature = useMemo(() => new Feature({ geometry }), [geometry]);

	feature.setId(id);
	feature.setStyle(style);
	if (type === "circle") {
		const [c, r] = coordinates as CoordinatesTypeMap["circle"];
		(geometry as OLCircle).setCenterAndRadius(c, r, layout);
	} else {
		geometry.setCoordinates(coordinates, layout);
	}

	useImperativeHandle(ref, () => feature, []);

	useEffect(() => {
		source.addFeature(feature);
		return () => source.removeFeature(feature);
	});

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

type ExternalProps<G extends GeometryType> = Omit<Props<G>, "geometry">;

export const Circle = forwardRef<Feature, ExternalProps<"circle">>(
	(props, ref) => implementation({ ...props, geometry: "circle" }, ref)
);

export const Point = forwardRef<Feature, ExternalProps<"point">>(
	(props, ref) => implementation({ ...props, geometry: "point" }, ref)
);
export const LineString = forwardRef<Feature, ExternalProps<"linestring">>(
	(props, ref) => implementation({ ...props, geometry: "linestring" }, ref)
);
export const Polygon = forwardRef<Feature, ExternalProps<"polygon">>(
	(props, ref) => implementation({ ...props, geometry: "polygon" }, ref)
);
export const MultiPoint = forwardRef<Feature, ExternalProps<"multipoint">>(
	(props, ref) => implementation({ ...props, geometry: "multipoint" }, ref)
);
export const MultiLineString = forwardRef<Feature, ExternalProps<"multilinestring">>(
	(props, ref) => implementation({ ...props, geometry: "multilinestring" }, ref)
);
export const MultiPolygon = forwardRef<Feature, ExternalProps<"multipolygon">>(
	(props, ref) => implementation({ ...props, geometry: "multipolygon" }, ref)
);