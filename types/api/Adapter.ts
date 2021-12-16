import { Awaitable, Account } from "next-auth";
import type { Adapter, AdapterSession, AdapterUser, VerificationToken } from "next-auth/adapters";
import type { Client, Pool, PoolClient } from 'pg';

// TODO: Do we need to catch errors from queries?
// class CockroachAdapter implements Adapter {

//     private static defaultConfig: AdapterConfig = {
//         usersTable: 'users',
//         accountsTable: 'accounts',
//         sessionsTable: 'sessions',
//         verificationTokensTable: 'verification_tokens',
//         supportOAuth1: true,
//         supportGitHub: true
//     };
//     private readonly db: Pool | PoolClient | Client;
//     private readonly config: AdapterConfig;

//     constructor(db: Pool | PoolClient | Client, options?: AdapterOptions) {
//         this.db = db;
//         this.config = { ...CockroachAdapter.defaultConfig, ...options };
//     }

//     async verifyUsersSchema() {
//         const schema = await this.db.query(
//             "SHOW COLUMNS FROM $1",
//             [this.config.usersTable]
//         ); 
//     }

//     createUser: (user: Omit<AdapterUser, "id">) => Awaitable<AdapterUser>;
//     getUser: (id: string) => Awaitable<AdapterUser | null>;
//     getUserByEmail: (email: string) => Awaitable<AdapterUser | null>;
//     getUserByAccount: (providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Awaitable<AdapterUser | null>;
//     updateUser: (user: Partial<AdapterUser>) => Awaitable<AdapterUser>;
//     deleteUser?: ((userId: string) => Promise<void> | Awaitable<AdapterUser | null | undefined>) | undefined;
//     linkAccount: (account: Account) => Promise<void> | Awaitable<Account | null | undefined>;
//     unlinkAccount?: ((providerAccountId: Pick<Account, "provider" | "providerAccountId">) => Promise<void> | Awaitable<Account | undefined>) | undefined;
//     createSession: (session: { sessionToken: string; userId: string; expires: Date; }) => Awaitable<AdapterSession>;
//     getSessionAndUser: (sessionToken: string) => Awaitable<{ session: AdapterSession; user: AdapterUser; } | null>;
//     updateSession: (session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) => Awaitable<AdapterSession | null | undefined>;
//     deleteSession: (sessionToken: string) => Promise<void> | Awaitable<AdapterSession | null | undefined>;
//     createVerificationToken?: ((verificationToken: VerificationToken) => Awaitable<VerificationToken | null | undefined>) | undefined;
//     useVerificationToken?: ((params: { identifier: string; token: string; }) => Awaitable<VerificationToken | null>) | undefined;

// }

// interface AdapterOptions {
//     // default: 'users'
//     usersTable?: String,
//     // default: 'accounts
//     accountsTable?: String,
//     // default: 'sessions'
//     sessionsTable?: String,
//     // default: 'verification_tokens'
//     verificationTokensTable?: String,
//     // default: true
//     supportOAuth1?: boolean,
//     // default: false
//     supportGitHub?: boolean,
// }

// type AdapterConfig = Required<AdapterOptions>;