import { ApiService } from './ApiService';
import { InMemorySync, SyncService } from './SyncService';

export * from './ApiService';
export * from './SyncService';

export const api = new ApiService();
api.initSession();

export const sync: SyncService = new InMemorySync();