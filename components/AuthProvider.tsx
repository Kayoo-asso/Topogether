import { User} from "types";
import React, { useEffect, useMemo } from "react";
import { AuthContext, AuthService, supabaseClient } from "helpers/services";
import { loginFakeAdmin } from "helpers/fakeData/loginFakeAdmin";
import { seedLocalDb } from "helpers/fakeData/seedLocalDb";

type AuthProviderProps = React.PropsWithChildren<{
    initial: User | null
}>;

export const AuthProvider: React.FC<AuthProviderProps> = ({ initial, children }) => {
    const auth = useMemo(() => new AuthService(supabaseClient, initial), []);

    if (process.env.NODE_ENV === "development") {
        useEffect(() => {
            if (typeof window !== "undefined") {
                loginFakeAdmin(auth).then(() => seedLocalDb(auth))
            }
        }, []);
    }

    return <AuthContext.Provider value={auth}>
        {children}
    </AuthContext.Provider>
}