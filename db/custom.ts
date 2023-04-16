import { customType } from "drizzle-orm/pg-core";
import { parseWKB, ParsedPolygon } from "helpers/wkb";
import { UUID } from "types";
import WKB from "ol/format/WKB";
import { Point, Polygon } from "ol/geom";

export const point = customType<{ data: [number, number]; driverData: string }>(
	{
		dataType() {
			return "Geometry(Point, 4326)";
		},
		fromDriver(value: string) {
			const json = parseWKB(value);
			if (json.type !== "Point") {
				throw new Error(`Expected Point geometry, received ${json.type}`);
			}
			return json.coordinates;
		},
		toDriver(coordinates: [number, number]) {
			return new WKB().writeGeometry(new Point(coordinates)).toString();
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
		return new WKB().writeGeometry(new Polygon(coordinates)).toString();
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

// The custom `xyArray` type is a workaround for this issue:
// https://github.com/drizzle-team/drizzle-orm/issues/460
export const xyArray = customType<{
	data: Array<[number, number]>;
	driverData: string;
}>({
	dataType() {
		return "double precision[][]";
	},
});
