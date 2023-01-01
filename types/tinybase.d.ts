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

	export type Tables<S extends Store> = S extends Store<infer DB> ? DB : never;

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

	type KeysOfUnion<T> = T extends any ? keyof T : never;
	export type AllCellIds<Tables extends Database> = KeysOfUnion<
		Tables[keyof Tables][string]
	>;

	export type AllowedCellIds<
		Tables extends Database,
		TableId extends keyof Tables | null
	> = TableId extends null ? AllCellIds<Tables> : keyof Tables[TableId][string];

	export type KeepIfHasCellId<
		Tables extends Database,
		TableId extends keyof Tables,
		CellId extends AllCellIds<Tables>
	> = CellId extends keyof Tables[TableId][string] ? TableId : never;

	export type TablesWithCellId<
		Tables extends Database,
		CellId extends AllCellIds<Tables>
	> = {
		[K in keyof Tables]: KeepIfHasCellId<Tables, K, CellId>;
	}[keyof Tables];

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
	type GetCellChange<Tables extends Database> = <
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

	// Not entirely clear on what this does, it may need to receive a store with a different schema
	type TablesIdListener<Tables extends Database> = (
		store: Store<Tables>
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

	type GlobalRowIdsListener<Tables extends Database> = (
		store: Store<Tables>,
		tableId: keyof Tables
	) => void;

	type RowIdsListener<Tables extends Database, TableId extends keyof Tables> = (
		store: Store<Tables>,
		tableId: TableId
	) => void;

	// I don't think it's worth it to provide two types, each with `descending` either `true` or `false`
	type SortedRowIdsListener<
		Tables extends Database,
		TableId extends keyof Tables,
		CellIdOrUndefined extends keyof Tables[TableId][string] | undefined
	> = (
		store: Store<Tables>,
		tableId: TableId,
		cellId: CellIdOrUndefined,
		descending: boolean,
		offset: number,
		limit: number | undefined,
		sortedRowIds: Array<string>
	) => void;

	type RowListener<
		Tables extends Database,
		TableId extends keyof Database | null,
		RowId extends string | null
	> = (
		store: Store<Tables>,
		tableId: TableId extends null ? keyof Tables : TableId,
		rowId: RowId extends null ? string : RowId,
		getCellChange: GetCellChange<Tables> | undefined
	) => void;

	type CellIdsListener<
		Tables extends Database,
		TableId extends keyof Database | null,
		RowId extends string | null
	> = (
		store: Store<Tables>,
		tableId: TableId extends null ? keyof Tables : TableId,
		rowId: RowId extends null ? string : RowId
	) => void;

	type ExactCellListener<
		Tables extends Database,
		TableId extends keyof Database,
		RowId extends string | null,
		CellId extends keyof Tables[TableId][string]
	> = (
		store: Store<Tables>,
		tableId: TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId,
		newCell: Tables[TableId][string][CellId],
		oldCell: Tables[TableId][string][CellId],
		getCellChange: GetCellChange<Tables> | undefined
	) => void;

	type CrossTablesCellListener<
		Tables extends Database,
		RowId extends string | null,
		CellId extends AllCellIds<Tables>
	> = <TableId extends TablesWithCellId<Tables, CellId>>(
		store: Store<Tables>,
		tableId: TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId,
		/* NOTE: we can provide the most accurate union possible here,
		 * but if 2 tables have the same cellId associated with two different types,
		 * the listener won't be able to narrow down the type of the cell by checking
		 * the name of the table.
		 * It would only be possible if the arguments were passed as a single object.
		 * Example:
		 * ```
		 * createStore().setSchema({
		 *	  a: {
		 *     name: { type: "string" }
		 *   },
		 *   b: {
		 *     name: { type: "number" }
		 *   },
		 *   c: {
		 *     otherField: { type: "boolean" }
		 *   }
		 * }).addCellListener(
		 *   null, "rowId", "name",
		 *   (store, tableId, rowId, cellId, newCell, oldCell) => {
		 *     // TypeScript will be able to tell you that `tableId` can only be "a" or "b", but never "c"
		 *     if(tableId === "a") {
		 *       // TypeScript won't be able to know that `newCell` has to be a string at this point
		 *     }
		 *   }
		 * )
		 * ```
		 */
		newCell: Tables[TableId][string][CellId],
		oldCell: Tables[TableId][string][CellId],
		getCellChange: GetCellChange<Tables> | undefined
	) => void;

	type CellListener<Tables extends Database, RowId extends string | null> = <
		TableId extends keyof Tables,
		CellId extends keyof Tables[TableId][string]
	>(
		store: Store<Tables>,
		tableId: TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId,
		newCell: Tables[TableId][string][CellId],
		oldCell: Tables[TableId][string][CellId],
		getCellChange: GetCellChange<Tables> | undefined
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

		// 2 overloads for `addRowIdsListener`
		addRowIdsListener(
			tableId: null,
			listener: GlobalRowIdsListener<Tables>,
			mutator?: boolean
		): string;
		addRowIdsListener<TableId extends keyof Tables>(
			tableId: TableId,
			listener: RowIdsListener<Tables, TableId>,
			mutator?: boolean
		): string;

		addSortedRowIdsListener<
			TableId extends keyof Tables,
			CellIdOrUndefined extends keyof Tables[TableId][string] | undefined
		>(
			tableId: TableId,
			cellId: CellIdOrUndefined,
			descending: boolean,
			offset: number,
			limit: number | undefined,
			listener: SortedRowIdsListener<Tables, TableId, CellIdOrUndefined>,
			mutator?: boolean
		): string;

		addRowListener<
			TableId extends keyof Tables | null,
			RowId extends string | null
		>(
			tableId: TableId,
			rowId: RowId,
			listener: RowListener<Tables, TableId, RowId>,
			mutator?: boolean
		): string;

		addCellIdsListener<
			TableId extends keyof Tables | null,
			RowId extends string | null
		>(
			tableId: TableId,
			rowId: RowId,
			listener: CellIdsListener<Tables, TableId, RowId>,
			mutator?: boolean
		): string;

		// 3 overloads for addCellListener
		// Necessary to provide precise typings on the cell values received by the listener
		addCellListener<
			TableId extends keyof Tables,
			RowId extends string | null,
			CellId extends keyof Tables[TableId][string]
		>(
			tableId: TableId,
			rowId: RowId,
			cellId: CellId,
			listener: ExactCellListener<Tables, TableId, RowId, CellId>,
			mutator?: boolean
		): string;

		addCellListener<
			RowId extends string | null,
			CellId extends AllCellIds<Tables>
		>(
			tableId: null,
			rowId: RowId,
			cellId: CellId,
			listener: CrossTablesCellListener<Tables, RowId, CellId>,
			mutator?: boolean
		): string;

		addCellListener<RowId extends string | null>(
			tableId: null,
			rowId: RowId,
			cellId: null,
			listener: CellListener<Tables, RowId>,
			mutator?: boolean
		): string;
	}

	export function createStore<Tables extends Database = {}>(): Store<Tables>;

	// TODO:
	// - add opaque types for different types of IDs, to avoid confusing them with other strings?
	//   (ex: ListenerId)
	//   This may complicate the use of the library too much though
	// - find a way to enforce mutator / non mutator distinction on listeners?
}
