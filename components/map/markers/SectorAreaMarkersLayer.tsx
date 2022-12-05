import React, { useCallback } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
    Draw,
	Point,
	Polygon,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from 'ol/Feature';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { Sector } from 'types';
import { singleClick } from "ol/events/condition";
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';

interface SectorAreaMarkersLayerProps {
    sectors: QuarkArray<Sector>;
    draggable?: boolean;
    creating?: boolean;
}

export type SectorMarkerData = {
	label: string;
	quark: Quark<Sector>;
}

export function sectorMarkerStyle(selected: boolean) {
    const stroke = new Stroke({
        color: selected ? 'rgba(4, 217, 139, 0.7)' : 'rgba(4, 217, 139, 0.5)',
        width: 2,
        lineDash: [4,8],
        lineDashOffset: 6
    });
    const fill = new Fill({
        color: selected ? 'rgba(4, 217, 139, 0.3)' : 'rgba(0,0,0,0)',
    })
    return new Style({
        stroke,
        fill,
        // zIndex: 100
    });
}

const creatingSectorMarkerStyle = (feature: FeatureLike) => {
    const geometry = feature.getGeometry()!;
    console.log('geometry', geometry.getType());
    if (geometry.getType() === 'LineString') {
        const styles = [
            new Style({
                stroke: new Stroke({
                    color: 'rgba(4, 217, 139, 0.7)',
                    width: 2
                })
            })
        ];
        return styles;
    }
    if (geometry.getType() === 'Point') {
        const styles = [
            new Style({
                image: new Circle({
                    fill: new Fill({
                      color: 'rgb(4, 217, 139)'
                    }),
                    stroke: new Stroke({
                      color: "#fff",
                      width: 2
                    }),
                    radius: 5,
                })
            })
        ];
        return styles;
    }
    if (geometry.getType() === 'Polygon') {
        const styles = [
            new Style({
                stroke: new Stroke({
                    color: 'rgba(4, 217, 139, 0)',
                    width: 2
                }),
                fill: new Fill({
                    color: 'rgba(4, 217, 139, 0.3)'
                })
            })
        ];
        return styles;
    }
    return [];
}

export const SectorAreaMarkersLayer: React.FC<SectorAreaMarkersLayerProps> = watchDependencies(({
    draggable = false,
    creating = false,
    ...props
}: SectorAreaMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);

    return (
        <>
            {/* TODO: Drag Interaction */}

            <Select
                layers={["sectors"]}
                hitTolerance={5}
                style={function (feature) {
                    return sectorMarkerStyle(true);
                }}
                onSelect={(ev) => {
                    if (ev.selected.length === 1) {
                        const feature = ev.selected[0];
                    }
                }}
                toggleCondition={singleClick}
            />

            {creating &&
                <Draw 
                    source='sectors'
                    type='Polygon'
                    style={creatingSectorMarkerStyle}
                />
            }

            <VectorLayer
                id="sectors"     
                style={() => sectorMarkerStyle(false)}
            >
                <VectorSource>
                    {props.sectors.quarks().map(sQuark => {
                        const s = sQuark();
                        return (
                            <Polygon
                                coordinates={[s.path.map((p) => fromLonLat(p))]}
                                data={{ quark: sQuark }}
                            />
                        )
                    })}
                </VectorSource>
            </VectorLayer>
        </>
    )
})

SectorAreaMarkersLayer.displayName = "SectorAreaMarkersLayer";