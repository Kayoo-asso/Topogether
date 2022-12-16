import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Parking, Waypoint } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';

interface WaypointMarkersLayerProps {
    waypoints: QuarkArray<Waypoint>;
    draggable?: boolean;
}

export type WaypointMarkerData = {
	label: string;
	quark: Quark<Waypoint>;
}

export const waypointMarkerStyle = (selected: boolean, anySelected: boolean) => {
    const icon = new Icon({
        opacity: anySelected ? (selected ? 1 : 0.4) : 1,
        src: selected ? "/assets/icons/colored/_help-round_bold.svg" : "/assets/icons/colored/_help-round.svg",
        scale: 1,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const WaypointMarkersLayer: React.FC<WaypointMarkersLayerProps> = watchDependencies(({
    draggable = false,
    ...props
}: WaypointMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const selectedItem = useSelectStore((s) => s.item.value);
    const select = useSelectStore(s => s.select);
    const flush = useSelectStore(s => s.flush);
    
    return (
        <>
            {/* TODO: Drag Interaction */}

            <Select
                layers={["parkings"]}
                hitTolerance={5}
                onSelect={(e) => {
                    e.target.getFeatures().clear();
                    e.mapBrowserEvent.stopPropagation();
                    e.mapBrowserEvent.preventDefault();
                    if (e.selected.length === 1) {
                        const feature = e.selected[0];
                        const { quark } = feature.get("data") as WaypointMarkerData;
                        select.waypoint(quark);
                    } else if (e.deselected.length === 1) {
                        flush.item();
                    }
                }}
            />

            <VectorLayer
                id="waypoints"
                className='waypoints'
                style={useCallback(
                    (feature) => {
                        const bId = feature.get("data").quark().id;
                        return waypointMarkerStyle (
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none"
                        )}
                    , [selectedType, selectedItem])
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
                </VectorSource>
            </VectorLayer>
        </>
    )
})

WaypointMarkersLayer.displayName = "WaypointMarkersLayer";