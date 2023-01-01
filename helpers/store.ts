import { createStore, Schema, SchemaInstance } from "tinybase/store";

const schema = {
	downloads: {
		status: { type: "string" },
		progress: { type: "number" },
	},
} satisfies Schema;


function test(tables: SchemaInstance<typeof schema>) {
  tables.downloads["id"]
}

const store = createStore().setSchema(schema);
