import { SessionContext } from "helpers";
import { useContext } from "react";
import { Session } from "types";

export function useSession(): Session | null {
    const session = useContext(SessionContext);
    if (session === undefined) {
        throw new Error("useSession can ony be used inside a SessionContext provider"); 
    }
    return session;
}