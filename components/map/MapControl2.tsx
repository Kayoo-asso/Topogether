import React, { useCallback, useEffect, useState } from "react";
import { Map as BaseMap, View, TileLayer, XYZ } from "components/openlayers";
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
} from "./";
import { Boulder, GeoCoordinates, Position, Topo } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { fontainebleauLocation } from "helpers/constants";
import { setReactRef } from "helpers/utils";
import { useBreakpoint, usePosition } from "helpers/hooks";

import SectorIcon from "assets/icons/sector.svg";
import CenterIcon from "assets/icons/center.svg";
import { useSelectStore } from "components/pages/selectStore";
import { handleNewPhoto } from "helpers/handleNewPhoto";
import { useSession } from "helpers/services";
import { MapToolSelector } from "./MapToolSelector";
import { Props } from "components/openlayers/Map";
import { UserMarkerLayer } from "./markers/UserMarkerLayer";
import { XYZ as XYZObject } from "ol/source";
import { MapBrowserEvent } from "ol";
import { DEFAULT_EXTENT_BUFFER, getTopoExtent } from "helpers/map/getTopoExtent";
import { getMapCursorClass } from "helpers/map/getMapCursorClass";

type MapControlProps = React.PropsWithChildren<
	Props & {
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
		onUserMarkerClick?: (pos: GeoCoordinates | null) => void;
		onMapZoomChange?: (zoom: number | undefined) => void;
	}
>;

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";

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
		const [map, setMap] = useState<Map | null>(null);
		const [xyz, setXYZ] = useState<XYZObject | null>(null);
		const { position } = usePosition();
		const selectedItem = useSelectStore((s) => s.item);
		const select = useSelectStore((s) => s.select);
		const flush = useSelectStore((s) => s.flush);
		const tool = useSelectStore((s) => s.tool);

		const [mapToolSelectorOpen, setMapToolSelectorOpen] = useState(
			breakpoint === "desktop"
		);
		const [satelliteView, setSatelliteView] = useState(false);
		useEffect(() => {
			if (xyz) {
				xyz.setUrl(
					satelliteView
						? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
						: `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
				);
				xyz.setAttributions(attributions);
			}
		}, [satelliteView, xyz]);

		//If a tool is selected, display the corresponding cursor. If not, display pointer on features.
		useEffect(() => {
			const determinePointer = (e: MapBrowserEvent<PointerEvent>) => {
				console.log("1")
				if (tool || !map) return;
				const hit = map.getFeaturesAtPixel(e.pixel).length > 0;
				if (hit) {
					map.getTargetElement().style.cursor = "pointer";
				} else {
					map.getTargetElement().style.cursor = "";
				}
			};
			map?.on("pointermove", determinePointer);
			return () => map?.un("pointermove", determinePointer);
		}, [map, tool]);

		// Initial extension / bounding
		useEffect(() => {
			if (map && props.topo) {
				const extent = getTopoExtent(props.topo(), DEFAULT_EXTENT_BUFFER);
				map.getView().fit(extent, {
					size: map.getSize(),
					maxZoom: 18,
				});
			}
		}, [map, props.topo]);

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
								onMapboxResultSelect={(place) => {
									map?.getView().setCenter(fromLonLat(place.center));
								}}
								onBoulderResultSelect={useCallback(
									(boulder: Boulder) => {
										const bQuark = props.topo!().boulders.findQuark(
											(b) => b.id === boulder.id
										)!;
										select.boulder(bQuark);
										map?.getView().setCenter(fromLonLat(boulder.location));
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
							<SatelliteButton onClick={setSatelliteView} />
						)}
					</div>

					{/* Bottom left */}
					<div
						className={
							"absolute bottom-0 left-0 m-3" +
							(breakpoint === "desktop" ? " z-100" : "")
						}
					>
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
					<div
						className={
							"absolute right-0 bottom-0 m-3" +
							(breakpoint === "desktop" ? " z-100" : "")
						}
					>
						{displayUserMarker && position && (
							<RoundButton
								onClick={() => {
									if (position) {
										map?.getView().setCenter(fromLonLat(position));
									}
								}}
							>
								<CenterIcon className="h-7 w-7 fill-main stroke-main" />
							</RoundButton>
						)}
					</div>
				</div>

				<BaseMap
					ref={useCallback((ref) => {
						setMap(map);
						setReactRef(parentRef, ref);
					}, [])}
					className={"h-full w-full " + getMapCursorClass(tool)}
					onClick={(e) => {
						const map = e.map;
						const hit = map.getFeaturesAtPixel(e.pixel).length > 0;
						if (!hit) {
							flush.item();
							if (props.onClick) props.onClick(e);
						}
					}}
					// controls={[]}
				>
					<View
						center={fromLonLat(
							props.initialCenter || position || fontainebleauLocation
						)}
						zoom={initialZoom}
					/>

					<TileLayer>
						<XYZ
							ref={setXYZ}
							attributions={attributions}
							url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
							// IMPORTANT
							tilePixelRatio={2}
							tileSize={512}
						/>
					</TileLayer>

					{props.children}

					{displayUserMarker && (
						<UserMarkerLayer onClick={props.onUserMarkerClick} />
					)}
				</BaseMap>
			</div>
		);
	}
);
