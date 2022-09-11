import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { boundingExtent, getCenter } from "ol/extent";
import { usePosition } from "helpers/hooks";
import { GeoCoordinates } from "types";
import { fromLonLat } from "ol/proj";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import Layer from "ol/layer/Layer";
import Interaction from "ol/interaction/Interaction";

const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export type MapProps = React.PropsWithChildren<{
	initialCenter?: GeoCoordinates;
	initialZoom?: number;
	initialBounds?: GeoCoordinates[];
}>;

type MapContext = {
	map: OLMap;
	markerSource: VectorSource;
	sectorSource: VectorSource;
};

const MapContext = createContext<OLMap | undefined>(undefined);

export function useMap(): OLMap {
	const context = useContext(MapContext);
	if (!context) {
		throw Error("useMap can only be used in children of the Map component");
	}
	return context;
}

// We only use vector layers AFAIK
// We also don't care about cleanup
export function useLayer(key: string): VectorLayer<VectorSource> {
	const map = useMap();
	const layer = useMemo(() => {
		const allLayers = map.getLayers();
		let l: VectorLayer<VectorSource> | undefined = allLayers.get(key);
		if (!l) {
			const source = new VectorSource({ features: [] });
			l = new VectorLayer({ source });
			console.log("Created layer with source:", l.getSource());
			map.addLayer(l);
			allLayers.set(key, l);
		}
		return l;
	}, [map, key]);
	return layer;
}

export function useSource(key: string) {
	console.log("Getting source for " + key);
	return useLayer(key).getSource()!;
}

export function Map(props: MapProps) {
	const [map, setMap] = useState<OLMap>();

	const { position, accuracy } = usePosition();

	useEffect(() => {
		const center = fromLonLat(props.initialCenter || position || [0, 0]);
		console.log("Initial center:", center);
		const view = new View({
			center,
			zoom: props.initialZoom || 12,
		});
		if (props.initialBounds) {
			const bounds = props.initialBounds.map((coords) => fromLonLat(coords));
			const extent = boundingExtent(bounds);
			view.fit(extent);
			view.setCenter(getCenter(extent));
		}
		const map = new OLMap({
			target: "map",
			layers: [
				// The layers are rendered in the order shown here
				new TileLayer({
					source: new XYZ({
						attributions: [],
						url:
							"https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}@2x?access_token=" +
							MAPBOX_KEY,
						tileSize: [512, 512],
						tilePixelRatio: 2, // THIS IS IMPORTANT
					}),
				}),
			],
			view,
		});
		setMap(map);

		return () => map.dispose();
	}, []);

	return (
		<div id="map" className="relative h-full w-full">
			<MapContext.Provider value={map}>
				{map && props.children}
			</MapContext.Provider>
		</div>
	);
}
