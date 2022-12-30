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

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
    draggable?: boolean;
}

export type ParkingMarkerData = {
	label: string;
	quark: Quark<Parking>;
}

export const parkingMarkerStyle = (mapZoom: number, selected: boolean, anySelected: boolean) => {
    const icon = new Icon({
        opacity: mapZoom > 13.5 ? (anySelected ? (selected ? 1 : 0.4) : 1) : 0,
        src: selected ? "/assets/icons/colored/_parking_bold.svg" : "/assets/icons/colored/_parking.svg",
        scale: 1,
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
    const mapZoom = useMapZoom(13.5);
    
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
                            mapZoom,
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none"
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