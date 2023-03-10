import React, { useCallback, useEffect } from 'react';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
    useMap,
} from "components/openlayers";
import { useSelectStore } from 'components/store/selectStore';
import { MapBrowserEvent } from 'ol';
import { useMapPointerCoordinates } from 'helpers/hooks/useMapPointerCoordinates';
import { parkingMarkerStyle } from './ParkingMarkersLayer';
import { disappearZoom, waypointMarkerStyle } from './WaypointMarkersLayer';
import { boulderMarkerStyle } from './BoulderMarkersLayer';
import { useBreakpoint } from 'helpers/hooks/DeviceProvider';
import { useBoulderOrder } from 'components/store/boulderOrderStore';
import { topoMarkerStyle } from './TopoMarkersLayer';
import { TopoTypes } from 'types';

interface CreatingMarkersLayerProps {
    topoType?: TopoTypes; // Leave this for RootNew which does not have any TopoTypeContext
    onCreate?: (e: MapBrowserEvent<MouseEvent>) => void;
}

export const CreatingMarkersLayer: React.FC<CreatingMarkersLayerProps> = (props: CreatingMarkersLayerProps) => {
    const tool = useSelectStore(s => s.tool);
    const bp = useBreakpoint();
    const pointerCoords = useMapPointerCoordinates(!!tool);

    const boulderOrder = useBoulderOrder(bo => bo.value);

    const map = useMap();
    useEffect(() => {
        const handleTouchCreation = (e: MapBrowserEvent<any>) => {
            props.onCreate && props.onCreate(e);
        }
        map.on('click', handleTouchCreation);
        return () => map.un('click', handleTouchCreation);
    }, [map, tool]); //Important to keep tool here !!
    
    return (
        <>
            <Select
                layers={["creating"]}
                onSelect={(e) => {
                    e.target.getFeatures().clear(); 
                }}
            />

            <VectorLayer
                id="creating"
                style={useCallback(() => {
                    switch (tool) {
                        case "PARKING": return parkingMarkerStyle(false, false, bp, disappearZoom + 1); break;
                        case "WAYPOINT": return waypointMarkerStyle(false, false, bp, disappearZoom + 1); break;
                        case 'ROCK': return boulderMarkerStyle(false, false, bp, boulderOrder); break;
                        case 'TOPO': return topoMarkerStyle(props.topoType!, false, false); break;
                    }
                }, [tool, bp, boulderOrder, props.topoType])}
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

CreatingMarkersLayer.displayName = "CreatingMarkersLayer";