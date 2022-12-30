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

interface CreatingMarkersLayerProps {
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
                onSelect={(e) => props.onCreate && props.onCreate(e.mapBrowserEvent)}
            />

            <VectorLayer
                id="creating"
                style={useCallback(() => {
                    const style = 
                        tool === 'PARKING' ? parkingMarkerStyle : 
                        tool === 'WAYPOINT' ? waypointMarkerStyle :
                        tool === 'ROCK' ? boulderMarkerStyle :
                        undefined;
                    if (style) return style(false, false, device, disappearZoom + 1, undefined);
                }, [tool, device])}
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