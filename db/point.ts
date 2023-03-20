import { customType } from "drizzle-orm/pg-core";
import { parseWKB } from "helpers/wkb";

export const point = customType<{ data: [number, number], driverData: string;}>({
    dataType() {
        return "Geometry(Polygon, 4326)"
    },
    fromDriver(value: string) {
        const json = parseWKB(value);
        if (json.type !== "Point") {
            throw new Error(`Expected Point geometry, received ${json.type}`)
        }
        return json.coordinates;
    },
    toDriver(coordinates: [number, number]) {
        return `ST_Point(${coordinates[0]}, ${coordinates[1]})`
    }
})
