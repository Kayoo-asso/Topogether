import { Awaitable, Account } from "next-auth";
import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import type { Pool } from 'pg';

class CockroachAdapter implements Adapter {
    readonly db: Pool;

    constructor(db: Pool) {
        this.db = db;
    }

    createUser: (user: Omit<AdapterUser, "id">) => Awaitable<AdapterUser>;
    getUser: (id: string) => Awaitable<AdapterUser | null>;
    getUserByEmail: (email: string) => Awaitable<AdapterUser | null>;
    getUserByAccount: (providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Awaitable<AdapterUser | null>;
    updateUser: (user: Partial<AdapterUser>) => Awaitable<AdapterUser>;
    deleteUser?: ((userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>) | undefined;
    linkAccount: (account: Account) => Promise<void> | Awaitable<Account | null | undefined>;
    unlinkAccount?: ((providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Promise<void> | Awaitable<Account | undefined>) | undefined;
    createSession: (session: { sessionToken: string; userId: string; expires: Date; }) => Awaitable<AdapterSession>;
    getSessionAndUser: (sessionToken: string) => Awaitable<{ session: AdapterSession; user: AdapterUser; } | null>;
    updateSession: (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => Awaitable<AdapterSession | null | undefined>;
    deleteSession: (sessionToken: string) => Promise<void> | Awaitable<AdapterSession | null | undefined>;
    createVerificationToken?: ((verificationToken: VerificationToken) => Awaitable<VerificationToken | null | undefined>) | undefined;
    useVerificationToken?: ((params: { identifier: string; token: string; }) => Awaitable<VerificationToken | null>) | undefined;

}
