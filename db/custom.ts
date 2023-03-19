import { Expression, Kysely, OperationNode, RawBuilder, sql, SelectQueryBuilder } from "kysely";
import {
	JsonInput,
	Point,
	PointInput,
	Polygon,
	PolygonInput,
} from "./types";

export function json<T>(value: T): RawBuilder<JsonInput<T>> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`
}
export function pointWrite(point: [number, number]): RawBuilder<PointInput>
export function pointWrite(point: [number, number] | undefined): RawBuilder<PointInput> | null
export function pointWrite(point: [number, number] | undefined): RawBuilder<PointInput> | null  {
	if(!point) {
		return null;
	}
	else {
		return sql`ST_Point(${point[0]}, ${point[1]})`;
	}
}

export function pointRead(column: string) {
	// Using Postgres' array literal syntax to return an array directly
	return sql<Point>`'{ ST_X(${sql.ref(column)}), ST_Y(${sql.ref(
		column
	)}) }'`.as(column);
}

export function polygonWrite(polygon: Polygon): RawBuilder<PolygonInput> {
	return sql`ST_MakePolygon(ST_MakeLine(${polygon.map(pointWrite)}))`;
}

export function polygonRead(column: string) {
	// Convert to GeoJSON and only return the coordinates
	return sql<Polygon>`ST_AsGeoJSON(${sql.ref(column)})->'coordinates'`.as(
		column
	);
}
