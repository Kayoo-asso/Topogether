import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Trigram from "trigram-search";
import { RoundButton } from "~/components/buttons/RoundButton";
import { SearchInput } from "~/components/forms/SearchInput";
import { useMap } from "~/components/openlayers";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { env } from "~/env.mjs";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { GeoCoordinates, LightTopo } from "~/types";
import { encodeUUID } from "~/utils";

import Flag from "assets/icons/flag.svg";
import MarkerIcon from "assets/icons/marker.svg";
import SearchIcon from "assets/icons/search.svg";

export function TopoSearchbar(props: { topos: LightTopo[] }) {
	const searchOpen = useWorldMapStore((s) => s.searchOpen);
	const toggleSearch = useWorldMapStore((s) => s.toggleSearch);
	const [input, setInput] = useState("");
	const { position } = usePosition();

	// Avoid firing too many requests while user is typing
	const query = useDebounce(input, 300);

	const mapboxQuery = useQuery({
		// I don't think it's worth adding the position into the query key
		queryKey: ["geocode", query],
		queryFn: (ctx) => {
			const query = ctx.queryKey[1];
			// Pass an AbortSignal to cancel requests if the query changes
			return findPlace(query, ctx.signal, {
				types: ["country", "region", "place", "address", "poi"],
				proximity: position || undefined,
				autocomplete: true,
				fuzzyMatch: true,
			});
		},
	});
	const mapboxResults = mapboxQuery.data || [];

	const searcher = useMemo(
		() =>
			new Trigram(props.topos, {
				idField: "id",
				searchField: "name",
				count: 5,
			}),
		[props.topos]
	);
	const topoResults =
		query.length > 0
			? searcher.find(query).map((x) => x.value as LightTopo)
			: [];

	const map = useMap();

	const selectPlace = (place: GeocodingFeature) => {
		map.getView().animate({
			center: place.center,
			duration: 300,
			zoom: 13,
		});
		useWorldMapStore.setState({
			searchOpen: false,
			filtersOpen: false,
		});
	};

	let searchLabel = "Rechercher un lieu";
	if (props.topos.length > 0) {
		searchLabel += " ou un topo";
	}

	return (
		// Vertical flow : (button + input) -> (results)
		<div className="flex w-5/6 flex-col">
			{/* Vertical block 1 */}
			{/* Horizontal flow: button -> input */}
			<div className="flex h-[60px] items-center justify-start">
				{/* Horizontal block 1 */}
				<RoundButton
					className="z-200"
					white={!searchOpen}
					onClick={toggleSearch}
				>
					<SearchIcon
						className={`h-6 w-6 ${searchOpen ? "stroke-white" : "stroke-main"}`}
					/>
				</RoundButton>
				{/* Horizontal block 2 */}
				{searchOpen && (
					<div className="ml-4 flex-1">
						<SearchInput
							value={input}
							onChange={setInput}
							label={searchLabel}
						/>
					</div>
				)}
			</div>

			{/* Vertical block 2 */}
			{searchOpen && (
				<div className="mt-4 rounded-lg bg-white px-10 py-3 shadow">
					<div className="flex flex-col px-4">
						{/* Only show the topo results category if topos were passed in (otherwise this is a place-only search) */}
						{props.topos.length > 0 && (
							<div>
								<div className="ktext-section-title py-4">Liste des topos</div>
								{topoResults.map((topo) => (
									<Link
										key={topo.id}
										className="ktext-base flex flex-row items-center gap-4 px-7 py-3 text-dark hover:bg-grey-light md:cursor-pointer"
										href={"/topo/" + encodeUUID(topo.id)}
									>
										<MarkerIcon className="h-5 w-5 fill-main" />
										<div>{topo.name}</div>
									</Link>
								))}
							</div>
						)}
						<div>
							<div className="ktext-section-title py-4">Lieux</div>
							{mapboxResults.map((res) => (
								<div
									key={res.place_name}
									className="ktext-base flex flex-row items-center gap-4 px-7 py-3 text-dark hover:bg-grey-light md:cursor-pointer"
									onClick={() => selectPlace(res)}
								>
									<Flag className="h-5 w-5 stroke-dark" />
									<div>{res.text}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// Only deals with forward geocoding
type GeocodingTypes =
	| "country"
	| "region"
	| "postcode"
	| "district"
	| "place"
	| "locality"
	| "neighborhood"
	| "address"
	| "poi";

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
export type GeocodingFeature = {
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
	signal: AbortSignal | undefined,
	options?: GeocodingOptions
) {
	query = encodeURIComponent(query);
	const url = new URL(
		`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`
	);
	url.searchParams.set("access_token", env.NEXT_PUBLIC_MAPBOX_TOKEN);
	if (options) {
		for (const key in Object.keys(options)) {
			const val = (options as any)[key];
			url.searchParams.set(key, String(val));
		}
	}

	// Let Tanstack Query do the error handling.
	return fetch(url.toString(), { signal })
		.then((x) => x.json())
		.then((x: GeocodingResponse) => x.features);
}

function useDebounce<T>(value: T, delay: number) {
	// State and setters for debounced value
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(
		() => {
			// Update debounced value after delay
			const handler = setTimeout(() => {
				setDebouncedValue(value);
			}, delay);
			// Cancel the timeout if value changes (also on delay change or unmount)
			// This is how we prevent debounced value from updating if value is changed ...
			// .. within the delay period. Timeout gets cleared and restarted.
			return () => {
				clearTimeout(handler);
			};
		},
		[value, delay] // Only re-call effect if value or delay changes
	);
	return debouncedValue;
}
