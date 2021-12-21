import { JSONSchemaType } from "ajv";
import { LineDTO, StringBetween, TrackDTO, UUID } from "types";
import { LinearRingSchema, LineStringSchema, MultiPointSchema, MultiPolygonSchema, NumberSchema, PositionSchema } from "./GeoJsonSchemas";
import { DescriptionSchema, NameSchema, UUIDSchema } from "./PrimitiveSchemas";


export const LineSchema: JSONSchemaType<LineDTO> = {
    type: "object",
    required: ["id", "points", "forbidden", "handDepartures", "feetDepartures", "imageId", "trackId"],
    properties: {
        id: UUIDSchema,
        points: {
            type: 'array',
            minItems: 2,
            items: PositionSchema
        },
        forbidden: {
            type: 'array',
            items: LinearRingSchema
        },
        handDepartures: {
            type: 'array',
            maxItems: 3,
            items: PositionSchema
        },
        feetDepartures: {
            type: 'array',
            maxItems: 2,
            items: PositionSchema
        },
        imageId: UUIDSchema,
        trackId: UUIDSchema
    }
}

// export const TrackSchema: JSONSchemaType<TrackDTO> = {
//     type: "object",
//     properties: {
//         id: UUIDSchema,
//         name: NameSchema,
//         description: DescriptionSchema,
//         height: { type: 'integer', nullable: true },


//     }
// }