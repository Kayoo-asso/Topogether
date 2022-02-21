import React, { useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { BoulderMarker, CreatingSectorAreaMarker, For, Map, ParkingMarker, RoundButton, SatelliteButton, SectorAreaMarker, Show, TopoMarker, WaypointMarker } from 'components';
import { BoulderFilterOptions, BoulderFilters, MapSearchbarProps, TopoFilterOptions, TopoFilters } from '.';
import { MapSearchbar } from '..';
import { Amenities, Boulder, ClimbTechniques, GeoCoordinates, gradeToLightGrade, LightGrade, LightTopo, MapProps, MarkerProps, Parking, PolyMouseEvent, Sector, Topo, UUID, Waypoint } from 'types';
import { googleGetPlace, hasFlag, hasSomeFlags, mergeFlags } from 'helpers';
import { Quark, QuarkIter, reactKey, SelectQuarkNullable } from 'helpers/quarky';

interface MapControlProps extends MapProps {
  className?: string,
  initialZoom?: number,
  boundsToMarkers?: boolean,
  displaySatelliteButton?: boolean,
  displayUserMarker?: boolean,
  displayPhotoButton?: boolean,
  onPhotoButtonClick?: () => void,
  displaySearchbar?: boolean,
  searchbarOptions?: MapSearchbarProps,
  onSearchResultSelect?: () => void,
  topo?: Quark<Topo>,
  topos?: QuarkIter<Quark<LightTopo>>,
  displayTopoFilter?: boolean,
  onTopoClick?: (topo: Quark<LightTopo>) => void,
  creatingSector?: GeoCoordinates[],
  onCreatingSectorOriginClick?: () => void,
  onCreatingSectorPolylineClick?: () => void,
  sectors?: QuarkIter<Quark<Sector>>,
  selectedSector?: SelectQuarkNullable<Sector>,
  onSectorClick?: (e: PolyMouseEvent, sector: Quark<Sector>) => void,
  boulders?: QuarkIter<Quark<Boulder>>,
  bouldersOrder: Map<UUID, number>,
  selectedBoulder?: SelectQuarkNullable<Boulder>,
  onBoulderClick?: (boulder: Quark<Boulder>) => void,
  onBoulderContextMenu?: (e: Event, boulder: Quark<Boulder>) => void,
  displayBoulderFilter?: boolean,
  waypoints?: QuarkIter<Quark<Waypoint>>,
  selectedWaypoint?: SelectQuarkNullable<Waypoint>,
  onWaypointClick?: (waypoint: Quark<Waypoint>) => void,
  parkings?: QuarkIter<Quark<Parking>>,
  selectedParking?: SelectQuarkNullable<Parking>,
  onParkingClick?: (parking: Quark<Parking>) => void,
  draggableMarkers?: boolean,  
  onMapZoomChange?: (zoom: number | undefined) => void,
}

export const MapControl: React.FC<MapControlProps> = ({
    initialZoom = 8,
    displaySearchbar = true,
    displaySatelliteButton = true,
    displayUserMarker = true,
    displayPhotoButton = true,
    boundsToMarkers = false,
    displayTopoFilter = false,
    displayBoulderFilter = false,
    draggableMarkers = false,
    ...props
}: MapControlProps) => {
    const mapRef = useRef<google.maps.Map>(null);
    const [satelliteView, setSatelliteView] = useState(false);
    const maxBoulders = props.topos ? Math.max(...props.topos.map(t => t().nbBoulders).toArray()) : 0;
    const defaultTopoFilterOptions: TopoFilterOptions = {
        types: [],
        boulderRange: [0, maxBoulders],
        gradeRange: [3, 9],
        adaptedToChildren: false,
    };
    const [topoFilterOptions, setTopoFilterOptions] = useState<TopoFilterOptions>(defaultTopoFilterOptions);
    const maxTracks = props.boulders ? Math.max(...props.boulders.map(b => b().tracks.length).toArray()) : 0;
    const defaultBoulderFilterOptions: BoulderFilterOptions = {
        techniques: ClimbTechniques.None,
        tracksRange: [0, maxTracks],
        gradeRange: [3, 9],
        mustSee: false
    }
    const [boulderFilterOptions, setBoulderFilterOptions] = useState<BoulderFilterOptions>(defaultBoulderFilterOptions);

    const boulderFilter = (boulder: Boulder) => {
        const boulderTechniques = mergeFlags(boulder.tracks.toArray().map(track => track.techniques).filter(tech => !!tech) as ClimbTechniques[]);

        if (boulderFilterOptions.techniques !== ClimbTechniques.None && !hasSomeFlags(boulderFilterOptions.techniques, boulderTechniques)) {
            return false;
        }

        if (boulder.tracks.length < boulderFilterOptions.tracksRange[0] || boulder.tracks.length > boulderFilterOptions.tracksRange[1]) {
            return false;
        }

        if (boulderFilterOptions.gradeRange[0] !== 3 || boulderFilterOptions.gradeRange[1] !== 9) {
            const boulderGrades: LightGrade[] = boulder.tracks.toArray().map(track => gradeToLightGrade(track.grade));
            const foundBouldersAtGrade = boulderGrades.some(grade => grade >= boulderFilterOptions.gradeRange[0] && grade <= boulderFilterOptions.gradeRange[1]);

            if (!foundBouldersAtGrade) {
                return false;
            }
        }
        return boulderFilterOptions.mustSee ? boulder.mustSee : true;
    }

    const topoFilter = (topo: LightTopo) => {
        if (topoFilterOptions.types.length && !topoFilterOptions.types.includes(topo.type!)) {
            return false;
        }
        if (topo.nbBoulders < topoFilterOptions.boulderRange[0] || topo.nbBoulders > topoFilterOptions.boulderRange[1]) {
            return false;
        }
        if (topoFilterOptions.gradeRange[0] !== 3 || topoFilterOptions.gradeRange[1] !== 9) {
            const foundBouldersAtGrade = Object.entries(topo.grades).some(([grade, count]) =>
                Number(grade) >= topoFilterOptions.gradeRange[0] && Number(grade) <= topoFilterOptions.gradeRange[1] && count !== 0);

            if (!foundBouldersAtGrade) {
                return false;
            }
        }
        return topoFilterOptions.adaptedToChildren ? hasFlag(topo.amenities, Amenities.AdaptedToChildren) : true;
    }

    const getBoundsFromSearchbar = (geometry: google.maps.places.PlaceGeometry) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            if (geometry.viewport) newBounds.union(geometry.viewport);
            else if (geometry.location) newBounds.extend(geometry.location);
            else return;
            mapRef.current.fitBounds(newBounds);
        }
    }
    const getBoundsFromMarker = (markers: MarkerProps[]) => {
        if (mapRef.current) {
            const newBounds = new google.maps.LatLngBounds();
            markers.map(marker => {
                if (marker.options?.position && newBounds) {
                    newBounds.extend(new google.maps.LatLng(
                        marker.options?.position
                    ));
                }
            });
            mapRef.current.fitBounds(newBounds);
        }
    }

    return (
        <div className="relative w-full h-full md:flex-1">
            <Wrapper apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU" libraries={['places']}>

                <div
                    className="absolute h-full w-full p-3 grid grid-rows-2"
                >
                    <div className="flex">
                        <div className="w-1/2 text-left">
                            {displaySearchbar && (
                                <MapSearchbar
                                    onResultSelect={async (option) => {
                                        const placeDetails = await googleGetPlace(option.value) as google.maps.places.PlaceResult;
                                        if (placeDetails.geometry) getBoundsFromSearchbar(placeDetails.geometry);
                                    }}
                                    {...props.searchbarOptions}
                                />
                            )}
                            {displayTopoFilter &&
                                <div className='mt-5'>
                                    <TopoFilters
                                        options={defaultTopoFilterOptions}
                                        values={topoFilterOptions}
                                        onChange={setTopoFilterOptions}
                                    />
                                </div>
                            }
                            {displayBoulderFilter &&
                                <div className='mt-5'>
                                    <BoulderFilters
                                        options={defaultBoulderFilterOptions}
                                        values={boulderFilterOptions}
                                        onChange={setBoulderFilterOptions}
                                    />
                                </div>
                            }
                        </div>
                        <div className="w-1/2 text-right">
                            {displaySatelliteButton && (
                                <SatelliteButton
                                    onClick={(displaySatellite) => setSatelliteView(displaySatellite)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex items-end">
                        <div className="w-1/3 text-left" />
                        <div className="w-1/3 text-center">
                            {displayPhotoButton &&
                                <div className='md:hidden'>
                                    <RoundButton
                                        iconName="camera"
                                        white={false}
                                        buttonSize={80}
                                        iconClass="stroke-white"
                                        iconSizeClass="h-7 w-7"
                                        onClick={props.onPhotoButtonClick}
                                    />
                                </div>
                            }
                        </div>
                        <div className="w-1/3 text-right">
                            {displayUserMarker && (
                                <RoundButton
                                    iconName="center"
                                    iconClass="stroke-main fill-main"
                                    iconSizeClass="h-7 w-7"
                                    onClick={() => {
                                        //TODO
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>


        <Map
          ref={mapRef}
          zoom={initialZoom} 
          mapTypeId={satelliteView ? 'satellite' : 'roadmap'}
          className={props.className ? props.className : ''}
          onZoomChange={() => {
            if (mapRef.current && props.onMapZoomChange) {
              props.onMapZoomChange(mapRef.current.getZoom());
            }
          }}
          // TODO
          // onLoad={() => {
          //   if (boundsToMarkers && props.children) getBoundsFromMarker(props.children);
          // }}
          {...props}
        >
          <Show when={() => props.creatingSector && props.creatingSector.length > 0}>
            <CreatingSectorAreaMarker 
                path={props.creatingSector!}
                onPolylineClick={props.onCreatingSectorPolylineClick}
                onOriginClick={props.onCreatingSectorOriginClick}
              />
          </Show>
          <Show when={() => props.sectors}>
            <For each={() => props.sectors!.toArray()}>
              {(sector) => 
                <SectorAreaMarker 
                  key={reactKey(sector)}
                  sector={sector}
                  selected={props.selectedSector ? props.selectedSector()?.id === sector().id : false}
                  clickable={!props.draggableCursor}
                  topo={props.topo}
                  boulderOrder={props.bouldersOrder}
                  draggable={draggableMarkers}
                  editable={draggableMarkers}
                  onClick={props.onSectorClick}
                  onMouseMoveOnSector={props.onMouseMove}
                />
              }
            </For>
          </Show>
          <Show when={() => props.waypoints}>
            <For each={() => props.waypoints!.toArray()}>
                {(waypoint) => 
                  <WaypointMarker 
                    key={reactKey(waypoint)}
                    draggable={draggableMarkers}
                    waypoint={waypoint}
                    selected={props.selectedWaypoint ? props.selectedWaypoint()?.id === waypoint().id : false}
                    onClick={props.onWaypointClick}
                  />
                }
            </For>
          </Show>
          <Show when={() => props.boulders}>
            <For each={() => displayBoulderFilter ? props.boulders!.filter(b => boulderFilter(b())).toArray() : props.boulders!.toArray()}>
              {(boulder) => 
                <BoulderMarker
                  key={reactKey(boulder)}
                  draggable={draggableMarkers}
                  boulder={boulder}
                  boulderOrder={props.bouldersOrder}
                  selected={props.selectedBoulder ? props.selectedBoulder()?.id === boulder().id : false}
                  topo={props.topo}
                  onClick={props.onBoulderClick}
                  onContextMenu={props.onBoulderContextMenu}
                />   
              }
            </For>
          </Show>
          <Show when={() => props.parkings}>
            <For each={() => props.parkings!.toArray()}>
                {(parking) => 
                  <ParkingMarker 
                    key={reactKey(parking)}
                    draggable={draggableMarkers}
                    parking={parking}
                    selected={props.selectedParking ? props.selectedParking()?.id === parking().id : false}
                    onClick={props.onParkingClick}
                  />
                }
            </For>
          </Show>
          <Show when={() => props.topos}>
            <For each={() => props.topos!.filter(t => topoFilter(t())).toArray()}>
                {(topo) =>
                  <TopoMarker 
                    key={reactKey(topo)}
                    draggable={draggableMarkers}
                    topo={topo}
                    onClick={props.onTopoClick}
                  />
                }
            </For>
          </Show>
        </Map>
      </Wrapper>
    </div>
  );
};
