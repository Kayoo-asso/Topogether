import { createStore } from "tinybase/store";

const store = createStore().setSchema({
	downloads: {
		status: { type: "string" },
		progress: { type: "number" },
	},
	stores: {
		name: { type: "string" },
		age: { type: "number" },
		category: { type: "string" },
	},
	pets: {
		name: { type: "string" },
		// kind of artificial, but good for the demo
		age: { type: "string" },
	},
});

store.addCellListener(
	null, // listening to all tables is the most challenging case
	"someRowId",
	"age", // auto-completion for all possible cell IDs
	(store, tableId, rowId, cellId, newCell, oldCell, getCellChange) => {
		// `tableId` is known to be `stores` or `pets`
		// `rowId` is known to be constant
		// `cellId` is known to be constant
		// `newCell` and `oldCell` are known to be a string or a number
		//  -> (can't refine more than that, even by checking `tableId` unfortunately)
		// `getCellChange` is also fully typesafe here
	}
);

createStore()
	.setSchema({
		a: {
			name: { type: "string" },
		},
		b: {
			name: { type: "number" },
		},
		c: {
			otherField: { type: "boolean" },
		},
	})
	.addCellListener(
		null,
		"rowId",
		"name",
		(store, tableId, rowId, cellId, newCell, oldCell) => {
			// TypeScript will be able to tell you that `tableId` can only be "a" or "b", but never "c"
			if (tableId === "a") {
				if (newCell === 3) {
				}
			}
		}
	);