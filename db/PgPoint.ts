import { ColumnConfig } from "drizzle-orm";
import { ColumnBuilderConfig } from "drizzle-orm/column-builder";
import { AnyPgTable } from "drizzle-orm/pg-core";
import { PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core/columns/common";
import { parseWKB } from "helpers/wkb";

export class PgPointBuilder extends PgColumnBuilder<
	ColumnBuilderConfig<{ data: [number, number]; driverParam: string }>
> {
	protected override $pgColumnBuilderBrand!: "PgPointBuilder";

	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>
	): PgPoint<TTableName> {
		return new PgPoint(table, this.config);
	}
}

export class PgPoint<TTableName extends string> extends PgColumn<
	ColumnConfig<{
		tableName: TTableName;
		data: [number, number];
		driverParam: string;
	}>
> {
	protected override $pgColumnBrand!: "PgPoint";

	constructor(
		table: AnyPgTable<{ name: TTableName }>,
		builder: PgPointBuilder["config"]
	) {
		super(table, builder);
	}

	getSQLType() {
		return "GEOMETRY(POINT, 4326)"
	}

    override mapFromDriverValue(value: string): [number, number] {
		const json = parseWKB(value);
        if (json.type !== "Point") {
            throw new Error(`Expected Point geometry, received ${json.type}`)
        }
        return json.coordinates;
	}

	override mapToDriverValue(value: [number, number]): string {
		return `ST_Point(${value[0]}, ${value[1]})`
	}
}

export function point(name: string): PgPointBuilder {
	return new PgPointBuilder(name);
}
