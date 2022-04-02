import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.NEXT_PUBLIC_ANON_KEY!
);


export const getSupaMasterClient = (): SupabaseClient | null =>
    process.env.NEXT_PUBLIC_API_MASTER_KEY_LOCAL
        ? createClient(process.env.NEXT_PUBLIC_API_URL!, process.env.NEXT_PUBLIC_API_MASTER_KEY_LOCAL!)
        : null;