import React, { useCallback } from 'react';
import { QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Parking } from 'types';
import { SelectedParking, useSelectStore } from 'components/store/selectStore';
import { fromLonLat } from 'ol/proj';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { disappearZoom } from './WaypointMarkersLayer';
import { Breakpoint, useBreakpoint } from 'helpers/hooks/DeviceProvider';
import { FeatureLike } from 'ol/Feature';

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
}

export const parkingMarkerStyle = (selected: boolean, anySelected: boolean, device: Breakpoint, mapZoom: number) => {
    const icon = new Icon({
        opacity: mapZoom > disappearZoom ? (anySelected ? (selected ? 1 : 0.4) : 1) : 0,
        src: "/assets/icons/markers/parking.svg",
        scale: device === 'desktop' ? 0.7 : 0.8,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const ParkingMarkersLayer: React.FC<ParkingMarkersLayerProps> = watchDependencies((props: ParkingMarkersLayerProps) => {
    const selectedItem = useSelectStore((s) => s.item);
    const anySelected = !!(selectedItem.type !== 'none' && selectedItem.type !== 'sector');

    const mapZoom = useMapZoom(disappearZoom);
    const bp = useBreakpoint();
    
    console.log('parkings:');
    // console.log(props.parkings.toArray());
    return (
        <>

            <VectorLayer
                id="parkings"
                style={useCallback((f: FeatureLike) => {
                        const item = f.get("data") as SelectedParking;
                        const selected = selectedItem.value ? item.value().id === selectedItem.value().id : false;
                        return parkingMarkerStyle (
                            selected,
                            anySelected,
                            bp,
                            mapZoom
                )}, [mapZoom, bp, anySelected, selectedItem])
                }
            >
                <VectorSource>
                    {props.parkings.quarks().map(pQuark => {
                        const p = pQuark();
                        return (
                            <Point
                                key={p.id}
                                coordinates={fromLonLat(p.location)}
                                data={{ type: 'parking', value: pQuark }}
                            />
                        )
                    })}  
                </VectorSource>
            </VectorLayer>
        </>
    )
})

ParkingMarkersLayer.displayName = "ParkingMarkersLayer";