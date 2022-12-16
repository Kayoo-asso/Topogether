import React, { useCallback } from 'react';
import { watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from 'ol/style';
import { GeoCoordinates, LightTopo, TopoTypes, UUID } from 'types';
import { fromLonLat } from 'ol/proj';
import { TopoTypeToColor } from 'helpers/topo';

type TopoForMarkers = LightTopo | { id: UUID, type: TopoTypes, location: GeoCoordinates };

interface TopoMarkersLayerProps {
    topos: TopoForMarkers[];
    selectedTopo?: LightTopo;
    draggable?: boolean;
    onTopoSelect?: (topo?: TopoForMarkers) => void,
    onDragEnd?: (topoId: TopoForMarkers, newLocation: GeoCoordinates) => void,
}

export type TopoMarkerData = {
	label: string;
	topo: LightTopo;
}

export const topoMarkerStyle = (topo: LightTopo, selected: boolean, anySelected: boolean) => {
    // console.log(topo.type)
    const icon = new Icon({
        opacity: anySelected ? (selected ? 1 : 0.4) : 1,
        src: "/assets/icons/colored/waypoint/_" +
            TopoTypeToColor(topo.type) +
            ".svg",
        scale: 2,
    });
    return new Style({
        image: icon,
        zIndex: 100
    });
}

export const TopoMarkersLayer: React.FC<TopoMarkersLayerProps> = watchDependencies(({
    draggable = false,
    ...props
}: TopoMarkersLayerProps) => {
       
    return (
        <>
            {/* TODO: Drag Interaction */}

            <Select
                layers={["topos"]}
                hitTolerance={5}
                onSelect={(e) => {
                    e.target.getFeatures().clear();
                    e.mapBrowserEvent.stopPropagation();
                    e.mapBrowserEvent.preventDefault();
                    if (e.selected.length === 1) {
                        const feature = e.selected[0];
                        const { topo } = feature.get("data") as TopoMarkerData;
                        props.onTopoSelect && props.onTopoSelect(topo);
                    } else if (e.deselected.length === 1) {
                        props.onTopoSelect && props.onTopoSelect(undefined);
                    }
                }}
            />

            <VectorLayer
                id="topos"
                className='topos'
                style={useCallback(
                    (feature) => {
                        const { topo } = feature.get("data");
                        return topoMarkerStyle (
                            topo,
                            props.selectedTopo?.id === topo.id,
                            !!props.selectedTopo
                        )}
                    , [props.selectedTopo])
                }
            >
                <VectorSource>
                    {props.topos.map(t => {
                        return (
                            <Point
                                key={t.id}
                                coordinates={fromLonLat(t.location)}
                                data={{ topo: t }}
                            />
                        )
                    })}
                </VectorSource>
            </VectorLayer>
        </>
    )
})

TopoMarkersLayer.displayName = "TopoMarkersLayer";