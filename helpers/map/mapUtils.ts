import { Breakpoint } from "helpers/hooks/DeviceProvider";
import { GeoCoordinates } from "types";

// --- launchNavigation ---
export const launchNavigation = (
	destination: GeoCoordinates,
	origin: GeoCoordinates | null,
	provider: "apple" | "google",
	device: Breakpoint,
	isIos: boolean
) => {
	const d = {
		lng: destination[0],
		lat: destination[1]
	};

	// We have the user position so we can propose the itinerary
	if (origin) {
		const o = {
			lng: origin[0],
			lat: origin[1],
		};
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
		const elt = evt as unknown as Element;
		return elt.id === "map";
	});
};
