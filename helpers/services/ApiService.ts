import { config } from 'dotenv'
import { ApiError, createClient, SupabaseClient } from "@supabase/supabase-js";
import { Email, ProfileCreate, Result, User } from 'types';

type SupabaseUserMeta = ProfileCreate & {
    firstSignIn: boolean
};

export class ApiService {
    client: SupabaseClient;

    constructor() {
        config();
        const API_URL = process.env.NODE_ENV === "production"
            ? process.env.API_URL!
            : process.env.API_URL_LOCAL!;
        const API_KEY = process.env.NODE_ENV === "production"
            ? process.env.API_ANON_KEY!
            : process.env.API_ANON_KEY_LOCAL!;
        this.client = createClient(API_URL, API_KEY);
    }

    async signup(email: Email, password: string, data: ProfileCreate): Promise<Result<User | null, ApiError>> {
        const { user, session, error } = await this.client.auth.signUp({
            email,
            password
        }, {
            data: { ...data, firstSignIn: true }
        });
        this.client.auth.session
        if (error !== null) {
            return { success: false, error }
        }
        if (user !== null && session !== null) {
            return { success: true, data: { ...session.user?.user_metadata } }
        }
        return { success: true, data: null };
    }

    async signIn(email: Email, password: string) {
        const { user, session, error } = await this.client.auth.signIn({ email, password });
        if (user !== null) {
        }
    }
}

export const apiService = new ApiService();