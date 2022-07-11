import React, { useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { RoundButton, SatelliteButton } from "components";
import {
	BoulderFilterOptions,
	BoulderFilters,
	ItemSelectorMobile,
	Map,
	MapSearchbar,
	MapSearchbarProps,
	TopoFilterOptions,
	TopoFilters,
	UserMarker,
} from "./";
import {
	Boulder,
	GeoCoordinates,
	Image,
	MapProps,
	MapToolEnum,
	Position,
	Topo,
} from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { fontainebleauLocation } from "helpers/constants";
import { googleGetPlace, toLatLng } from "helpers/map";
import { setReactRef } from "helpers/utils";
import { usePosition } from "helpers/hooks";

import SectorIcon from "assets/icons/sector.svg";
import CenterIcon from "assets/icons/center.svg";

type MapControlProps = React.PropsWithChildren<
	Omit<MapProps, "center" | "zoom"> & {
		className?: string;
		initialCenter?: Position;
		initialZoom?: number;
		displaySatelliteButton?: boolean;
		displayUserMarker?: boolean;
		currentTool?: MapToolEnum;
		onToolSelect?: (tool: MapToolEnum) => void;
		onNewPhoto?: (img: Image, coords: GeoCoordinates) => void;
		onPhotoButtonClick?: () => void;
		displaySectorButton?: boolean;
		onSectorButtonClick?: () => void;
		displaySearchbar?: boolean;
		searchbarOptions?: MapSearchbarProps;
		onBoulderResultSelect?: (boulder: Boulder) => void;
		topo?: Quark<Topo>;
		topoFilters?: Quark<TopoFilterOptions>;
		topoFiltersDomain?: TopoFilterOptions;
		boulderFilters?: Quark<BoulderFilterOptions>;
		boulderFiltersDomain?: BoulderFilterOptions;
		boundsTo?: GeoCoordinates[];
		onUserMarkerClick?: (pos: google.maps.MapMouseEvent) => void;
		onMapZoomChange?: (zoom: number | undefined) => void;
	}
>;

export const MapControl = watchDependencies<google.maps.Map, MapControlProps>(
	(
		{
			initialZoom = 8,
			displaySearchbar = true,
			displaySatelliteButton = true,
			displayUserMarker = true,
			displaySectorButton = false,
			...props
		},
		parentRef
	) => {
		const mapRef = useRef<google.maps.Map>(null);
		const { position } = usePosition();

		const [satelliteView, setSatelliteView] = useState(false);
		const getBoundsFromSearchbar = (
			geometry: google.maps.places.PlaceGeometry
		) => {
			if (mapRef.current) {
				const newBounds = new google.maps.LatLngBounds();
				if (geometry.viewport) newBounds.union(geometry.viewport);
				else if (geometry.location) newBounds.extend(geometry.location);
				else return;
				mapRef.current.fitBounds(newBounds);
			}
		};

		return (
			<div className="relative h-full w-full">
				<Wrapper
					apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
					libraries={["places"]}
				>
					<div className="absolute h-full w-full">
						{/* Top left */}
						<div className="absolute left-0 top-0 m-3 w-full space-y-5">
							{displaySearchbar && (
								<MapSearchbar
									boulders={
										props.topo ? props.topo().boulders.toArray() : undefined
									}
									onGoogleResultSelect={async (res) => {
										const placeDetails = await googleGetPlace(res.place_id);
										if (placeDetails?.geometry)
											getBoundsFromSearchbar(placeDetails.geometry);
									}}
									onBoulderResultSelect={props.onBoulderResultSelect}
									{...props.searchbarOptions}
								/>
							)}
							{props.topoFilters && props.topoFiltersDomain && (
								<TopoFilters
									domain={props.topoFiltersDomain}
									values={props.topoFilters()}
									onChange={props.topoFilters.set}
								/>
							)}
							{props.boulderFilters && props.boulderFiltersDomain && (
								<BoulderFilters
									domain={props.boulderFiltersDomain}
									values={props.boulderFilters()}
									onChange={props.boulderFilters.set}
								/>
							)}
						</div>
						{/* Top right */}
						<div className="absolute right-0 top-0 m-3">
							{displaySatelliteButton && (
								<SatelliteButton
									onClick={(displaySatellite) =>
										setSatelliteView(displaySatellite)
									}
								/>
							)}
						</div>

						{/* Bottom left */}
						<div className="absolute bottom-0 left-0 m-3">
							{displaySectorButton && (
								<RoundButton
									className="z-10 md:hidden"
									onClick={props.onSectorButtonClick}
								>
									<SectorIcon className="h-7 w-7 fill-main stroke-main" />
								</RoundButton>
							)}
						</div>

						{/* Bottom center */}
						<div className="absolute bottom-0 my-3 flex w-full justify-center">
							{props.onNewPhoto && props.onToolSelect && (
								<ItemSelectorMobile
									currentTool={props.currentTool}
									photoActivated={!!position}
									onToolSelect={props.onToolSelect}
									onNewPhoto={(img) =>
										position && props.onNewPhoto!(img, position)
									}
								/>
							)}
						</div>
						{/* Bottom right */}
						<div className="absolute right-0 bottom-0 m-3">
							{displayUserMarker && (
								<RoundButton
									onClick={() => {
										if (position) {
											mapRef.current?.panTo(toLatLng(position));
										}
									}}
								>
									<CenterIcon className="h-7 w-7 fill-main stroke-main" />
								</RoundButton>
							)}
						</div>
					</div>

					<Map
						ref={(ref) => {
							setReactRef(mapRef, ref);
							setReactRef(parentRef, ref);
						}}
						mapTypeId={satelliteView ? "satellite" : "roadmap"}
						className={props.className ? props.className : ""}
						onZoomChange={() => {
							if (mapRef.current && props.onMapZoomChange) {
								props.onMapZoomChange(mapRef.current.getZoom());
							}
						}}
						onLoad={(map) => {
							map.setZoom(initialZoom);
							const locs = props.boundsTo;
							const initialCenter = props.initialCenter || position;
							if (initialCenter) {
								map.setCenter(toLatLng(initialCenter));
							} else if (locs && locs.length > 1) {
								const bounds = new google.maps.LatLngBounds();
								for (const loc of locs) {
									bounds.extend(toLatLng(loc));
								}
								map.fitBounds(bounds);
							} else {
								map.setCenter(toLatLng(fontainebleauLocation));
							}
						}}
						{...props}
					>
						{props.children}

						{displayUserMarker && (
							<UserMarker onClick={props.onUserMarkerClick} />
						)}
					</Map>
				</Wrapper>
			</div>
		);
	}
);
