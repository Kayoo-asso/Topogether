import type { Breakpoint } from "helpers/hooks";
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

// --- googleGetPlace
export const googleGetPlace = async (placeId: string) =>
	new Promise<google.maps.places.PlaceResult | null>((resolve, reject) => {
		if (!placeId) {
			return reject("Need valid place id input");
		}

		// for use in things like GatsbyJS where the html is generated first
		if (typeof window === "undefined") {
			return reject("Need valid window object");
		}

		const placeDetailsRequest: google.maps.places.PlaceDetailsRequest = {
			placeId: placeId,
			fields: ["geometry"],
		};

		try {
			const elt = document.createElement("div");
			new google.maps.places.PlacesService(elt).getDetails(
				placeDetailsRequest,
				resolve
			);
			elt.remove();
		} catch (e) {
			reject(e);
		}
	});

// --- googleAutoComplete

//See: https://atomizedobjects.com/blog/react/how-to-use-google-autocomplete-with-react-hooks/

export const googleAutocomplete = async (text: string) =>
	new Promise(
		(
			resolve: (
				a: google.maps.places.AutocompletePrediction[] | null,
				b: google.maps.places.PlacesServiceStatus
			) => void,
			reject
		) => {
			if (!text) {
				return reject("Need valid text input");
			}
			// for use in things like GatsbyJS where the html is generated first
			if (typeof window === "undefined") {
				return reject("Need valid window object");
			}

			try {
				new google.maps.places.AutocompleteService().getPlacePredictions(
					{
						input: text,
						types: ["(regions)"], //https://developers.google.com/maps/documentation/places/web-service/supported_types#table3
					},
					resolve
				);
			} catch (e) {
				reject(e);
			}
		}
	);

export const isOnMap = (e: KeyboardEvent) => {
	const path = e.composedPath && e.composedPath();
	return !!path.find((evt) => {
		const transElt = evt as unknown;
		const elt = transElt as Element;
		return elt.id === "map";
	});
}