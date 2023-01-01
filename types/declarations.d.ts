// SVGR
declare type SVG = React.VFC<React.SVGProps<SVGSVGElement>>;

declare module "*.svg" {
	import React, { TrackHTMLAttributes } from "react";
	const SVG: SVG;
	export = SVG;
}

// UUID
declare module "uuid" {
	export function v4(): UUID;
}

// TinyBase
declare module "tinybase/store" {
	export interface BooleanSchema {
		type: "boolean";
		default?: boolean;
	}
	export interface NumberSchema {
		type: "number";
		default?: number;
	}
	export interface StringSchema {
		type: "string";
		default?: string;
	}

	export type CellSchema = BooleanSchema | NumberSchema | StringSchema;
	export type RowSchema = Record<string, CellSchema>;
	export type Schema = Record<string, RowSchema>;

	type CellInstance<S extends CellSchema> = S extends BooleanSchema
		? boolean
		: S extends NumberSchema
		? number
		: S extends StringSchema
		? string
		: never;

	type RowInstance<S extends RowSchema> = {
		[K in keyof S]: CellInstance<S[K]>;
	};

	export type SchemaInstance<S extends Schema> = {
		[Table in keyof S]: Record<string, RowInstance<S[Table]>>;
	};

	type CellValue = CellInstance<CellSchema>;

	type RowBase = Record<string, CellValue>;

	type Table<Row extends RowBase> = Record<string, Row>;

	type Database = Record<string, Table<RowBase>>;

	// Evaluates to `true` only if T is an object type with at least one key
	type HasKeys<T> = T extends object
		? keyof T extends never
			? false
			: true
		: false;
	type HasTables<DB extends Database> = HasKeys<DB>;

	type MapCell<Cell> = (cell: Cell | undefined) => Cell;
	type CellUpdate<Cell> = Cell | MapCell<Cell>;

	type CellChange<
		Tables extends Database,
		TableId extends keyof Tables,
		CellId extends keyof Tables[TableId][string]
	> = [
		changed: boolean,
		oldCell: Tables[TableId][string][CellId] | undefined,
		newCell: Tables[TableId][string][CellId]
	];
	type GetCellChange<Tables> = <
		TableId extends keyof Tables,
		CellId extends keyof Tables[TableId][string]
	>(
		tableId: TableId,
		rowId: string,
		cellId: CellId
	) => CellChange<Tables, TableId, CellId>;

	type TablesListener<Tables extends Database> = (
		store: Store<Tables>,
		getCellChange: GetCellChange<Tables>
	) => void;

	type GlobalTableListener<Tables extends Database> = (
		store: Store<Tables>,
		// ?: I don't think this type should be lifted in a generic for the function
		tableId: keyof Tables,
		getCellChange: GetCellChange<Tables>
	) => void;

	type TableListener<Tables extends Database, TableId extends keyof Tables> = (
		store: Store<Tables>,
		tableId: TableId,
		getCellChange: GetCellChange<Tables>
	) => void;

	// Not entirely clear on what this does, it may need to receive a store with a different schema
	type TablesIdListener<Tables extends Database> = (
		store: Store<Tables>
	) => void;

	export interface Store<Tables extends Database> {
		// === Schema definition ===
		setSchema<S extends Schema>(schema: S): Store<SchemaInstance<S>>;

		// === Getters ===
		getTable<TableId extends keyof Tables>(tableId: TableId): Tables[TableId];
		getTables(): Tables;
		// This method is meant to be used as a type guard with arbitrary strings
		hasTable<Id extends string>(tableId: Id): Id is keyof Tables;
		hasTables(): HasKeys<Tables>;
		/* We can't give a more precise type, since TypeScript doesn't keep track of the order of object keys
		 * Example:
		 * ```
		 * const schema1 = { a: {}, b: {}, };
		 *
		 * createStore()
		 *   .setSchema(schema1)
		 *   .getTableIds(); // -> ["a", "b"]
		 *
		 * const schema2 = { b: {}, a: {}, };
		 * createStore()
		 *   .setSchema(schema2)
		 *   .getTableIds(); // -> ["a", "b"]
		 * ```
		 * But TypeScript cannot differentiate between the type of `schema1` and `schema2`
		 */
		getTableIds(): Array<keyof Tables>;
		getRow<TableId extends keyof Tables>(
			tableId: TableId,
			rowId: string
		): Tables[TableId][string] | undefined;
		// We cannot provide any information about row IDs
		getRowIds<TableId extends keyof Tables>(tableId: TableId): Array<string>;
		getSortedRowIds<TableId extends keyof Tables>(
			tableId: TableId
		): Array<string>;
		getCell<
			TableId extends keyof Tables,
			CellId extends keyof Tables[TableId][string]
		>(
			tableId: TableId,
			rowId: string,
			cellId: CellId
		): Tables[TableId][string][CellId] | undefined;
		// Meant to be used as a type guard for arbitrary strings
		hasCell<TableId extends keyof Tables, CellId extends string>(
			tableId: TableId,
			rowId: string,
			cellId: CellId
		): CellId is keyof Tables[TableId][string];
		getCellIds<TableId extends keyof Tables>(
			tableId: TableId,
			rowId: string
		): Array<keyof Tables[TableId][string]>;
		// Not worth it to implement a JSON serializer in TypeScript
		getJson(): string;
		// Not worth it to implement a JSON serializer in TypeScript
		getSchemaJson(): string;

		// === Setters ===
		setTables(tables: Tables): Store<Tables>;
		setTables<TableId extends keyof Tables>(
			tableId: TableId,
			table: Tables[TableId]
		): Store<Tables>;
		setRow<TableId extends keyof Tables>(
			tableId: TableId,
			rowId: string,
			row: Tables[TableId][string]
		): Store<Tables>;
		// TODO: if we assume that TypeScript users conform to the types, this method should never return `undefined`
		// Should we remove it from the signature?
		addRow<TableId extends keyof Tables>(
			tableId: TableId,
			row: Tables[TableId][string]
		): string | undefined;
		setPartialRow<TableId extends keyof Tables>(
			tableId: TableId,
			rowId: string,
			partialRow: Partial<Tables[TableId][string]>
		): Store<Tables>;
		setCell<
			TableId extends keyof Tables,
			CellId extends keyof Tables[TableId][string]
		>(
			tableId: TableId,
			rowId: string,
			cellId: CellId,
			cell: CellUpdate<Tables[TableId][string][CellId]>
		);
		// This is the Wild West, all bets are off
		setJson(json: string): Store<Tables>;

		// == Listeners ==
		addTablesListener(
			listener: TablesListener<Tables>,
			mutator?: boolean
		): string;

		// Not entirely clear on what this does, may need to change the type
		addTableIdsListener(
			listener: TablesIdListener<Tables>,
			mutator?: boolean
		): string;

		// 2 overloads for `addTableListener`
		addTableListener(
			tableId: null,
			listener: GlobalTableListener<Tables>,
			mutator?: boolean
		): string;
		addTableListener<TableId extends keyof Tables>(
			tableId: TableId,
			listener: TableListener<Tables, TableId>,
			mutator?: boolean
		): string;
	}

	export function createStore<Tables extends Database = {}>(): Store<Tables>;

	// TODO: add opaque types for different types of IDs, to avoid confusing them with other strings?
	// (ex: ListenerId)
	// This may complicate the use of the library too much though
}
