import MapObject, { MapOptions } from "ol/Map";
import { createContext, useContext, useEffect, useState } from "react";
import { useView } from "./View";

interface MapProps
	extends React.PropsWithChildren<
		Omit<
			MapOptions,
			"view" | "layers" | "interactions" | "controls" | "target" | "view"
		>
	> {
	id?: string;
}

const MapContext = createContext<MapObject | null>(null);

export function useMap(): MapObject {
	const map = useContext(MapContext);
	if (!map) {
		throw new Error(
			"useMap should only be used in children of a <Map> component"
		);
	}
	return map;
}

export function Map({ children, id = "map", ...options }: MapProps) {
	const view = useView();
	const [map, setMap] = useState<MapObject>();

	const o = { ...options, view };

	useEffect(() => {
		const m = new MapObject(o);
		setMap(m);
		return () => m.dispose();
	}, []);

	useEffect(() => {
		map?.setView(view);
	}, [view]);

	const inside = map ? (
		<MapContext.Provider value={map}>{children}</MapContext.Provider>
	) : null;

	return <div id={id}>{inside}</div>;
}
