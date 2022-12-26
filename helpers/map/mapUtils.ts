import type { Breakpoint } from "helpers/hooks";
import { Map } from "ol";
import { buffer, createEmpty, extend, Extent } from "ol/extent";
import { GeoCoordinates, Position } from "types";

// --- LatLng helpers ---
export function toLatLng(pos: Position): { lng: number; lat: number } {
	return {
		lng: pos[0],
		lat: pos[1],
	};
}

export function fromLatLng(latLng: { lat: number; lng: number }): Position {
	return [latLng.lng, latLng.lat];
}

export function fromLatLngFn(latLng: google.maps.LatLng): Position {
	return [latLng.lng(), latLng.lat()];
}
export function fromLatLngLiteralFn(
	latLng: google.maps.LatLngLiteral
): Position {
	return [latLng.lng, latLng.lat];
}

export type LayerNames =
	| "boulders"
	| "parkings"
	| "sectors"
	| "waypoints"
	| "topos";
export const fitExtentToLayers = (map: Map, lyrsClassName: LayerNames[]) => {
	let ext: Extent = createEmpty();
	for (let className of lyrsClassName) {
		const lyr = map
			.getLayers()
			.getArray()
			.find((l) => l.getClassName().includes(className)) as any;
		if (lyr) {
			ext = extend(ext, lyr.getSource().getExtent());
		}
	}
	console.log("Fitting map to extent:", ext);
	map.getView().fit(buffer(ext, 500), { size: map.getSize(), maxZoom: 18 });
};

// --- markerSize ---
type Size = {
	width: number;
	height: number;
	equals(other: Size): boolean;
};

export const markerSize = (w: number, h?: number): Size => {
	return {
		width: w,
		height: h || w,
		equals: function (other) {
			return (
				other !== null &&
				this.width === other.width &&
				this.height === other.height
			);
		},
	};
};

// --- launchNavigation ---
export const launchNavigation = (
	destination: GeoCoordinates,
	origin: GeoCoordinates | null,
	provider: "apple" | "google",
	device: Breakpoint,
	isIos: boolean
) => {
	const d = toLatLng(destination);

	// We have the user position so we can propose the itinerary
	if (origin) {
		const o = toLatLng(origin);
		if (provider === "apple") {
			// OPEN ON PLAN
			device === "desktop"
				? window.open(
						"https://maps.apple.com/?saddr=" +
							o.lat +
							"," +
							o.lng +
							"&daddr=" +
							d.lat +
							"," +
							d.lng +
							"&dirflg=d"
				  )
				: // TODO : fix Apple plan opening
				  window.open(
						"maps://?saddr=" +
							o.lat +
							"," +
							o.lng +
							"&daddr=" +
							d.lat +
							"," +
							d.lng +
							"&dirflg=d"
				  );
		} else {
			// OPEN ON GOOGLE MAP
			device === "desktop"
				? window.open(
						"https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" +
							d.lat +
							"," +
							d.lng
				  )
				: isIos
				? window.open(
						"https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" +
							d.lat +
							"," +
							d.lng
				  )
				: window.open(
						"https://www.google.com/maps/dir/?api=1&origin=" +
							o.lat +
							"," +
							o.lng +
							"&destination=" +
							d.lat +
							"," +
							d.lng +
							"&travelmode=driving&layer=traffic"
				  );
		}
	} else {
		if (provider === "apple") {
			// OPEN ON PLAN
			device === "desktop"
				? window.open(
						"https://maps.apple.com/?daddr=" + d.lat + "," + d.lng + "&dirflg=d"
				  )
				: // TODO : fix Apple plan opening
				  window.open("maps://?daddr=" + d.lat + "," + d.lng + "&dirflg=d");
		} else {
			// OPEN ON GOOGLE MAP
			device === "desktop"
				? window.open(
						"https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" +
							d.lat +
							"," +
							d.lng
				  )
				: window.open(
						"https://maps.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=" +
							d.lat +
							"," +
							d.lng
				  );
		}
	}
};

export const isOnMap = (e: KeyboardEvent) => {
	const path = e.composedPath && e.composedPath();
	return !!path.find((evt) => {
		const transElt = evt as unknown;
		const elt = transElt as Element;
		return elt.id === "map";
	});
};
