import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { UUID, Waypoint } from 'types';
import { SelectedWaypoint, useSelectStore } from 'components/pages/selectStore';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Drag } from 'components/openlayers/interactions/Drag';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { Breakpoint, useBreakpoint } from 'helpers/hooks';
import PointGeom from "ol/geom/Point";

interface WaypointMarkersLayerProps {
    waypoints: QuarkArray<Waypoint>;
    draggable?: boolean;
}

export const waypointMarkerStyle = (selected: boolean, anySelected: boolean, device: Breakpoint, mapZoom: number) => {
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
    
    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();

    return (
        <>
            {draggable &&
                <>
                    <Drag 
                        sources='waypoints'
                        hitTolerance={5}
                        startCondition={useCallback((e) => { 
                            const wId = e.feature.get("data")?.value().id as UUID;
                            return !!(selectedItem && selectedItem().id === wId); 
                        }, [selectedItem])}
                        onDragEnd={(e) => {
                            const data = e.feature.get("data") as SelectedWaypoint;
                            const point = e.feature.getGeometry() as PointGeom;
                            const coords = toLonLat(point.getCoordinates());
                            if (data)
                                data.value.set((b) => ({
                                    ...b,
                                    location: [coords[0], coords[1]],
                                }));
                        }}
                    />
                </>
            }

            <VectorLayer
                id="waypoints"
                style={useCallback(
                    (feature) => {     
                        const bId = feature.get("data").value().id;
                        return waypointMarkerStyle (
                            false,
                            selectedType !== "none",
                            device,
                            mapZoom
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
                                data={{ type: 'waypoint', value: wQuark }}
                            />
                        )
                    })}
                </VectorSource>
            </VectorLayer>
        </>
    )
})

WaypointMarkersLayer.displayName = "WaypointMarkersLayer";