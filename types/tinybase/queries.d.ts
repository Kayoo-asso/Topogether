import { Database, Store } from "tinybase/store";

declare module "tinybase/queries" {
  export function createQueries<Tables extends Database>(store: Store<Tables>): Queries<Tables>;

  export interface Queries<Tables extends Database> {
    // === Getter methods ===
    getStore(): Store<Tables>;
  }
}