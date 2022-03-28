import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.NEXT_PUBLIC_ANON_KEY!
);

export const masterSupabaseClient: SupabaseClient | null =
    process.env.API_MASTER_KEY_LOCAL
        ? createClient(process.env.NEXT_PUBLIC_API_URL!, process.env.API_MASTER_KEY_LOCAL!)
        : null;