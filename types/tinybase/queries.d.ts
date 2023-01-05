import {
	AllCellIds,
	CellValue,
	Schema,
	Store,
	SupportedCellValues,
	TablesWithCellId,
} from "tinybase/store";

declare module "tinybase/queries" {
	export function createQueries<S extends Schema>(store: Store<S>): Queries<S>;

	// The types for the query builder aren't 100% strict, because it's
	// impossible to guarantee full typesafety with the current design
	// of separate function calls.
	// A tiny query builder will be provided for fully typesafe query creation.
	// Otherwise, we just provide very loose types, that still provide autocompletion
	// + can catch typos.

	export interface As {
		as(selectedCellId: string): void;
	}

	export type Select<S extends Schema> =
		| ((cellId: AllCellIds<S>) => void)
		| (<TableId extends keyof S>(
				tableId: TableId,
				cellId: keyof S[TableId]
		  ) => void)
		| ((
				getTableCell: (
					getCell: GetCell<S>,
					rowId: string
				) => SupportedCellValues | undefined
		  ) => As);

	export type Join<S extends Schema, MainTableId extends keyof S> =
		| ((joinedTableId: keyof S, on: keyof S[MainTableId]) => As)
		| ((
				joinedTableId: keyof S,
				on: (getCell: GetCell<S>, rowId: string) => string | undefined
		  ) => As)
		| (<IntermediateTableId extends keyof S>(
				joinedTableId: keyof S,
				fromIntermediateJoinedTableId: IntermediateTableId,
				on: keyof S[IntermediateTableId]
		  ) => As)
		| (<IntermediateTableId extends keyof S>(
				joinedTableId: keyof S,
				fromIntermediateJoinedTableId: IntermediateTableId,
				on: (
					getIntermediateJoinedCell: GetCell<S>,
					intermediateJoinedTableRowId: string
				) => undefined | string
		  ) => As);

	export type Where<S extends Schema, MainTableId extends keyof S> =
		| (<CellId extends keyof S[MainTableId]>(
				cellId: CellId,
				equals: CellValue<S[MainTableId][CellId]>
		  ) => void)
		| (<
				JoinedTableId extends keyof S,
				JoinedCellId extends keyof S[JoinedTableId]
		  >(
				joinedTableId: JoinedTableId,
				joinedCellId: JoinedCellId,
				equals: CellValue<S[JoinedTableId][JoinedCellId]>
		  ) => void)
		| ((condition: (getTableCell: GetCell<S>) => boolean) => void);

	export type Aggregate = (
		cells: SupportedCellValues[],
		length: number
	) => SupportedCellValues;
	export type AggregateAdd = (
		current: SupportedCellValues,
		add: SupportedCellValues,
		length: number
	) => SupportedCellValues | undefined;
	export type AggregateRemove = (
		current: SupportedCellValues,
		remove: SupportedCellValues,
		length: number
	) => SupportedCellValues | undefined;
	export type AggregateReplace = (
		current: SupportedCellValues,
		add: SupportedCellValues,
		remove: SupportedCellValues,
		length: number
	) => SupportedCellValues | undefined;

	// `selectedCellId` is a string here, because it can also target renamed cell IDs
	export type Group = (
		selectedCellId: string,
		aggregate: "count" | "sum" | "avg" | "min" | "max" | Aggregate,
		aggregateAdd?: AggregateAdd,
		aggregateRemove?: AggregateRemove,
		aggregateReplace?: AggregateReplace
	) => As;

	// `selectedCellId` is a string here, because it can also target renamed cell IDs
	export type Having =
		| ((selectedOrGroupedCellId: string, equals: SupportedCellValues) => void)
		| ((
				condition: (getSelectedOrGroupedCell: GetCell<Schema>) => boolean
		  ) => void);

	// I don't think it's worth it to try and infer the exact union of types for this cell ID across all tables
	// There are only 3 possible types for cell values, so just return a union of all of them
	export type GetCell<S extends Schema> = (
		cellId: AllCellIds<S>
	) => SupportedCellValues | undefined;

	export interface Queries<S extends Schema> {
		// === Getter methods ===
		getStore(): Store<S>;

    // === Configuration methods ===
    setQuer
	}
}
