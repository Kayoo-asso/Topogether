export type Create<T> = Omit<T, 'id' | 'created' | 'modified'>;