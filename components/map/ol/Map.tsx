import { createContext, useContext, useEffect, useState } from "react";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { boundingExtent, getCenter } from "ol/extent";
import { usePosition } from "helpers/hooks";
import { GeoCoordinates } from "types";
import { fromLonLat } from "ol/proj";

import Circle from "ol/geom/Circle";
import Feature from "ol/Feature";
import { Style, Fill } from "ol/style";
import { hexWithAlpha } from "./colors";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import "ol/ol.css";
import { fontainebleauLocation } from "helpers/constants";

const MAPBOX_KEY = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export type MapProps = React.PropsWithChildren<{
	initialCenter?: GeoCoordinates;
	initialZoom?: number;
	initialBounds?: GeoCoordinates[];
}>;

const MapContext = createContext<OLMap | undefined>(undefined);

export function useMap(): OLMap {
	const map = useContext(MapContext);
	if (!map) {
		throw Error("useMap can only be used in children of the Map component");
	}
	return map;
}

export function Map(props: MapProps) {
	const [map, setMap] = useState<OLMap>();
	const { position, accuracy } = usePosition();

	useEffect(() => {
		// TODO: remove
		// const circle = new Circle(fromLonLat(position || [0, 0]), accuracy || 100);
		const circle = new Circle(fromLonLat(fontainebleauLocation), 300 || 100);
		const feature = new Feature({ geometry: circle });
		feature.setStyle(
			new Style({
				fill: new Fill({ color: hexWithAlpha("#4EABFF", 0.3) }),
				zIndex: 2,
			})
		);
		// Actual code
		const center = fromLonLat(props.initialCenter || position || [0, 0]);
		console.log("Initial center:", center)
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
		const m = new OLMap({
			target: "map",
			layers: [
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
				new VectorLayer({
					source: new VectorSource({
						features: [feature],
					}),
				}),
			],
			view,
		});
		console.log("Created map", m)
		setMap(m);

		return () => m.dispose();
	}, []);

	return (
		<div id="map" className="relative h-full w-full">
			<MapContext.Provider value={map}>
				{map && props.children}
			</MapContext.Provider>
		</div>
	);
}
