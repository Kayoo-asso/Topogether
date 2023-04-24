import { AnyPgColumn, customType } from "drizzle-orm/pg-core";
import { UUID } from "~/types";
import WKB from "ol/format/WKB";
import { Point, Polygon } from "ol/geom";
import { sql } from "drizzle-orm";

export const point = customType<{ data: [number, number]; driverData: string }>(
	{
		dataType() {
			return "Geometry(Point, 4326)";
		},
		fromDriver(value: string) {
			const geom = new WKB().readGeometry(value);
			if (!(geom instanceof Point)) {
				throw new Error(`Expected Point geometry, received ${geom}`);
			}
			const coordinates = geom.getCoordinates();
			if (coordinates.length !== 2) {
				throw new Error(
					`Expected 2 coordinates, received ${coordinates.length}`
				);
			}
			return coordinates as [number, number];
		},
		toDriver(coordinates: [number, number]) {
			return new WKB().writeGeometry(new Point(coordinates)).toString();
		},
	}
);

type PolygonCoordinates = Array<Array<[number, number]>>;

export const polygon = customType<{
	data: PolygonCoordinates;
	driverData: string;
}>({
	dataType() {
		return "Geometry(Polygon, 4326)";
	},
	fromDriver(value: string) {
		const geom = new WKB().readGeometry(value);
		if (!(geom instanceof Polygon)) {
			throw new Error(`Expected Point geometry, received ${geom}`);
		}
		return geom.getCoordinates() as PolygonCoordinates;
	},
	toDriver(coordinates: PolygonCoordinates) {
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

export function count(column?: AnyPgColumn) {
	return column ? sql<number>`count(${column})` : sql<number>`count(*)`;
}

export function countDistinct(column?: AnyPgColumn) {
	return column
		? sql<number>`COUNT(DISTINCT ${column})`
		: sql<number>`count(*)`;
}
