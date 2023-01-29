import React, { useCallback } from 'react';
import { QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { Parking } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';
import { useMapZoom } from 'helpers/hooks/useMapZoom';
import { disappearZoom } from './WaypointMarkersLayer';
import { Breakpoint, useBreakpoint } from 'helpers/hooks/DeviceProvider';

interface ParkingMarkersLayerProps {
    parkings: QuarkArray<Parking>;
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

export const ParkingMarkersLayer: React.FC<ParkingMarkersLayerProps> = watchDependencies((props: ParkingMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const anySelected = !!(selectedType !== 'none' && selectedType !== 'sector');

    const mapZoom = useMapZoom(disappearZoom);
    const device = useBreakpoint();
    
    return (
        <>
            <VectorLayer
                id="parkings"
                style={useCallback(() =>
                        parkingMarkerStyle (
                            false,
                            anySelected,
                            device,
                            mapZoom
                        ), [mapZoom, device, anySelected])
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