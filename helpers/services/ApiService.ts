import { ApiError, createClient, PostgrestError, SupabaseClient, User as AuthUser } from "@supabase/supabase-js";
import { Email, Name, Result, User, UserUpdate } from 'types';
import { useState } from 'react';
import { Quark, quark } from 'helpers/quarky';

export enum AuthResult {
    Success,
    ConfirmationRequired,
    Error
}

export class ApiService {
    client: SupabaseClient;
    user: Quark<User | null>;

    constructor() {
        const API_URL = process.env.NEXT_PUBLIC_API_URL!;
        const API_KEY = process.env.NEXT_PUBLIC_ANON_KEY!;
        this.client = createClient(API_URL, API_KEY);
        this.user = quark<User | null>(null);
    }

    async initSession() {
        const authUser = this.client.auth.user();
        if (authUser) {
            // don't handle possible API error here
            await this._loadUser(authUser);
        }
    }

    private async _loadUser(user: AuthUser): Promise<AuthResult.Success | AuthResult.Error> {
        const { data, error } = await this.client
            .from<User>("users")
            .select("*")
            .match({ id: user.id })
            .single();

        if (error) {
            console.debug("Error loading up user: ", error);
            return AuthResult.Error;
        }
        console.log("Loaded up user: ", data);
        console.log("Created is Date: ", data?.created instanceof Date);

        this.user.set(data);
        return AuthResult.Success;
    }

    async signup(email: Email, password: string, pseudo: Name): Promise<AuthResult> {
        const { user, session, error } = await this.client.auth.signUp({
            email,
            password
        }, {
            data: { user_name: pseudo }
        });
        this.client.from("topos").select
        if (error) {
            console.debug("Sign up error: ", error);
            console.debug("Session: ", session);
            console.debug("User: ", user);
            return AuthResult.Error;
        }
        if (!user) {
            return AuthResult.ConfirmationRequired;
        }
        console.log("Received user: ", user);
        return await this._loadUser(user);
    }

    async signIn(email: Email, password: string): Promise<AuthResult> {
        const { user, error } = await this.client.auth.signIn({ email, password });
        if (error) {
            console.debug("Sign in error: ", error);
            return AuthResult.Error;
        }
        if (!user) {
            return AuthResult.ConfirmationRequired;
        }
        return await this._loadUser(user);
    }

    async signOut(): Promise<AuthResult.Success | AuthResult.Error> {
        const { error } = await this.client.auth.signOut();
        if (error) {
            console.debug("Sign out error: ", error);
            return AuthResult.Error;
        }
        return AuthResult.Success;
    }

    async updateUserInfo(user: User): Promise<AuthResult.Success | AuthResult.Error> {
        const { error } = await this.client
            .from<User>("users")
            .update(info);
        if (error) {
            console.debug("Error updating user info: ", error);
            return AuthResult.Error;
        }
        // ASSUME the user is not null atm
        this.user.set(prev => ({
            ...prev!,
            ...info
        }));
        return AuthResult.Success;
    }

}

export const api = new ApiService();
api.initSession();
