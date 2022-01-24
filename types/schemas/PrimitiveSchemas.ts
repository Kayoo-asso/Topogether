import { Describe, pattern, refine, size, string } from "superstruct";
import { UUID, isStringBetween, Description, Email, isEmail } from "types";
import { Name, StringBetween } from "types/Utils";

// taken from zod
// https://github.com/colinhacks/zod/blob/master/src/types.ts#L419
const uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;

export const UUIDSchema: Describe<UUID> = pattern(string(), uuidRegex) as any;
export const NameSchema: Describe<Name> = size(string(), 1, 255) as any;
export const DescriptionSchema: Describe<Description> = size(string(), 1, 5000) as any;
export const EmailSchema: Describe<Email> = refine(
    string(),
    "Valid email",
    isEmail
) as any;
