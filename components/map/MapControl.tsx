import React, { useCallback, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { RoundButton, SatelliteButton } from "components";
import { ImageInput } from "components/molecules";
import {
	BoulderFilterOptions,
	BoulderFilters,
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
	MapProps,
	Position,
	Topo,
} from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { fontainebleauLocation } from "helpers/constants";
import { googleGetPlace, toLatLng } from "helpers/map";
import { setReactRef } from "helpers/utils";
import { useBreakpoint, usePosition } from "helpers/hooks";

import SectorIcon from "assets/icons/sector.svg";
import CenterIcon from "assets/icons/center.svg";
import { useSelectStore } from "components/pages/selectStore";
import { handleNewPhoto } from "helpers/handleNewPhoto";
import { useSession } from "helpers/services";
import { MapToolSelector } from "./MapToolSelector";

type MapControlProps = React.PropsWithChildren<
	Omit<MapProps, "center" | "zoom"> & {
		className?: string;
		initialCenter?: Position;
		initialZoom?: number;
		displaySatelliteButton?: boolean;
		displayUserMarker?: boolean;
		displayToolSelector?: boolean;
		onPhotoButtonClick?: () => void;
		displaySectorButton?: boolean;
		onSectorButtonClick?: () => void;
		displaySearchbar?: boolean;
		searchbarOptions?: MapSearchbarProps;
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
			displayToolSelector = false,
			displaySectorButton = false,
			...props
		},
		parentRef
	) => {
		const session = useSession();
		const breakpoint = useBreakpoint();
		const mapRef = useRef<google.maps.Map>(null);
		const { position } = usePosition();
		const selectedItem = useSelectStore(s => s.item);
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);
		const tool = useSelectStore(s => s.tool);

		const [mapToolSelectorOpen, setMapToolSelectorOpen] = useState(breakpoint === 'desktop');

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

		const getMapCursor = useCallback(() => {
			switch (tool) {
				case 'ROCK': return "url(/assets/icons/colored/_rock.svg) 16 32, auto";
				case 'SECTOR': return "url(/assets/icons/colored/line-point/_line-point-grey.svg), auto";
				case 'PARKING': return "url(/assets/icons/colored/_parking.svg) 16 30, auto";
				case 'WAYPOINT': return "url(/assets/icons/colored/_help-round.svg) 16 30, auto";
				default: return undefined;
			}
		}, [tool]);

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
									onBoulderResultSelect={useCallback((boulder: Boulder) => {
										const bQuark = props.topo!().boulders.findQuark((b) => b.id === boulder.id)!;
										select.boulder(bQuark);
										mapRef.current?.setCenter(toLatLng(boulder.location));
									}, [props.topo])}
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
						<div className="absolute bottom-0 my-3 flex w-full justify-center z-100">
							{displayToolSelector && (
								<div className="flex flex-row gap-5 w-full justify-center">
									<MapToolSelector
										open={mapToolSelectorOpen}
										setOpen={setMapToolSelectorOpen}
									/>
									{!mapToolSelectorOpen &&
										<ImageInput
											button="builder"
											size="big"
											multiple={false}
											activated={
												!!position || process.env.NODE_ENV === "development"
											}
											onChange={(files) => {
												position && session && props.topo && handleNewPhoto(props.topo, files[0], position, session, select, selectedItem, tool)
											}}
										/>
									}
								</div>
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
						{...props}
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
						draggableCursor={getMapCursor()}
						onClick={(e) => {
							if (selectedItem.type === 'sector') flush.item();
							if (props.onClick) props.onClick(e);
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
