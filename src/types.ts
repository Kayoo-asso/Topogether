export type SetState<T> = (update: T | ((prev: T) => T)) => void;
