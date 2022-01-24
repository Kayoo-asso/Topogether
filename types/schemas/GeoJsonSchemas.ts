import { Position, Point, BoundingBox, MultiPoint, LineString, LinearRing, Polygon, MultiPolygon, LineCoords } from "../GeoJson";
import { array, Describe, literal, number, object, optional, refine, size, string, tuple } from "superstruct";

export const PositionSchema: Describe<Position> = tuple([number(), number()]);

// the BoundingBox type is a bit convoluted, but means an array of 4+ numbers
export const BoundingBoxSchema: Describe<BoundingBox> = size(array(number()), 4, Infinity) as any;

export const PointSchema: Describe<Point> = object({
    type: literal("Point"),
    coordinates: PositionSchema,
    bbox: optional(BoundingBoxSchema),
});

export const MultiPointSchema: Describe<MultiPoint> = object({
    type: literal("MultiPoint"),
    coordinates: array(PositionSchema),
    bbox: optional(BoundingBoxSchema),
});

// LineCoords is an array of 2+ Positions
export const LineCoordsSchema: Describe<LineCoords> = size(array(PositionSchema), 2, Infinity) as any;

export const LineStringSchema: Describe<LineString> = object({
    type: literal("LineString"),
    coordinates: LineCoordsSchema,
    bbox: optional(BoundingBoxSchema)
});

// LinearRing is an array of 4+ Positions, with the first and last one being identical
export const LinearRingSchema: Describe<LinearRing> = refine(
    size(array(PositionSchema), 4, Infinity) as any,
    "Identical start and end points",
    coords => {
        const [firstX, firstY] = coords[0];
        const [lastX, lastY] = coords[coords.length - 1];
        return firstX === lastX && firstY === lastY;
    }
);


export const PolygonSchema: Describe<Polygon> = object({
    type: literal("Polygon"),
    coordinates: array(LinearRingSchema),
    bbox: optional(BoundingBoxSchema),
});

export const MultiPolygonSchema: Describe<MultiPolygon> = object({
    type: literal("MultiPolygon"),
    coordinates: array(PolygonSchema.schema.coordinates)
});
