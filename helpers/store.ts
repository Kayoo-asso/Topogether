import { createStore, KeepIfHasCellId, Schema, SchemaInstance, Tables, TablesWithCellId } from "tinybase/store";

const schema = {
	downloads: {
		status: { type: "string" },
		progress: { type: "number" },
	},
  stores: { 
    name: {type: "string"},
    age: { type: "number"},
    category: { type: "string"}
  }, 
  pets: {
    name: {type: "string"},
    age: { type: "boolean"},
  }
} satisfies Schema;



		 createStore().setSchema({
			  a: {
		     name: { type: "string" }	
		   },
		   b: {
		     name: { type: "number" }
		   },
		   c: {
		     otherField: { type: "boolean" }
		   }
		 }).addCellListener(
		   null, "rowId", "name",
		   (store, tableId, rowId, cellId, newCell, oldCell) => {
		     // TypeScript will be able to tell you that `tableId` can only be "a" or "b", but never "c"
         if(tableId === "a") {
          if(newCell === 3) {

          }
         }
		   }
		 )