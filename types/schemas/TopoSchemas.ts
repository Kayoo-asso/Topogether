import { JSONSchemaType } from "ajv";
import { LineDTO, StringBetween, TrackDTO, UUID } from "types";
import { LineStringSchema, MultiPointSchema, MultiPolygonSchema, NumberSchema } from "./GeoJsonSchemas";
import { DescriptionSchema, NameSchema, UUIDSchema } from "./PrimitiveSchemas";


export const LineSchema: JSONSchemaType<LineDTO> = {
    type: "object",
    required: ["id", "line", "forbidden", "startingPoints", "imageId", "trackId"],
    properties: {
        id: UUIDSchema,
        line: LineStringSchema,
        forbidden: MultiPolygonSchema,
        startingPoints: MultiPointSchema,

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