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
import { MapBrowserEvent } from 'ol';
import { useMapPointerCoordinates } from 'helpers/hooks/useMapPointer';

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
    draggable?: boolean;
    onCreate?: (e: MapBrowserEvent<MouseEvent>) => void;
}

export type ParkingMarkerData = {
	label: string;
	quark: Quark<Parking>;
}

export const parkingMarkerStyle = (mapZoom: number, selected: boolean, anySelected: boolean, device: Breakpoint) => {
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
    const tool = useSelectStore(s => s.tool);

    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();
    const pointerCoords = useMapPointerCoordinates();
    
    return (
        <>
            {draggable &&
                <Drag 
                    sources='parkings'
                    hitTolerance={5}
                    startCondition={useCallback((e) => { 
                        const pId = e.feature.get("data")?.quark().id as UUID;
                        return !!(selectedItem && selectedItem().id === pId); 
                    }, [selectedItem])}
                    onDragEnd={(e) => {
                        const newLoc = toLonLat(e.mapBrowserEvent.coordinate);
                        const { quark } = e.feature.get("data") as ParkingMarkerData;
                        quark.set(p => ({
                            ...p,
                            location: [newLoc[0], newLoc[1]],
                        }))
                    }}
                />
            }

            <Select
                layers={["parkings"]}
                hitTolerance={5}
                onSelect={(e) => {
                    e.target.getFeatures().clear();
                    if (e.selected.length === 1) {
                        const feature = e.selected[0];
                        const data = feature.get("data") as ParkingMarkerData;
                        if (data) { // It's an existing marker
                            e.mapBrowserEvent.stopPropagation();
                            e.mapBrowserEvent.preventDefault();
                            select.parking(data.quark); 
                        }
                        else props.onCreate && props.onCreate(e.mapBrowserEvent)
                    } else if (e.deselected.length === 1) {
                        flush.item();
                    }
                }}
            />

            <VectorLayer
                id="parkings"
                style={useCallback(
                    (feature) => {
                        const bId = feature.get("data")?.quark().id;
                        return parkingMarkerStyle (
                            mapZoom,
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none",
                            device
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
                    {tool === 'PARKING' && pointerCoords &&
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

ParkingMarkersLayer.displayName = "ParkingMarkersLayer";