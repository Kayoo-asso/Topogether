import { JSONSchemaType } from "ajv";
import { StringBetween } from "types/Utils";
import { UUID } from "types/UUID";

export const UUIDSchema: JSONSchemaType<UUID> = {
    type: "string",
    format: "uuid"
};

function required<T>(schema: T): T & { nullable: false } {
    return {
        nullable: false,
        ...schema
    }
}

export const NameSchema: JSONSchemaType<StringBetween<1, 255>> = {
    type: "string",
    minLength: 1,
    maxLength: 255,
    nullable: true,
};

export const RequiredNameSchema = required(NameSchema);

export const DescriptionSchema: JSONSchemaType<StringBetween<1, 5000>> = {
    type: "string",
    minLength: 1,
    maxLength: 255,
    nullable: true
};

export const RequiredDescriptionSchema = required(DescriptionSchema);