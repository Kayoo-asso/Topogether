import { ColumnConfig } from 'drizzle-orm';
import { ColumnBuilderConfig } from 'drizzle-orm/column-builder';
import { AnyPgTable } from "drizzle-orm/pg-core";
import { PgColumn, PgColumnBuilder } from "drizzle-orm/pg-core/columns/common";

export class BitflagColumnBuilder<TData extends number>
	extends PgColumnBuilder<
		ColumnBuilderConfig<{ data: TData; driverParam: string }>
	>
{
	protected override $pgColumnBuilderBrand!: 'PgTextBuilder';

	build<TTableName extends string>(
		table: AnyPgTable<{ name: TTableName }>,
	): BitflagColumn<TTableName, TData> {
		return new BitflagColumn(table, this.config);
	}
}

export class BitflagColumn<TTableName extends string, TData extends number>
	extends PgColumn<
		ColumnConfig<{ tableName: TTableName; data: TData; driverParam: string }>
	>
{
	protected override $pgColumnBrand!: 'PgText';

	constructor(
		table: AnyPgTable<{ name: TTableName }>,
		builder: BitflagColumnBuilder<TData>['config'],
	) {
		super(table, builder);
	}

	getSQLType(): string {
		return 'integer';
	}
}

export function bitflag<T extends number>(
	name: string,
): BitflagColumnBuilder<T> {
	return new BitflagColumnBuilder(name) as any;
}