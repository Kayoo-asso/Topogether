import { JSONSchemaType } from "ajv";
import { Position, Point, BoundingBox, MultiPoint, LineString, LinearRing, Polygon, MultiPolygon } from "../GeoJson";

export const NumberSchema: JSONSchemaType<number> = {
    type: 'number'
};


export const PositionSchema: JSONSchemaType<Position> = {
    type: 'array',
    minItems: 2,
    maxItems: 2,
    items: [NumberSchema, NumberSchema]
};

export const BoundingBoxSchema: JSONSchemaType<BoundingBox> = {
    type: 'array',
    minItems: 4,
    items: NumberSchema,
};

type Nullable<T> = T & { nullable: true };

function nullable<T>(schema: T): Nullable<T> {
    return {
        nullable: true,
        ...schema
    }
};

const NullableBoundingBox = nullable(BoundingBoxSchema);

export const PointSchema: JSONSchemaType<Point> = {
    type: 'object',
    required: ['type', 'coordinates'],
    properties: {
        type: {
            type: 'string',
            const: 'Point',
        },
        coordinates: PositionSchema,
        bbox: NullableBoundingBox
    }
};

export const MultiPointSchema: JSONSchemaType<MultiPoint> = {
    type: 'object',
    required: ['type', 'coordinates'],
    properties: {
        type: {
            type: 'string',
            const: 'MultiPoint',
        },
        coordinates: {
            type: 'array',
            items: PositionSchema
        },
        bbox: NullableBoundingBox
    }
};

export const LineStringSchema: JSONSchemaType<LineString> = {
    type: 'object',
    required: ['type', 'coordinates'],
    properties: {
        type: {
            type: 'string',
            const: 'LineString'
        },
        coordinates: {
            type: 'array',
            minItems: 2,
            items: PositionSchema
        },
        bbox: NullableBoundingBox
    }
};

export const LinearRingSchema: JSONSchemaType<LinearRing> = {
    type: 'array',
    minItems: 4,
    items: PositionSchema
};

export const PolygonSchema: JSONSchemaType<Polygon> = {
    type: 'object',
    required: ['type', 'coordinates'],
    properties: {
        type: {
            type: 'string',
            const: 'Polygon'
        },
        coordinates: {
            type: 'array',
            items: LinearRingSchema
        },
        bbox: NullableBoundingBox
    }
};

export const MultiPolygonSchema: JSONSchemaType<MultiPolygon> = {
    type: 'object',
    required: ['type', 'coordinates'],
    properties: {
        type: {
            type: 'string',
            const: 'MultiPolygon'
        },
        coordinates: {
            type: 'array',
            items: {
                type: 'array',
                items: LinearRingSchema
            }
        },
        bbox: NullableBoundingBox
    }
};

