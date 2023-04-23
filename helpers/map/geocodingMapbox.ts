import { GeoCoordinates, GeomCoordinates, GeometryType } from "types";

// Only deals with forward geocoding
type GeocodingTypes = "country" | "region" | "postcode" | "district" | "place" | "locality" | "neighborhood" | "address" | "poi";

export type GeocodingOptions = {
	// those have full coverage on Mapbox
	types?: GeocodingTypes[];
	language?: "en" | "fr" | "de" | "it" | "nl";
	limit?: 5 | 6 | 7 | 8 | 9 | 10;
	proximity?: GeoCoordinates;
	fuzzyMatch?: boolean;
	autocomplete?: boolean;
};

type GeocodingResponse = {
	type: "FeatureCollection";
	query: string[];
	features: GeocodingFeature[];
	attribution: string;
};

// Not including all the returned fields, only those of interest to us
// Full documentation: https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object=a
type GeocodingFeature = {
	// From 0 to 1
	relevance: number;
	// Name of the place, without hierarchical information, in the requested language.
	text: string;
	// Full name
	place_name: string;
	center: GeoCoordinates;
};

async function findPlace(
	query: string,
	options?: GeocodingOptions
): Promise<GeocodingFeature[] | null> {
	query = encodeURIComponent(query);
	const url = new URL(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`
	);
	url.searchParams.set("access_token", process.env.NEXT_PUBLIC_MAPBOX_TOKEN!);
	if (options) {
		for (const key in Object.keys(options)) {
			const val = (options as any)[key];
			url.searchParams.set(key, String(val));
		}
	}
	try {
		const res = await fetch(url.toString());
		if (!res.ok) {
			console.error(`Error geocoding "${query}":`, await res.text());
			return null;
		}
		const body = (await res.json()) as GeocodingResponse;
		// console.log("Received response:", body);
		return body.features;
	} catch (e) {
		console.error(`Error geocoding "${query}":`, e);
		return null;
	}
}
