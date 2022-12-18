import Map from "ol/Map";
import Layer from "ol/layer/Layer";
import { useEffect, useMemo, useState } from "react";
import BaseLayer from "ol/layer/Base";
import { group } from "console";
import Source from "ol/source/Source";

type TitleCase<S extends string> = S extends `${infer Char}${infer Rest}`
	? `${Uppercase<Char>}${Rest}`
	: S;

type SetMethodTitleCase<S extends string> = `set${TitleCase<S>}`;

type EventTitleCase<S extends string> =
	S extends `${infer Base}:${infer Suffix}`
		? `on${TitleCase<Base>}${TitleCase<Suffix>}`
		: `on${TitleCase<S>}`;

export const eventMap = {
	"change:error": "changeError",
};

export function titleCase<S extends string>(s: S): TitleCase<S> {
	return (s.charAt(0).toLocaleUpperCase() + s.substring(1)) as any;
}

export function setMethodName<S extends string>(
	property: S
): SetMethodTitleCase<S> {
	return `set${titleCase(property)}`;
}

export function eventPropName<S extends string>(
	eventName: S
): EventTitleCase<S> {
	const parts = eventName.split(":");
	let result = "on" + setMethodName(parts[0]);
	if (parts.length > 1) {
		result += setMethodName(parts[1]);
	}
	return result as any;
}

export function useGetLayers(map: Map | undefined, ids: Array<string | undefined>) {
	// TODO: likely should migrate to useSyncWithExternalStore
	const [symbol, setSymbol] = useState(Symbol());
	// The array can contain undefineds because we really want it to be the same length as the `ids` array
	const layers: Array<Layer | undefined> = useMemo(() => {
		const list = []
		// console.log("Getting layers:", ids)
		if (map) {
			const collection = map.getLayers();
			for (const id of ids) {
				if(id) {
					const item = collection.get(id);
					list.push(item);
				} else {
					list.push(undefined);
				}
			}
		}
		return list;
	}, [map, symbol]);

	useEffect(() => {
		if (map) {
			const rerender = () => setSymbol(Symbol());
			const group = map.getLayerGroup();
			const collection = group.getLayers();
			map.on("change:layergroup", rerender);
			group.on("change:layers", rerender);
			collection.on("propertychange", rerender);
			return () => {
				map.un("change:layergroup", rerender);
				group.un("change:layers", rerender);
				collection.un("propertychange", rerender);
			};
		}
	}, [map]);
	return layers;
}

export function useGetSources(map: Map | undefined, ids: Array<string | undefined>, filterNulls: true) : Array<Source>
export function useGetSources(map: Map | undefined, ids: Array<string | undefined>, filterNulls?: false): Array<Source | undefined>

export function useGetSources(map: Map | undefined, ids: Array<string | undefined>, filterNulls: boolean = false) {
	// TODO: likely should migrate to useSyncWithExternalStore
	// TODO: remove duplication with Symbol state inside useGetLayers
	const [, setSymbol] = useState(Symbol());
	const layers = useGetLayers(map, ids);
	const sources: Array<Source | undefined> = useMemo(() => {
		const list = [];
		for (const l of layers) {
			const s = l?.getSource();
			// nulls are problematic for our use later on
			if(s || !filterNulls) {
				list.push(s || undefined);
			}
		}
		return list;
	}, [layers]);
	useEffect(() => {
		const rerender = () => setSymbol(Symbol());
		for (const l of layers) {
			l?.on("change:source", rerender);
		}
		return () => {
			for (const l of layers) {
				l?.un("change:source", rerender);
			}
		};
	}, [layers]);

	return sources;
}