import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
    Modify,
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { UUID, Waypoint } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Drag } from 'components/openlayers/interactions/Drag';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { Breakpoint, useBreakpoint } from 'helpers/hooks';
import { useMapPointerCoordinates } from 'helpers/hooks/useMapPointerCoordinates';
import { MapBrowserEvent } from 'ol';

interface WaypointMarkersLayerProps {
    waypoints: QuarkArray<Waypoint>;
    draggable?: boolean;
    onCreate?: (e: MapBrowserEvent<MouseEvent>) => void;
}

export type WaypointMarkerData = {
	label: string;
	quark: Quark<Waypoint>;
}

export const waypointMarkerStyle = (mapZoom: number, selected: boolean, anySelected: boolean, device: Breakpoint) => {
    const icon = new Icon({
        opacity: mapZoom > disappearZoom ? (anySelected ? (selected ? 1 : 0.4) : 1) : 0,
        src: "/assets/icons/markers/info.svg",
        scale: device === 'desktop' ? 0.8 : 1,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const disappearZoom = 14;
export const WaypointMarkersLayer: React.FC<WaypointMarkersLayerProps> = watchDependencies(({
    draggable = false,
    ...props
}: WaypointMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const selectedItem = useSelectStore((s) => s.item.value);
    const select = useSelectStore(s => s.select);
    const flush = useSelectStore(s => s.flush);
    const tool = useSelectStore(s => s.tool);

    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();
    const pointerCoords = useMapPointerCoordinates(!!tool);

    return (
        <>
            {draggable &&
                <>
                    <Modify 
                        hitDetection={true}
                        source='waypoints'
                        onModifyStart={useCallback((e) => {
                            const feature = e.features.getArray().at(0)
                            const wId = feature?.get("data")?.quark().id as UUID;
                            return !!(selectedItem && selectedItem().id === wId);  
                        }, [selectedItem])}
                        onDragEnd={(e) => {
                            const newLoc = toLonLat(e.mapBrowserEvent.coordinate);
                            const { quark } = e.feature.get("data") as WaypointMarkerData;
                            quark.set(w => ({
                                ...w,
                                location: [newLoc[0], newLoc[1]],
                            }))
                        }}
                    />
                    {/* <Drag 
                        sources='waypoints'
                        hitTolerance={5}
                        startCondition={useCallback((e) => { 
                            const wId = e.feature.get("data")?.quark().id as UUID;
                            return !!(selectedItem && selectedItem().id === wId); 
                        }, [selectedItem])}
                        onDragEnd={(e) => {
                            const newLoc = toLonLat(e.mapBrowserEvent.coordinate);
                            const { quark } = e.feature.get("data") as WaypointMarkerData;
                            quark.set(w => ({
                                ...w,
                                location: [newLoc[0], newLoc[1]],
                            }))
                        }}
                    /> */}
                </>
            }

            <Select
                layers={["waypoints"]}
                hitTolerance={5}
                onSelect={(e) => {
                    e.target.getFeatures().clear();
                    if (e.selected.length === 1) {
                        const feature = e.selected[0];
                        const data = feature.get("data") as WaypointMarkerData;
                        if (data) { // It's an existing marker
                            e.mapBrowserEvent.stopPropagation();
                            e.mapBrowserEvent.preventDefault();
                            select.waypoint(data.quark); 
                        }
                        else props.onCreate && props.onCreate(e.mapBrowserEvent)
                    } else if (e.deselected.length === 1) {
                        flush.item();
                    }
                }}
            />

            <VectorLayer
                id="waypoints"
                style={useCallback(
                    (feature) => {     
                        const bId = feature.get("data")?.quark().id;
                        return waypointMarkerStyle (
                            mapZoom,
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none",
                            device
                        )}
                    , [mapZoom, selectedType, selectedItem])
                }
            >
                <VectorSource>
                    {props.waypoints.quarks().map(wQuark => {
                        const w = wQuark();
                        return (
                            <Point
                                key={w.id}
                                coordinates={fromLonLat(w.location)}
                                data={{ quark: wQuark }}
                            />
                        )
                    })}
                    {tool === 'WAYPOINT' && pointerCoords &&
						<Point
							key={"creating"}
							coordinates={pointerCoords}
						/>
					}
                </VectorSource>
            </VectorLayer>
        </>
    )
})

WaypointMarkersLayer.displayName = "WaypointMarkersLayer";