import React, { useState } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import {
    Draw,
	Polygon,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from 'ol/Feature';
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { GeoCoordinates, Sector, Topo, UUID } from 'types';
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Polygon as PolygonType } from 'ol/geom';
import { createSector } from 'helpers/builder';
import { ModalRenameSector } from 'components/organisms/builder/ModalRenameSector';

interface SectorAreaMarkersLayerProps {
    topoQuark: Quark<Topo>,
	boulderOrder: Map<UUID, number>;
    creating?: boolean;
}

export function sectorMarkerStyle(selected: boolean) {
    const stroke = new Stroke({
        color: selected ? 'rgba(4, 217, 139, 0.7)' : 'rgba(4, 217, 139, 0.5)',
        width: 4,
        lineDash: [4,16],
        lineDashOffset: 20
    });
    const fill = new Fill({
        color: selected ? 'rgba(4, 217, 139, 0.3)' : 'rgba(0,0,0,0)',
    })
    return new Style({
        stroke,
        fill,
    });
}

const creatingSectorMarkerStyle = (feature: FeatureLike) => {
    const geometry = feature.getGeometry()!;
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

export const getPathFromFeature = (feature: FeatureLike) => {
    const poly = feature.getGeometry() as PolygonType | undefined;
    const coords: GeoCoordinates[] = poly!.getCoordinates()[0].map(c => {
        const lonlat = toLonLat(c);
        return [lonlat[0], lonlat[1]];
    });
    return coords;
}

// Events we need to handle (TODO)
// - window.keydown: ENTER or ESC
export const SectorAreaMarkersLayer: React.FC<SectorAreaMarkersLayerProps> = watchDependencies(({
    creating = false,
    ...props
}: SectorAreaMarkersLayerProps) => {
    const sectors = props.topoQuark().sectors;
    const flush = useSelectStore(s => s.flush);

    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();

    return (
        <>
            {creating &&
                <Draw 
                    source='sectors'
                    type='Polygon'
                    style={creatingSectorMarkerStyle}
                    onDrawEnd={(e) => {
                        const path = getPathFromFeature(e.feature);
                        const newSector = createSector(
							props.topoQuark,
							path,
							props.boulderOrder
						);
                        setSectorToRename(() => newSector);
                    }}
                />
            }

            <VectorLayer
                id="sectors"     
                style={() => sectorMarkerStyle(false)}
            >
                <VectorSource>
                    {sectors.quarks().map(sQuark => {
                        const s = sQuark();
                        return (
                            <Polygon
                                key={s.id}
                                coordinates={[s.path.map((p) => fromLonLat(p))]}
                                data={{ type: 'sector', value: sQuark }}
                            />
                        )
                    })}
                </VectorSource>
            </VectorLayer>

            {sectorToRename &&
				<ModalRenameSector 
					sector={sectorToRename}
					firstNaming
					onClose={() => {
						flush.tool();
						setSectorToRename(undefined);
					}}
				/>
			}
        </>
    )
})

SectorAreaMarkersLayer.displayName = "SectorAreaMarkersLayer";