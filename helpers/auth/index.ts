import { User as SupabaseUser } from "@supabase/supabase-js"
import { Email, UUID, Session } from "types";

export const AccessTokenCookie = "topogether-access";
export const RefreshTokenCookie = "topogether-refresh";

export function makeSession(user: SupabaseUser): Session {
    const role = user.user_metadata.role;
    if (role !== "USER" && role !== "ADMIN") {
        throw new Error("User role not correctly saved in authentication token");
    }
    if (!user.email) {
        throw new Error("User does not have registered email!");
    }
    return {
        id: user.id as UUID,
        email: user.email as Email,
        role: role,
        user: null
    };
};