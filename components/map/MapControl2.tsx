import React, { useCallback, useEffect, useRef, useState } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import {
	Map as BaseMap,
	VectorLayer,
	VectorSource,
	View,
	MapboxVector,
	TileLayer,
	XYZ,
} from "components/openlayers";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";

import { RoundButton, SatelliteButton } from "components";
import { ImageInput } from "components/molecules";
import {
	BoulderFilterOptions,
	BoulderFilters,
	MapSearchbar,
	MapSearchbarProps,
	TopoFilterOptions,
	TopoFilters,
	UserMarker,
} from "./";
import { Boulder, GeoCoordinates, MapProps, Position, Topo } from "types";
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
import { MapBrowserEvent, MapEvent } from "ol";
import { Props } from "components/openlayers/Map";

type MapControlProps = React.PropsWithChildren<
	Props & {
		className?: string;
		initialCenter: Position;
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

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";
const attributionsSatellite =
	"Powered by Esri. " +
	"Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community";

export const MapControl2 = watchDependencies<Map, MapControlProps>(
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
		const mapRef = useRef<Map>(null);
		const { position } = usePosition();
		const selectedItem = useSelectStore((s) => s.item);
		const select = useSelectStore((s) => s.select);
		const flush = useSelectStore((s) => s.flush);
		const tool = useSelectStore((s) => s.tool);

		const [mapToolSelectorOpen, setMapToolSelectorOpen] = useState(
			breakpoint === "desktop"
		);

		const [satelliteView, setSatelliteView] = useState(false);
		const getBoundsFromSearchbar = (
			geometry: google.maps.places.PlaceGeometry
		) => {
			if (mapRef.current) {
				const newBounds = new google.maps.LatLngBounds();
				if (geometry.viewport) newBounds.union(geometry.viewport);
				else if (geometry.location) newBounds.extend(geometry.location);
				else return;
				// TODO: change the way bounds are fitted.
				// mapRef.current.fitBounds(newBounds);
			}
		};

		const getMapCursorClass = useCallback(() => {
			switch (tool) {
				case "ROCK":
					return "cursor-[url(/assets/icons/colored/_rock.svg),_pointer]";
				case "SECTOR":
					return "cursor-[url(/assets/icons/colored/line-point/_line-point-grey),_pointer]";
				case "PARKING":
					return "cursor-[url(/assets/icons/colored/_parking.svg),_pointer]";
				case "WAYPOINT":
					return "cursor-[url(/assets/icons/colored/_help-round.svg),_pointer]";
				default:
					return "";
			}
		}, [tool]);
		//If a tool is selected, display the corresponding cursor. If not, display pointer on features.
		const determinePointer = useCallback((e) => {
			if (tool || !mapRef.current) return;
			const map = mapRef.current;
			const hit = map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {
				return true;
			}); 
			if (hit) {
				map.getTargetElement().style.cursor = 'pointer';
			} else {
				map.getTargetElement().style.cursor = '';
			}
		}, [mapRef.current, tool]);
		useEffect(() => {
			mapRef.current?.addEventListener('pointermove', determinePointer);
			return () => mapRef.current?.removeEventListener('pointermove', determinePointer);
		}, [mapRef.current, tool]);
		
		return (
			<div className="relative h-full w-full">
				<div className="absolute h-full w-full">
					{/* Top left */}
					<div className="absolute left-0 top-0 m-3 w-full space-y-5">
						{displaySearchbar && (
							<MapSearchbar
								boulders={
									props.topo ? props.topo().boulders.toArray() : undefined
								}
								//TODO: change this function to use MapBox GeoCoding
								// onGoogleResultSelect={async (res) => {
								// 	const placeDetails = await googleGetPlace(res.place_id);
								// 	if (placeDetails?.geometry)
								// 		getBoundsFromSearchbar(placeDetails.geometry);
								// }}
								onBoulderResultSelect={useCallback(
									(boulder: Boulder) => {
										const bQuark = props.topo!().boulders.findQuark(
											(b) => b.id === boulder.id
										)!;
										select.boulder(bQuark);
										mapRef.current
											?.getView()
											.setCenter(fromLonLat(boulder.location));
									},
									[props.topo]
								)}
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
					<div className={"absolute bottom-0 left-0 m-3" + (breakpoint === "desktop" ? " z-100" : "")}>
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
					<div
						className={
							(mapToolSelectorOpen ? "z-100" : "z-1") +
							" absolute bottom-0 my-3 flex w-full justify-center"
						}
					>
						{displayToolSelector && (
							<div className="flex w-full flex-row justify-center gap-5">
								<MapToolSelector
									open={mapToolSelectorOpen}
									setOpen={setMapToolSelectorOpen}
								/>
								{!mapToolSelectorOpen && (
									<ImageInput
										button="builder"
										size="big"
										multiple={false}
										activated={
											!!position || process.env.NODE_ENV === "development"
										}
										onChange={(files) => {
											position &&
												session &&
												props.topo &&
												handleNewPhoto(
													props.topo,
													files[0],
													position,
													session,
													select,
													selectedItem,
													tool
												);
										}}
									/>
								)}
							</div>
						)}
					</div>

					{/* Bottom right */}
					<div className={"absolute right-0 bottom-0 m-3" + (breakpoint === "desktop" ? " z-100" : "")}>
						{displayUserMarker && position && (
							<RoundButton
								onClick={() => {
									if (position) {
										mapRef.current?.getView().setCenter(fromLonLat(position));
									}
								}}
							>
								<CenterIcon className="h-7 w-7 fill-main stroke-main" />
							</RoundButton>
						)}
					</div>
				</div>

				<BaseMap
					ref={(ref) => {
						setReactRef(mapRef, ref);
						setReactRef(parentRef, ref);
					}}
					className={"h-full w-full " + getMapCursorClass()}
					onClick={(e) => {
						if (selectedItem.type === "sector") flush.item();
						if (props.onClick) props.onClick(e);
					}}
					onLoadEnd={(e) => {
						const map = e.map;
						// const bbox = [1, 1, 1, 1];
						// map.getView().fit(bbox, { size: map.getSize() });
					}}
				>
					<View center={fromLonLat(props.initialCenter)} zoom={initialZoom} />

					{/* <MapboxVector
				<View center={fromLonLat(props.initialCenter)} zoom={initialZoom}>
					<BaseMap 
						ref={(ref) => {
							setReactRef(mapRef, ref);
							setReactRef(parentRef, ref);
						}}
						className={"w-full h-full "+getMapCursorClass()}
						onClick={(e) => {
							if (selectedItem.type === 'sector') flush.item();
							if (props.onClick) props.onClick(e);
						}}
						onChangeResolution={(e) => {
							if (mapRef.current && props.onMapZoomChange) {
								// props.onMapZoomChange(mapRef.current.getZoom());
							}
						}}
						onMoveEnd={(e) => {
							console.log(e);
						}}
						onLoadEnd={(e: MapEvent) => {
							const map = e.map;
						}}
					>
						{/* <MapboxVector
							styleUrl="mapbox://styles/mapbox/outdoors-v11"
							accessToken={MAPBOX_TOKEN}
						/> */}
					<TileLayer>
						<XYZ
							// TODO: fix satelliteView that does not work yet
							attributions={
								satelliteView ? attributionsSatellite : attributions
							}
							url={
								satelliteView
									? "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}"
									: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
							}
							// IMPORTANT
							tilePixelRatio={2}
							tileSize={512}
						/>
					</TileLayer>

					{props.children}
				</BaseMap>
			</div>
		);
	}
);
