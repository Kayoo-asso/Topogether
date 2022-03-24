import { createClient  } from '@supabase/supabase-js';
import type { SupabaseClient  } from '@supabase/supabase-js';
import { ApiService } from './Api';
import { InMemorySync, SyncService } from './SyncService';
import { AuthService } from './Auth';

export * from './Api';
export * from './Auth';
export * from './Images';
export * from './SyncService';

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.NEXT_PUBLIC_ANON_KEY!
);

export const masterSupabaseClient: SupabaseClient | null =
    process.env.API_MASTER_KEY_LOCAL
        ? createClient(process.env.NEXT_PUBLIC_API_URL!, process.env.API_MASTER_KEY_LOCAL!)
        : null;

export const api = new ApiService(supabaseClient);
export const auth = new AuthService(supabaseClient);
export const sync: SyncService = new InMemorySync();
