import React from "react";
import type { Session } from "types";

export const SessionContext = React.createContext<Session | null>(null);