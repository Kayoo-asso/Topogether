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
	export type TableSchema = Record<string, CellSchema>;
	export type Schema = Record<string, TableSchema>;

	type CellValue<S extends CellSchema> = S extends BooleanSchema
		? boolean
		: S extends NumberSchema
		? number
		: S extends StringSchema
		? string
		: never;

	type SupportedCellValues = CellValue<CellSchema>;

	type KeysWithoutDefault<Table extends TableSchema> = {
		[Key in keyof Table]: Table[Key]["default"] extends CellValue<Table[Key]>
			? never
			: Key;
	}[keyof Table];

	export type RowInput<S extends TableSchema> = {
		[K in KeysWithoutDefault<S>]: CellValue<S[K]>;
	};
	export type Row<S extends TableSchema> = {
		[K in keyof S]: CellValue<S[K]>;
	};

	export type Table<S extends TableSchema> = Record<string, Row<S>>;
	export type TableInput<S extends TableSchema> = Record<string, RowInput<S>>;

	export type Tables<S extends Schema> = {
		[K in keyof S]: Table<S[K]>;
	};
	export type TablesInput<S extends Schema> = {
		[K in keyof S]: TableInput<S[K]>;
	};

	export type SchemaOf<S extends Store<any>> = S extends Store<infer Schema>
		? Schema
		: never;

	export type Data<S extends Store<any>> = Tables<SchemaOf<S>>;

	// Evaluates to `true` only if T is an object type with at least one key
	type HasKeys<T> = T extends object
		? keyof T extends never
			? false
			: true
		: false;

	type HasTables<S extends Schema> = HasKeys<S>;

	type KeysOfUnion<T> = T extends any ? keyof T : never;

	export type AllCellIds<S extends Schema> = KeysOfUnion<S[keyof S]>;

	type AllowedCellIds<
		S extends Schema,
		TableId extends keyof S | null
	> = TableId extends keyof S ? keyof S[TableId] : AllCellIds<S>;

	export type KeepIfHasCellId<
		S extends Schema,
		TableId extends keyof S,
		CellId extends AllCellIds<S>
	> = CellId extends keyof S[TableId] ? TableId : never;

	export type TablesWithCellId<
		S extends Schema,
		CellId extends AllCellIds<S>
	> = {
		[TableId in keyof S]: KeepIfHasCellId<S, TableId, CellId>;
	}[keyof S];

	type MapCell<Cell> = (cell: Cell | undefined) => Cell;
	type CellUpdate<Cell> = Cell | MapCell<Cell>;

	type CellChange<
		S extends Schema,
		TableId extends keyof S,
		CellId extends keyof S[TableId]
	> = [
		changed: boolean,
		oldCell: CellValue<S[TableId][CellId]> | undefined,
		newCell: CellValue<S[TableId][CellId]>
	];

	type GetCellChange<S extends Schema> = <
		TableId extends keyof S,
		CellId extends keyof S[TableId]
	>(
		tableId: TableId,
		rowId: string,
		cellId: CellId
	) => CellChange<S, TableId, CellId>;

	type TablesListener<S extends Schema> = (
		store: Store<S>,
		getCellChange: GetCellChange<S>
	) => void;

	// Not entirely clear on what this does, it may need to receive a store with a different schema
	type TablesIdListener<S extends Schema> = (store: Store<S>) => void;

	type GlobalTableListener<S extends Schema> = (
		store: Store<S>,
		tableId: keyof S,
		getCellChange: GetCellChange<S>
	) => void;

	type TableListener<S extends Schema, TableId extends keyof S> = (
		store: Store<S>,
		tableId: TableId,
		getCellChange: GetCellChange<S>
	) => void;

	type GlobalRowIdsListener<S extends Schema> = (
		store: Store<S>,
		tableId: keyof S
	) => void;

	type RowIdsListener<S extends Schema, TableId extends keyof S> = (
		store: Store<S>,
		tableId: TableId
	) => void;

	// I don't think it's worth it to provide two types, each with `descending` either `true` or `false`
	type SortedRowIdsListener<
		S extends Schema,
		TableId extends keyof S,
		CellIdOrUndefined extends keyof S[TableId] | undefined
	> = (
		store: Store<S>,
		tableId: TableId,
		cellId: CellIdOrUndefined,
		descending: boolean,
		offset: number,
		limit: number | undefined,
		sortedRowIds: Array<string>
	) => void;

	type RowListener<
		S extends Schema,
		TableId extends keyof S | null,
		RowId extends string | null
	> = (
		store: Store<S>,
		tableId: TableId extends null ? keyof S : TableId,
		rowId: RowId extends null ? string : RowId,
		getCellChange: GetCellChange<S> | undefined
	) => void;

	type CellIdsListener<
		S extends Schema,
		TableId extends keyof S | null,
		RowId extends string | null
	> = (
		store: Store<S>,
		tableId: TableId extends null ? keyof S : TableId,
		rowId: RowId extends null ? string : RowId
	) => void;

	type ExactCellListener<
		S extends Schema,
		TableId extends keyof S,
		RowId extends string | null,
		CellId extends keyof S[TableId]
	> = (
		store: Store<S>,
		tableId: TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId,
		newCell: CellValue<S[TableId][CellId]>,
		oldCell: CellValue<S[TableId][CellId]>,
		getCellChange: GetCellChange<S> | undefined
	) => void;

	type CrossTablesCellListener<
		S extends Schema,
		RowId extends string | null,
		CellId extends AllCellIds<S>
	> = <TableId extends TablesWithCellId<S, CellId>>(
		store: Store<S>,
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
		newCell: CellValue<S[TableId][CellId]>,
		oldCell: CellValue<S[TableId][CellId]>,
		getCellChange: GetCellChange<S> | undefined
	) => void;

	type CellListener<S extends Schema, RowId extends string | null> = <
		TableId extends keyof S,
		CellId extends keyof S[TableId]
	>(
		store: Store<S>,
		tableId: TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId,
		newCell: CellValue<S[TableId][CellId]>,
		oldCell: CellValue<S[TableId][CellId]>,
		getCellChange: GetCellChange<S> | undefined
	) => void;

	type InvalidCellListener<
		S extends Schema,
		TableId extends keyof S | null,
		RowId extends string | null,
		CellId extends AllowedCellIds<S, TableId> | null
	> = (
		store: Store<S>,
		tableId: TableId extends null ? keyof S : TableId,
		rowId: RowId extends null ? string : RowId,
		cellId: CellId extends null
			? TableId extends keyof S
				? keyof S[TableId]
				: AllCellIds<S>
			: CellId,
		invalidCells: any[]
	) => void;

	type TransactionListener<S extends Schema> = (
		store: Store<S>,
		cellsTouched: boolean
	) => void;

	type CellCallback<S extends Schema, TableId extends keyof S> = <
		CellId extends keyof S[TableId]
	>(
		cellId: CellId,
		cell: CellValue<S[TableId][CellId]>
	) => void;

	type RowCallback<S extends Schema, TableId extends keyof S> = (
		rowId: string,
		forEachCell: (cellCallback: CellCallback<S, TableId>) => void
	) => void;

	type TableCallback<S extends Schema> = <TableId extends keyof S>(
		tableId: TableId,
		forEachRow: (rowCallback: RowCallback<S, TableId>) => void
	) => void;

	type CellChangeArray<CellValue> =
		| [undefined, CellValue]
		| [CellValue, undefined]
		| [CellValue, CellValue];

	type ChangedCells<S extends Schema> = Partial<{
		[TableId in keyof S]: Record<
			string,
			Partial<{
				[CellId in keyof S[TableId]]: CellChangeArray<
					CellValue<S[TableId][CellId]>
				>;
			}>
		>;
	}>;

	type InvalidCells<S extends Schema> = Partial<{
		[TableId in keyof S]: Record<
			string,
			Partial<{
				[CellId in keyof S[TableId]]: Array<any>;
			}>
		>;
	}>;

	export type DoRollback<S extends Schema> = (
		changedCells: ChangedCells<S>,
		invalidCells: InvalidCells<S>
	) => boolean;

	export interface StoreListenerStats {
		tables?: number;
		tableIds?: number;
		table?: number;
		rowIds?: number;
		sortedRowIds?: number;
		row?: number;
		cellIds?: number;
		cell?: number;
		invalidCell?: number;
		transaction?: number;
	}

	// === Callbacks ===

	export interface Store<S extends Schema> {
		// === Schema definition ===
		setSchema<NewSchema extends Schema>(schema: NewSchema): Store<NewSchema>;

		// === Getters ===
		getTable<TableId extends keyof S>(tableId: TableId): Tables<S>[TableId];
		getTables(): Tables<S>;
		// This method is meant to be used as a type guard with arbitrary strings
		hasTable(tableId: string): tableId is string & keyof S;
		hasTables(): HasKeys<S>;
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
		getTableIds(): Array<keyof S>;
		getRow<TableId extends keyof S>(
			tableId: TableId,
			rowId: string
		): Row<S[TableId]> | undefined;
		// We cannot provide any information about row IDs
		getRowIds<TableId extends keyof S>(tableId: TableId): Array<string>;
		getSortedRowIds<TableId extends keyof S>(tableId: TableId): Array<string>;
		getCell<TableId extends keyof S, CellId extends keyof S[TableId]>(
			tableId: TableId,
			rowId: string,
			cellId: CellId
		): CellValue<S[TableId][CellId]> | undefined;
		// Meant to be used as a type guard for arbitrary strings
		hasCell<TableId extends keyof S>(
			tableId: TableId,
			rowId: string,
			cellId: string
		): cellId is string & keyof S[TableId];
		getCellIds<TableId extends keyof S>(
			tableId: TableId,
			rowId: string
		): Array<keyof S[TableId]>;
		// Not worth it to implement a JSON serializer in TypeScript
		getJson(): string;
		// Not worth it to implement a JSON serializer in TypeScript
		getSchemaJson(): string;

		// === Setters ===
		// TODO: should we allow creation of new tables here?
		// Example: I don't know what TinyBase does if you .setTable() for a table ID
		// that is not in the schema
		setTables(tables: TablesInput<S>): Store<S>;
		setTables<TableId extends keyof S>(
			tableId: TableId,
			table: TableInput<S[TableId]>
		): Store<S>;
		setRow<TableId extends keyof S>(
			tableId: TableId,
			rowId: string,
			row: RowInput<S[TableId]>
		): Store<S>;
		// TODO: if we assume that TypeScript users conform to the types, this method should never return `undefined`
		// Should we remove it from the signature?
		addRow<TableId extends keyof S>(
			tableId: TableId,
			row: RowInput<S[TableId]>
		): string | undefined;

		setPartialRow<TableId extends keyof S>(
			tableId: TableId,
			rowId: string,
			partialRow: Partial<Row<S[TableId]>>
		): Store<S>;

		setCell<TableId extends keyof S, CellId extends keyof S[TableId]>(
			tableId: TableId,
			rowId: string,
			cellId: CellId,
			cell: CellUpdate<CellValue<S[TableId][CellId]>>
		): Store<S>;
		// This is the Wild West, all bets are off
		setJson(json: string): Store<S>;

		// == Listeners ==
		addTablesListener(listener: TablesListener<S>, mutator?: boolean): string;

		// Not entirely clear on what this does, may need to change the type
		addTableIdsListener(
			listener: TablesIdListener<S>,
			mutator?: boolean
		): string;

		// 2 overloads for `addTableListener`
		addTableListener(
			tableId: null,
			listener: GlobalTableListener<S>,
			mutator?: boolean
		): string;
		addTableListener<TableId extends keyof S>(
			tableId: TableId,
			listener: TableListener<S, TableId>,
			mutator?: boolean
		): string;

		// 2 overloads for `addRowIdsListener`
		addRowIdsListener(
			tableId: null,
			listener: GlobalRowIdsListener<S>,
			mutator?: boolean
		): string;
		addRowIdsListener<TableId extends keyof S>(
			tableId: TableId,
			listener: RowIdsListener<S, TableId>,
			mutator?: boolean
		): string;

		addSortedRowIdsListener<
			TableId extends keyof S,
			CellIdOrUndefined extends keyof S[TableId] | undefined
		>(
			tableId: TableId,
			cellId: CellIdOrUndefined,
			descending: boolean,
			offset: number,
			limit: number | undefined,
			listener: SortedRowIdsListener<S, TableId, CellIdOrUndefined>,
			mutator?: boolean
		): string;

		addRowListener<TableId extends keyof S | null, RowId extends string | null>(
			tableId: TableId,
			rowId: RowId,
			listener: RowListener<S, TableId, RowId>,
			mutator?: boolean
		): string;

		addCellIdsListener<
			TableId extends keyof S | null,
			RowId extends string | null
		>(
			tableId: TableId,
			rowId: RowId,
			listener: CellIdsListener<S, TableId, RowId>,
			mutator?: boolean
		): string;

		// 3 overloads for addCellListener
		// Necessary to provide precise typings on the cell values received by the listener
		addCellListener<
			TableId extends keyof S,
			RowId extends string | null,
			CellId extends keyof S[TableId]
		>(
			tableId: TableId,
			rowId: RowId,
			cellId: CellId,
			listener: ExactCellListener<S, TableId, RowId, CellId>,
			mutator?: boolean
		): string;

		addCellListener<RowId extends string | null, CellId extends AllCellIds<S>>(
			tableId: null,
			rowId: RowId,
			cellId: CellId,
			listener: CrossTablesCellListener<S, RowId, CellId>,
			mutator?: boolean
		): string;

		addCellListener<RowId extends string | null>(
			tableId: null,
			rowId: RowId,
			cellId: null,
			listener: CellListener<S, RowId>,
			mutator?: boolean
		): string;

		addInvalidCellListener<
			TableId extends keyof S | null,
			RowId extends string | null,
			CellId extends AllowedCellIds<S, TableId> | null
		>(
			tableId: TableId,
			rowId: RowId,
			cellId: CellId,
			listener: InvalidCellListener<S, TableId, RowId, CellId>,
			mutator?: boolean
		): string;

		addDidFinishTransactionListener(listener: TransactionListener<S>): string;
		addWillFinishTransactionListener(listener: TransactionListener<S>): string;

		callListener(listenerId: string): Store<S>;
		delListener(listenerId: string): Store<S>;

		// === [Iterator methods] ===
		forEachTable(tableCallback: TableCallback<S>): void;
		forEachRow<TableId extends keyof S>(
			tableId: TableId,
			rowCallback: RowCallback<S, TableId>
		): void;
		forEachCell<TableId extends keyof S>(
			tableId: TableId,
			rowId: string,
			cellCallback: CellCallback<S, TableId>
		): void;

		// === [Transaction methods] ===
		transaction<T>(actions: () => T, doRollback?: DoRollback<S>): T;
		startTransaction(): Store<S>;
		finishTransaction(doRollback?: DoRollback<S>): Store<S>;

		// === [Delete methode] ===
		// TODO: should this remove the table from the type
		delTables(): Store<S>;
		// TODO: should this remove the table from the type?
		delTable<TableId extends keyof S>(tableId: TableId): Store<S>;
		delRow<TableId extends keyof S>(tableId: TableId, rowId: string): Store<S>;

		// TODO: shoud we make the Store generic by its schema, to refine the type for this?
		// I don't think it's worth it
		delCell<TableId extends keyof S, CellId extends keyof S[TableId]>(
			tableId: TableId,
			rowId: string,
			cellId: CellId,
			forceDel?: boolean
		): Store<S>;

		delSchema(): Store<{}>;

		getListenerStats(): StoreListenerStats;
	}

	export type ExternalSchema = Record<
		string,
		Record<string, SupportedCellValues>
	>;

	type CellSchemaFrom<T extends SupportedCellValues> = T extends boolean
		? { type: "boolean" }
		: T extends number
		? { type: "number" }
		: T extends string
		? { type: "string" }
		: never;

	export type SchemaFromExternal<Ext extends ExternalSchema> = {
		[TableId in keyof Ext]: {
			[CellId in keyof Ext[TableId]]: CellSchemaFrom<Ext[TableId][CellId]>;
		};
	};

	export function createStore<
		Ext extends ExternalSchema = {}
	>(): Store<SchemaFromExternal<Ext>>;

	// TODO:
	// - add opaque types for different types of IDs, to avoid confusing them with other strings?
	//   (ex: ListenerId)
	//   This may complicate the use of the library too much though
	// - find a way to enforce mutator / non mutator distinction on listeners?
}
