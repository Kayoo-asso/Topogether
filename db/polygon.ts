import { customType } from "drizzle-orm/pg-core";
import { parseWKB, ParsedPolygon } from "helpers/wkb";

export const polygon = customType<{ data: ParsedPolygon["coordinates"], driverData: string;}>({
    dataType() {
        return "Geometry(Polygon, 4326)"
    },
    fromDriver(value: string) {
        const json = parseWKB(value);
        if (json.type !== "Polygon") {
            throw new Error(`Expected Polygon geometry, received ${json.type}`)
        }
        return json.coordinates;
    },
    toDriver(coordinates: ParsedPolygon["coordinates"]) {
        const geojson = {
            type: "Polygon",
            coordinates
        } satisfies ParsedPolygon;
        return `ST_GeomFromGeoJSON('${geojson}')`
    }
})
