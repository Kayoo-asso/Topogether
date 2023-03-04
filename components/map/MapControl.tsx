import React, { useCallback, useEffect, useState } from "react";
import { Map as BaseMap, View, TileLayer, XYZ } from "components/openlayers";
import Map from "ol/Map";
import { fromLonLat } from "ol/proj";
import { GeoCoordinates, Position, Sector, Topo } from "types";
import { Quark, watchDependencies } from "helpers/quarky";
import { setReactRef } from "helpers/utils";
import { useSelectStore } from "components/pages/selectStore";
import { handleNewPhoto } from "helpers/handleNewPhoto";
import { useSession } from "helpers/services";
import { MapToolSelector } from "./MapToolSelector";
import { Props } from "components/openlayers/Map";
import { UserMarkerLayer } from "./markers/UserMarkerLayer";
import { MapBrowserEvent } from "ol";
import { Attribution } from "ol/control";
import { isEmpty } from "ol/extent";
import { fontainebleauLocation } from "helpers/constants";
import { OnClickFeature } from "components/openlayers/extensions/OnClick";
import { CenterButton } from "./CenterButton";
import { useRouter } from "next/router";
import { SearchButton } from "./searchbar/SearchButton";
import { FilterButton } from "./filters/FilterButton";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { usePosition } from "helpers/hooks/UserPositionProvider";
import { SatelliteButton } from "components/atoms/buttons/SatelliteButton";
import { ImageInput } from "components/molecules/form/ImageInput";
import { DeleteButton } from "components/atoms/buttons/DeleteButton";
import { DEFAULT_EXTENT_BUFFER, getTopoExtent } from "helpers/map/getExtent";
import { ValidateButton } from "components/atoms/buttons/ValidateButton";
import { DeleteItemButton } from "components/atoms/buttons/DeleteItemButton";

type MapControlProps = React.PropsWithChildren<
	Props & {
		className?: string;
		initialCenter?: Position;
		initialZoom?: number;
		minZoom?: number;
		displaySatelliteButton?: boolean;
		displayUserMarker?: "above" | "under";
		displayToolSelector?: boolean;
		onPhotoButtonClick?: () => void;
		Searchbar?: React.FC;
		Filters?: React.FC;
		topo?: Quark<Topo>;
		onUserMarkerClick?: (pos: GeoCoordinates | null) => void;
	}
>;

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";

// The default controls except the zoom +/- buttons and the rotate button
const controls = typeof window === "undefined" ? [] : [new Attribution()];

export const MapControl = watchDependencies<Map, MapControlProps>(
	({
		initialZoom = 8,
		displaySatelliteButton = true,
		displayUserMarker = "above",
		displayToolSelector = false,
		Searchbar,
		Filters,
		...props
	},
	parentRef
	) => {
		const session = useSession();
		const router = useRouter();
		const breakpoint = useBreakpoint();
		const [map, setMap] = useState<Map | null>(null);
		const { position } = usePosition();
		const selectedItem = useSelectStore((s) => s.item);
		const select = useSelectStore((s) => s.select);
		const flush = useSelectStore((s) => s.flush);
		const tool = useSelectStore((s) => s.tool);

		// We don't want to recenter the View after initial load, so we need to never change
		// its `center` prop
		const [initialCenter, setInitialCenter] = useState(props.initialCenter);
		if (!initialCenter && props.initialCenter) {
			setInitialCenter(props.initialCenter);
		}

		const [mapToolSelectorOpen, setMapToolSelectorOpen] = useState(router.pathname.includes('builder') && breakpoint === "desktop");
		const [satelliteView, setSatelliteView] = useState(false);

		useEffect(() => {
			const determinePointer = (e: MapBrowserEvent<PointerEvent>) => {
				if (map && !tool && breakpoint === "desktop") {
					const hit = map && map.getFeaturesAtPixel(e.pixel).length > 0;
					if (hit) {
						map.getTargetElement().style.cursor = "pointer";
					} else {
						map.getTargetElement().style.cursor = "";
					}
				}
			};
			map?.on("pointermove", determinePointer);
			return () => map?.un("pointermove", determinePointer);
		}, [map, tool, breakpoint]);

		// Initial extension / bounding
		useEffect(() => {
			if (map && props.topo) {
				const extent = getTopoExtent(props.topo(), DEFAULT_EXTENT_BUFFER);
				if (!isEmpty(extent))
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
						{Searchbar &&
							<div className={`relative hidden md:block`}>
								<SearchButton />
								<Searchbar />
							</div>
						}
						{Filters &&
							<div className={`relative hidden md:block`}>
								<FilterButton />
								<Filters />
							</div>
						}
					</div>

					{/* Top right */}
					<div className="absolute right-0 top-0 m-3">
						{displaySatelliteButton && (
							<SatelliteButton onClick={setSatelliteView} />
						)}
					</div>

					{/* Bottom left */}
					<div className={"absolute bottom-0 left-0 m-3"}>
						{/* Nothing here ! Map attributions */}
					</div>

					{/* Bottom center */}
					<div
						className={
							(mapToolSelectorOpen && breakpoint === "mobile"
								? "z-100"
								: "z-1") + " absolute bottom-0 my-3 flex w-full justify-center"
						}
					>
						{displayToolSelector && (
							<>
								<div className={`${selectedItem.type === 'sector' ? '' : 'hidden'} flex w-full flex-row justify-center`}>
									<DeleteItemButton white item={selectedItem} />
								</div>

								<div className={`${selectedItem.type === 'sector' ? 'hidden' : ''} flex w-full flex-row justify-center gap-5`}>
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
							</>
						)}
					</div>

					{/* Bottom right */}
					<div
						className={
							"absolute right-0 bottom-0 m-3 space-y-5" +
							(mapToolSelectorOpen && breakpoint === "mobile" ? ' pb-[90px]' : '') +
							(breakpoint === "desktop" ? " z-100" : "")
						}
					>
						<div className={`${Searchbar ? 'md:hidden' : 'hidden'}`}>
							<SearchButton />
						</div>
						<div className={`${Filters ? 'md:hidden' : 'hidden'}`}>
							<FilterButton />
						</div>
						<CenterButton 
							map={map} 
							topo={props.topo}
						/>
					</div>
				</div>

				<BaseMap
					ref={useCallback((ref) => {
						setMap(ref);
						setReactRef(parentRef, ref);
					}, [])}
					className="h-full w-full"
					onClick={(e) => {
						const map = e.map;
						const hit = map.getFeaturesAtPixel(e.pixel).length > 0;
						if (!hit) {
							flush.item();
							if (props.onClick) props.onClick(e);
						}
					}}
					controls={controls}
				>
					<View
						center={
							initialCenter
								? fromLonLat(initialCenter)
								: fromLonLat(fontainebleauLocation)
						}
						zoom={initialZoom}
						minZoom={props.minZoom}
						enableRotation={false}
					/>

					<TileLayer>
						<XYZ
							attributions={attributions}
							url={
								satelliteView
									? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
									: `https://api.mapbox.com/styles/v1/erwinkn/clbs8clin005514qrc9iueujg/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`
							}
							// IMPORTANT
							tilePixelRatio={2}
							tileSize={512}
						/>
					</TileLayer>

					{displayUserMarker === "under" && (
						<UserMarkerLayer onClick={props.onUserMarkerClick} />
					)}

					{props.children}

					{displayUserMarker === "above" && (
						<UserMarkerLayer onClick={props.onUserMarkerClick} />
					)}
				</BaseMap>
			</div>
		);
	}
);

MapControl.displayName = "MapControl";
