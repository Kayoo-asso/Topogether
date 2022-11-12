import { ForwardedRef, PropsWithChildren, ReactElement, useRef } from "react";

import View, { ViewOptions } from "ol/View";
import Map, { MapOptions } from "ol/Map";

// Layers
import BaseVectorLayer from "ol/layer/BaseVector";
import VectorLayer from "ol/layer/Vector";

// Sources
import VectorSource, { Options as VectorSourceOptions } from "ol/source/Vector";
import VectorTileSource, {
	Options as VectorTileSourceOptions,
} from "ol/source/VectorTile";
import { Options as XYZOptions } from "ol/source/XYZ";

import Point from "ol/geom/Point";
import MultiPoint from "ol/geom/MultiPoint";
import LineString from "ol/geom/LineString";
import MultiLineString from "ol/geom/MultiLineString";
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import Circle from "ol/geom/Circle";
import GeometryCollection from "ol/geom/GeometryCollection";
import { GeometryLayout } from "ol/geom/Geometry";

import { Options as ModifyOptions } from "ol/interaction/Modify";
import { Options as SelectOptions } from "ol/interaction/Select";
import { Options as DrawBaseOptions } from "ol/interaction/Draw";

// Notes:
// - Sources, layers and collections can have string IDs. These are used to easily select them for interactions, etc...
// - We keep refs in the tree and can update them while diffing, by checking referential equality

export type Node = ViewNode | MapNode | LayerNode | SourceNode | InteractionNode | FeatureNode;

export type Root = ViewNode;

export type ViewNode = {
	o: ViewOptions;
  r: ForwardedRef<View> | null;
	c: MapNode | null;
};

export type MapNode = {
	o: MapOptions;
	c: Array<LayerNode | SelectNode>;
};

// -- Sources --
export type SourceNode = VectorSourceNode | VectorTileSourceNode | XYZSourceNode;
export type AnyVectorSource = VectorSource | VectorTileSource;


// Can a source have geometries with different layouts?
// Or should vector sources also be parameterized by the GeometryLayout
export type VectorSourceChild = GeomNode<GeometryLayout> | ModifyNode | SelectNode;

export type VectorSourceNode = {
  id: string;
	t: "VS"; // VectorSource
	o: VectorSourceOptions;
	c: Array<VectorSourceChild>;
};

export type VectorTileSourceNode = {
  id: string;
	t: "VTS"; // VectorTileSource
	o: VectorTileSourceOptions;
	c: Array<VectorSourceChild>;
};

export type XYZSourceNode = {
  id: string;
	t: "XYZ";
	o: XYZOptions;
};

// -- Layers --
export type LayerNode = VectorLayerNode<AnyVectorSource>;
export type VectorLayerNode<Source extends AnyVectorSource> = {
	id: string;
};

// -- Features (only as geometries for now) --
export type FeatureNode = GeomNode<GeometryLayout>;

export type GeomNode<L extends GeometryLayout> =
	| PointNode<L>
	| MultiPointNode<L>
	| LineStringNode<L>
	| MultiLineStringNode<L>
	| PolygonNode<L>
	| MultiPolygonNode<L>
	| CircleNode<L>
	| GeometryCollectionNode<L>;

export type Coordinate<L extends GeometryLayout> = L extends "XY"
	? [number, number]
	: [number, number, number];

export type PointNode<L extends GeometryLayout = "XY"> = {
	// Small 'p' to distinguish from polygons
	t: "p";
	coordinate: Coordinate<L>;
	layout: L;
};

export type MultiPointNode<L extends GeometryLayout = "XY"> = {
	t: "Mp";
	coordinates: Array<Coordinate<L>>;
	layout: L;
};

export type LineStringNode<L extends GeometryLayout = "XY"> = {
	t: "L";
	coordinates: Array<Coordinate<L>>;
	layout: L;
};

export type MultiLineStringNode<L extends GeometryLayout = "XY"> = {
	t: "ML";
	coordinates: Array<Array<Coordinate<L>>>;
	layout: L;
};

export type PolygonNode<L extends GeometryLayout = "XY"> = {
	t: "P";
	coordinates: Array<Array<Coordinate<L>>>;
	layout: L;
};

export type MultiPolygonNode<L extends GeometryLayout = "XY"> = {
	t: "MP";
	coordinates: Array<Array<Array<Coordinate<L>>>>;
	layout: L;
};

export type CircleNode<L extends GeometryLayout = "XY"> = {
	t: "C";
	coordinate: Coordinate<L>;
	radius: number;
	layout: L;
};

export type GeometryCollectionNode<L extends GeometryLayout = "XY"> = {
	t: "GC";
	geometries: Array<GeomNode<L>>;
};

// -- Interactions --
export type InteractionNode = ModifyNode | SelectNode | DrawNode;

export type ModifyNode = {
	t: "Modify";
	o: ModifyOptions;
	// If empty, look for the closest source up
	c: Array<GeomNode<GeometryLayout>>;
};

export type SelectNode = {
	t: "Select";
	o: SelectOptions;
	// If empty, applies to the closest layer above
	c: Array<LayerNode> | Array<GeomNode<GeometryLayout>>;
};

export type DrawOptions<L extends GeometryLayout = "XY"> = DrawBaseOptions & {
	geometryLayout?: L;
};

// No children, applies to the closest source above
export type DrawNode<L extends GeometryLayout = "XY"> = {
	t: "Draw";
	o: DrawOptions<L>;
};

// TODO:
// - Feature nodes, to store different arbitrary geometries / properties there?
