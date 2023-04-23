import { TileLayer, View, XYZ } from "~/components/openlayers";
import { Map, Props } from "~/components/openlayers/Map";
import { GeoCoordinates } from "types";
import { env } from "~/env.mjs";
import { useCallback, useState } from "react";
import Image from "next/image";
import { fontainebleauLocation } from "~/constants";
import BgSatellite from "assets/bg_satellite.jpg";
import BgNonSatellite from "assets/bg_non-satellite.jpg";
import { useGeographic } from "ol/proj";
import { MapBrowserEvent } from "ol";
import { Attribution } from "ol/control";

// Use geographic coordinates everywhere
useGeographic();

type BaseMapProps = {
	initialCenter?: GeoCoordinates | null;
	initialZoom?: number;
	minZoom?: number;
	onBackgroundClick?: () => void;
};

const token = env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";

// The default controls except the zoom +/- buttons and the rotate button
const controls = typeof window === "undefined" ? [] : [new Attribution()];

export function BaseMap({
	initialZoom = 8,
	initialCenter,
	minZoom,
	onBackgroundClick,
	children,
}: React.PropsWithChildren<BaseMapProps>) {
	const [satelliteView, setSatelliteView] = useState(false);

	// We don't want to recenter the View after initial load, so we need to never change
	// its `center` prop
	const [center, setCenter] = useState(initialCenter || fontainebleauLocation);
	if (!center && initialCenter) {
		setCenter(initialCenter);
	}

	return (
		<Map
			className="relative h-full w-full"
			controls={controls}
			// Hacky but effective way of detecting when the user clicked outside any marker
			onClick={useCallback(
				(e: MapBrowserEvent<MouseEvent>) => {
					const map = e.map;
					const hit = map.getFeaturesAtPixel(e.pixel).length > 0;
					if (!hit && onBackgroundClick) {
						onBackgroundClick();
					}
				},
				[onBackgroundClick]
			)}
		>
			{/* Top right */}
			<div className="absolute right-0 top-0 m-3">
				{/* Satellite button */}
				<button
					className="relative z-20 h-[60px] w-[60px] overflow-hidden rounded-full shadow"
					onClick={() => setSatelliteView((b) => !b)}
				>
					<Image
						src={satelliteView ? BgNonSatellite : BgSatellite}
						fill
						// Recommended to use with `fill` for performance
						sizes="60px"
						priority
						alt={
							"Bouton pour " +
							(satelliteView ? "désactiver" : "activer") +
							" la vue satellite"
						}
					/>
				</button>
			</div>
			<View
				center={center}
				zoom={initialZoom}
				minZoom={minZoom}
				enableRotation={false}
			/>
			<TileLayer>
				<XYZ
					attributions={attributions}
					url={
						satelliteView
							? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
							: `https://api.mapbox.com/styles/v1/erwinkn/clbs8clin005514qrc9iueujg/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
					}
					// IMPORTANT
					tilePixelRatio={2}
					tileSize={512}
				/>
			</TileLayer>
			{children}
		</Map>
	);
}
