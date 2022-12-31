import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Parking, UUID } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Drag } from 'components/openlayers/interactions/Drag';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { Breakpoint, useBreakpoint } from 'helpers/hooks';
import { disappearZoom } from './WaypointMarkersLayer';
import PointGeom from "ol/geom/Point";

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
    draggable?: boolean;
}

export type ParkingMarkerData = {
	label: string;
	quark: Quark<Parking>;
}

export const parkingMarkerStyle = (selected: boolean, anySelected: boolean, device: Breakpoint, mapZoom: number) => {
    const icon = new Icon({
        opacity: mapZoom > disappearZoom ? (anySelected ? (selected ? 1 : 0.4) : 1) : 0,
        src: "/assets/icons/markers/parking.svg",
        scale: device === 'desktop' ? 0.8 : 1,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const ParkingMarkersLayer: React.FC<ParkingMarkersLayerProps> = watchDependencies(({
    draggable = false,
    ...props
}: ParkingMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const selectedItem = useSelectStore((s) => s.item.value);
    const select = useSelectStore(s => s.select);
    const flush = useSelectStore(s => s.flush);

    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();
    
    return (
        <>
            {draggable &&
                <Drag 
                    sources='parkings'
                    hitTolerance={5}
                    startCondition={useCallback((e) => { 
                        const pId = e.feature.get("data").quark().id as UUID;
                        return !!(selectedItem && selectedItem().id === pId); 
                    }, [selectedItem])}
                    onDragEnd={(e) => {
                        const data = e.feature.get("data") as ParkingMarkerData;
                            const point = e.feature.getGeometry() as PointGeom;
                            const coords = toLonLat(point.getCoordinates());
                            if (data)
                                data.quark.set((b) => ({
                                    ...b,
                                    location: [coords[0], coords[1]],
                                }));
                    }}
                />
            }

            <Select
                layers={["parkings"]}
                hitTolerance={5}
                onSelect={(e) => {
                    e.target.getFeatures().clear();
                    e.mapBrowserEvent.stopPropagation();
                    e.mapBrowserEvent.preventDefault();
                    if (e.selected.length === 1) {
                        const feature = e.selected[0];
                        const { quark } = feature.get("data") as ParkingMarkerData;
                        select.parking(quark); 
                    } else if (e.deselected.length === 1) {
                        flush.item();
                    }
                }}
            />

            <VectorLayer
                id="parkings"
                style={useCallback(
                    (feature) => {
                        const bId = feature.get("data").quark().id;
                        return parkingMarkerStyle (
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none",
                            device,
                            mapZoom
                        )}
                    , [mapZoom, selectedType, selectedItem])
                }
            >
                <VectorSource>
                    {props.parkings.quarks().map(pQuark => {
                        const p = pQuark();
                        return (
                            <Point
                                key={p.id}
                                coordinates={fromLonLat(p.location)}
                                data={{ quark: pQuark }}
                            />
                        )
                    })}  
                </VectorSource>
            </VectorLayer>
        </>
    )
})

ParkingMarkersLayer.displayName = "ParkingMarkersLayer";