import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Parking } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
    draggable?: boolean;
}

export type ParkingMarkerData = {
	label: string;
	quark: Quark<Parking>;
}

export const parkingMarkerStyle = (selected: boolean, anySelected: boolean) => {
    const icon = new Icon({
        opacity: anySelected ? (selected ? 1 : 0.4) : 1,
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
                        const { quark } = feature.get("data") as ParkingMarkerData;
                        select.parking(quark);
                    } else if (e.deselected.length === 1) {
                        flush.item();
                    }
                }}
            />

            <VectorLayer
                id="parkings"
                className='parkings'
                style={useCallback(
                    (feature) => {
                        const bId = feature.get("data").quark().id;
                        return parkingMarkerStyle (
                            selectedItem ? selectedItem().id === bId : false,
                            selectedType !== "none"
                        )}
                    , [selectedType, selectedItem])
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