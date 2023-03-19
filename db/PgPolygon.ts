import { ColumnConfig } from "drizzle-orm";
import { ColumnBuilderConfig } from "drizzle-orm/column-builder";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core/columns/common";
import { parseWKB, ParsedPolygon } from "helpers/wkb";

export class PgPolygonBuilder extends PgColumnBuilder<
	ColumnBuilderConfig<{ data: ParsedPolygon["coordinates"]; driverParam: string }>
> {
	protected override $pgColumnBuilderBrand!: "PgPolygonBuilder";

	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>
	): PgPolygon<TTableName> {
		return new PgPolygon(table, this.config);
	}
}

export class PgPolygon<TTableName extends string> extends PgColumn<
	ColumnConfig<{
		tableName: TTableName;
		data: ParsedPolygon["coordinates"];
		driverParam: string;
	}>
> {
	protected override $pgColumnBrand!: "PgPolygon";

	constructor(
		table: AnyPgTable<{ name: TTableName }>,
		builder: PgPolygonBuilder["config"]
	) {
		super(table, builder);
	}

	getSQLType() {
		return "GEOMETRY(Polygon, 4326)"
	}

    override mapFromDriverValue(value: string): ParsedPolygon["coordinates"] {
		const json = parseWKB(value);
        if (json.type !== "Polygon") {
            throw new Error(`Expected Polygon geometry, received ${json.type}`)
        }
        return json.coordinates;
	}

	override mapToDriverValue(coordinates: ParsedPolygon["coordinates"]): string {
        const geojson = {
            type: "Polygon",
            coordinates
        } satisfies ParsedPolygon;
        return `ST_GeomFromGeoJSON('${geojson}')`
    }
}

export function Polygon(name: string): PgPolygonBuilder {
	return new PgPolygonBuilder(name);
}
