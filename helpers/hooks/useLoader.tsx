import { createContext, useContext } from "react";

export const LoaderContext = createContext((_: boolean) => {});

export const useLoader = () => useContext(LoaderContext);