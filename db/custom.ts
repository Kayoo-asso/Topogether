import { customType } from "drizzle-orm/pg-core";
import { parseWKB, ParsedPolygon } from "helpers/wkb";
import { UUID } from "types";

export const point = customType<{ data: [number, number]; driverData: string }>(
	{
		dataType() {
			return "Geometry(Polygon, 4326)";
		},
		fromDriver(value: string) {
			const json = parseWKB(value);
			if (json.type !== "Point") {
				throw new Error(`Expected Point geometry, received ${json.type}`);
			}
			return json.coordinates;
		},
		toDriver(coordinates: [number, number]) {
			return `ST_Point(${coordinates[0]}, ${coordinates[1]})`;
		},
	}
);

export const polygon = customType<{
	data: ParsedPolygon["coordinates"];
	driverData: string;
}>({
	dataType() {
		return "Geometry(Polygon, 4326)";
	},
	fromDriver(value: string) {
		const json = parseWKB(value);
		if (json.type !== "Polygon") {
			throw new Error(`Expected Polygon geometry, received ${json.type}`);
		}
		return json.coordinates;
	},
	toDriver(coordinates: ParsedPolygon["coordinates"]) {
		const geojson = {
			type: "Polygon",
			coordinates,
		};
		return `ST_GeomFromGeoJSON('${geojson}')`;
	},
});

// For these two custom types, we wrap the call to `customType` in a callback, that allows passing
// in a more specific type for the value in the column.
export const jsonb = <TData>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType() {
			return "jsonb";
		},
		toDriver(value: TData): string {
			return JSON.stringify(value);
		},
	})(name);

export const bitflag = <TData extends number>(name: string) =>
	customType<{ data: TData; driverData: string }>({
		dataType() {
			return "integer";
		},
	})(name);

// There is a built-in type for UUID in the Drizzle Postgres driver.
// However, we want to enforce the use of our custom UUID TypeScript type.
// For this, we need to redefine the `uuid` type using `customType`
export const uuid = customType<{ data: UUID; driverData: string }>({
	dataType() {
		return "uuid";
	},
});

export const xy = customType<{ data: [number, number]; driverData: string }>({
	dataType() {
		return "double precision[]";
	},
});
