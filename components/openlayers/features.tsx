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
	useState,
} from "react";
import { useLayer } from "./contexts";
import { Cluster, Source } from "ol/source";

import {
	Circle as OLCircle,
	Point as OLPoint,
	LineString as OLLineString,
	Polygon as OLPolygon,
	MultiPoint as OLMultiPoint,
	MultiLineString as OLMultiLineString,
	MultiPolygon as OLMultiPolygon,
} from "ol/geom";
import VectorSource from "ol/source/Vector";

interface CoordinatesTypeMap {
	point: Coordinate;
	linestring: Array<Coordinate>;
	//TODO: change the type of polygon (throw off one "Array<>")
	polygon: Array<Array<Coordinate>>;
	multipoint: Array<Coordinate>;
	multilinestring: Array<Array<Coordinate>>;
	multipolygon: Array<Array<Array<Coordinate>>>;
}

type Geometry =
	| OLCircle
	| OLPoint
	| OLLineString
	| OLPolygon
	| OLMultiPoint
	| OLMultiLineString
	| OLMultiPolygon;
type GeometryType = keyof CoordinatesTypeMap | "circle";

// TODO: better types for data (esp. in event handlers)
interface CommonProps {
	layout?: GeometryLayout;
	style?: StyleLike;
	data?: any;
	id?: string;
	onChange?: (event: BaseEvent) => void;
	onError?: (event: BaseEvent) => void;
	onPropertyChange?: (event: ObjectEvent) => void;
}

type Props<G extends GeometryType | "circle"> = CommonProps &
	(G extends keyof CoordinatesTypeMap
		? {
				type: G;
				coordinates: CoordinatesTypeMap[G];
		  }
		: {
				type: "circle";
				center: Coordinate;
				radius: number;
		  });

const constructors = {
	point: OLPoint,
	linestring: OLLineString,
	polygon: OLPolygon,
	multipoint: OLMultiPoint,
	multilinestring: OLMultiLineString,
	multipolygon: OLMultiPolygon,
} as const;

function implementation<G extends GeometryType>(
	props: Props<G>,
	ref: ForwardedRef<Feature>
) {
	const layer = useLayer();
	const [source, setSource] = useState<Source | null>(null);

	useEffect(() => {
		if(layer) {
			const updateSource = () => {
				let source = layer.getSource();
				// Don't interact with Cluster sources, interact with the underlying source
				if(source instanceof Cluster) {
					source = source.getSource()
					return;
				}
				setSource(source);
			}
			layer.on("change:source", updateSource)
			return () => layer.un("change:source", updateSource);
		}
	}, [layer]);

	let geometry: Geometry;
	// The `type` prop should never change for a given component.
	// The `implementation` function is never exported and only used through the components defined below
	if (props.type === "circle") {
		const c = useMemo(
			() => new OLCircle(props.center, props.radius, props.layout),
			[props.center, props.radius, props.layout]
		);

		c.setCenterAndRadius(props.center, props.radius, props.layout);
		geometry = c;
	} else {
		const g = useMemo(() => {
			const fn = constructors[props.type];
			return new fn(props.coordinates as any, props.layout);
		}, []);

		g.setCoordinates(props.coordinates as any, props.layout);
		geometry = g;
	}

	const feature = useMemo(() => new Feature({ geometry }), [geometry]);

	feature.setId(props.id);
	// TODO: deep comparison before updating style?
	// feature.setStyle(props.style);
	feature.setProperties({
		data: props.data,
	});

	useImperativeHandle(ref, () => feature, [feature]);

	useEffect(() => {
		if (source) {
			if (!(source instanceof VectorSource)) {
				throw new Error(
					"A Feature component (Point, LineString, Polygon...) cannot be used inside a Source that is not a VectorSource"
				);
			}
			source.addFeature(feature);
			return () => {
				// source.removeFeature(feature);
			};
		}
	}, [source, feature]);

	useEffect(() => {
		props.onChange && feature.on("change", props.onChange);
		props.onError && feature.on("error", props.onError);
		props.onPropertyChange &&
			feature.on("propertychange", props.onPropertyChange);

		return () => {
			props.onChange && feature.un("change", props.onChange);
			props.onError && feature.un("error", props.onError);
			props.onPropertyChange &&
				feature.un("propertychange", props.onPropertyChange);
		};
	}, [props.onChange, props.onError, props.onPropertyChange]);

	return null;
}

type ExternalProps<G extends GeometryType> = Omit<Props<G>, "type">;

export const Point = forwardRef<Feature, ExternalProps<"point">>((props, ref) =>
	implementation({ ...props, type: "point" }, ref)
);

export const LineString = forwardRef<Feature, ExternalProps<"linestring">>(
	(props, ref) => implementation({ ...props, type: "linestring" }, ref)
);

export const Polygon = forwardRef<Feature, ExternalProps<"polygon">>(
	(props, ref) => implementation({ ...props, type: "polygon" }, ref)
);

export const MultiPoint = forwardRef<Feature, ExternalProps<"multipoint">>(
	(props, ref) => implementation({ ...props, type: "multipoint" }, ref)
);

export const MultiLineString = forwardRef<
	Feature,
	ExternalProps<"multilinestring">
>((props, ref) => implementation({ ...props, type: "multilinestring" }, ref));

export const MultiPolygon = forwardRef<Feature, ExternalProps<"multipolygon">>(
	(props, ref) => implementation({ ...props, type: "multipolygon" }, ref)
);

export const Circle = forwardRef<Feature, ExternalProps<"circle">>(
	(props, ref) => implementation({ ...props, type: "circle" }, ref)
);
