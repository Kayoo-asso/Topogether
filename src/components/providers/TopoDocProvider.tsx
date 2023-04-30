import { createContext, useContext } from "react";
import { TopoDoc } from "~/types";

const context = createContext<TopoDoc | undefined>(undefined);

export function useTopoDoc() {
	const doc = useContext(context);
	if (doc === undefined) {
		throw new Error("useTopoDoc used outside TopoDocProvider");
	}
	return doc;
}

export function TopoDocProvider({
	doc,
	children,
}: React.PropsWithChildren<{ doc: TopoDoc }>) {
	return <context.Provider value={doc}>{children}</context.Provider>;
}
