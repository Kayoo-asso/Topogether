import { Session } from "types";
import React, { useEffect, useState } from "react";
import { effect } from "helpers/quarky";
import { auth } from "helpers/services";
import { SessionContext } from "helpers/context";

export type SessionProviderProps = React.PropsWithChildren<{
    value: Session | null
}>;

export const SessionProvider: React.FC<SessionProviderProps> = ({ value, children }) => {
    // WIP: `value || auth.session()` is a bad hack, to ensure client-side auth changes are reflected
    // on the next navigation, even before cookies come into play
    const [session, setSession] = useState(value || auth.session());

    useEffect(() => {
        // lazy effect, to avoid a state update immediately on-mount
        const e = effect([auth.session], ([session]) => {
            setSession(session);
        }, { lazy: true });
        return e.dispose;
    }, []);

    return <SessionContext.Provider value={session}>
        {children}
    </SessionContext.Provider>
}