import React, { useCallback } from 'react';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { useSelectStore } from 'components/pages/selectStore';
import { useBreakpoint } from 'helpers/hooks';
import { MapBrowserEvent } from 'ol';
import { useMapPointerCoordinates } from 'helpers/hooks/useMapPointerCoordinates';
import { parkingMarkerStyle } from './ParkingMarkersLayer';
import { disappearZoom, waypointMarkerStyle } from './WaypointMarkersLayer';
import { boulderMarkerStyle } from './BoulderMarkersLayer';
import { UUID } from 'types';

interface CreatingMarkersLayerProps {
	boulderOrder: globalThis.Map<UUID, number>,
    onCreate?: (e: MapBrowserEvent<MouseEvent>) => void;
}

export const CreatingMarkersLayer: React.FC<CreatingMarkersLayerProps> = (props: CreatingMarkersLayerProps) => {
    const tool = useSelectStore(s => s.tool);
    const device = useBreakpoint();
    const pointerCoords = useMapPointerCoordinates(!!tool);
    
    return (
        <>
            <Select
                layers={["creating"]}
                onSelect={(e) => {
                    e.target.getFeatures().clear(); 
                    props.onCreate && props.onCreate(e.mapBrowserEvent)
                }}
            />

            <VectorLayer
                id="creating"
                style={useCallback(() => {
                    switch (tool) {
                        case "PARKING": return parkingMarkerStyle(false, false, device, disappearZoom + 1); break;
                        case "WAYPOINT": return waypointMarkerStyle(false, false, device, disappearZoom + 1); break;
                        case 'ROCK': return boulderMarkerStyle(false, false, device, props.boulderOrder); break;
                    }
                }, [tool, device, props.boulderOrder])}
            >
                <VectorSource> 
                    {pointerCoords &&
						<Point
							key={"creating"}
							coordinates={pointerCoords}
						/>
					}
                </VectorSource>
            </VectorLayer>
        </>
    )
}

CreatingMarkersLayer.displayName = "ParkingMarkersLayer";