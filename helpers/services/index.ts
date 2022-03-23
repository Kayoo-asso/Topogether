import { ApiService, AuthResult, masterApi } from './ApiService';
import { InMemorySync, SyncService } from './SyncService';

export * from './ApiService';
export * from './SyncService';
export * from './Images';

export const api = new ApiService();
export const sync: SyncService = new InMemorySync();
