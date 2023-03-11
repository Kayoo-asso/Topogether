import { createContext, useContext } from "react";
import { TopoTypes } from "types";

export const TopoTypeContext = createContext<TopoTypes>(0);

export const useTopoType: () => TopoTypes = () => {
    return useContext(TopoTypeContext);
}

interface TopoTypeProviderProps {
    value: TopoTypes,
}

export const TopoTypeProvider = ({
    value,
    children,
}: React.PropsWithChildren<TopoTypeProviderProps>) => {
    return (
        <TopoTypeContext.Provider value={value}>
            {children}
        </TopoTypeContext.Provider>
    )
}