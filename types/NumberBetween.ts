export type NumberBetween<Min, Max> = number & {
  readonly _phantom: unique symbol
};
