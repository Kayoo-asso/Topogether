import React, { useCallback } from 'react';
import { QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Waypoint } from 'types';
import { SelectedWaypoint, useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { Breakpoint, useBreakpoint } from 'helpers/hooks/DeviceProvider';
import { FeatureLike } from 'ol/Feature';

interface WaypointMarkersLayerProps {
    waypoints: QuarkArray<Waypoint>;
}

export const waypointMarkerStyle = (selected: boolean, anySelected: boolean, device: Breakpoint, mapZoom: number) => {
    const icon = new Icon({
        opacity: mapZoom > disappearZoom ? (anySelected ? (selected ? 1 : 0.4) : 1) : 0,
        src: "/assets/icons/markers/info.svg",
        scale: device === 'desktop' ? 0.7 : 0.8,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const disappearZoom = 14;
export const WaypointMarkersLayer: React.FC<WaypointMarkersLayerProps> = watchDependencies((props: WaypointMarkersLayerProps) => {
    const selectedItem = useSelectStore((s) => s.item);
    const anySelected = !!(selectedItem.type !== 'none' && selectedItem.type !== 'sector');
    
    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();

    return (
        <>
            <VectorLayer
                id="waypoints"
                style={useCallback((f: FeatureLike) => {
                    const item = f.get("data") as SelectedWaypoint;
                    const selected = selectedItem.value ? item.value().id === selectedItem.value().id : false;
                    return waypointMarkerStyle (
                            selected,
                            anySelected,
                            device,
                            mapZoom
                        )}, [mapZoom, device, anySelected, selectedItem])
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