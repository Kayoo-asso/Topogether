import { ApiService } from './ApiService';
import { InMemorySync, SyncService } from './SyncService';
import { AuthService } from './AuthService';
import { supabaseClient } from './SupabaseClient';

export * from './ApiService';
export * from './AuthService';
export * from './ImageService';
export * from './SyncService';
export * from './SupabaseClient';


export const api = new ApiService(supabaseClient);
export const auth = new AuthService(supabaseClient);
export const sync: SyncService = new InMemorySync();
