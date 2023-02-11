import React, { useCallback, useState } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import {
    Draw,
	Polygon,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from 'ol/Feature';
import { Circle, Fill, Stroke, Style, Text } from 'ol/style';
import { GeoCoordinates, Sector, SectorData, Topo, UUID } from 'types';
import { SelectedSector, useSelectStore } from 'components/pages/selectStore';
import { fromLonLat, toLonLat } from 'ol/proj';
import { MultiPoint, Polygon as PolygonType } from 'ol/geom';
import { createSector } from 'helpers/builder';
import { ModalRenameSector } from 'components/organisms/builder/ModalRenameSector';
import { DrawEvent } from 'ol/interaction/Draw';
import CircleStyle from 'ol/style/Circle';
import { Coordinate } from 'ol/coordinate';

interface SectorAreaMarkersLayerProps {
    topoQuark: Quark<Topo>,
	boulderOrder: Map<UUID, number>;
    creating?: boolean;
}

export function sectorMarkerStyle(selected: boolean, feature: FeatureLike, resolution: number) {
    const font = '600 ' + Math.min(20, 36 / resolution) + 'px Poppins';
    // const sector = feature.get('data').value() as SectorData;
    const data = feature.get('data');
    if (!data) return;
    const sector = data.value() as SectorData;

    const polygonStyle = new Style({
        stroke: new Stroke({
            color: selected ? 'rgba(4, 217, 139, 0.9)' : 'rgba(4, 217, 139, 0.7)',
            width: 4,
            lineJoin: 'round',
            lineDash: selected ? undefined : [10, 18],
        }),
        fill: new Fill({
            color: selected ? 'rgba(4, 217, 139, 0.3)' : 'rgba(0,0,0,0)',
        }),
        text: new Text({
            text: sector.name,          
            // textAlign: 'right',
            placement: 'line',
            textBaseline: 'bottom',
            font,
            fill: new Fill({
                color: selected ? 'rgba(4, 217, 139, 0.9)' : 'rgba(4, 217, 139, 0.7)',
            }),
        }),
    });

    //TODO: display and make sector modifiable when selected on Builder
    const pointsStyle = new Style({
        image: new CircleStyle({
            radius: selected && false ? 5 : 0, //Del the 'false' when TODO
            fill: new Fill({
              color: '#fff',
            }),
            stroke: new Stroke({
                color: 'rgba(4, 217, 139, 0.9)',
            })
          }),
          geometry: function () {
            // const coordinates = feature.getGeometry()?.getCoordinates()[0];
            const poly = feature.getGeometry() as PolygonType | undefined;
            const coordinates: Coordinate[] = poly!.getCoordinates()[0];
            return new MultiPoint(coordinates);
          },
    })
    return [polygonStyle, pointsStyle];
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

export const SectorAreaMarkersLayer: React.FC<SectorAreaMarkersLayerProps> = watchDependencies(({
    creating = false,
    ...props
}: SectorAreaMarkersLayerProps) => {
    const selectedItem = useSelectStore(s => s.item);
    const sectors = props.topoQuark().sectors;
    const flush = useSelectStore(s => s.flush);

    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();

    const handleDrawEnd = useCallback((e: DrawEvent) => {
        const path = getPathFromFeature(e.feature);
        const newSector = createSector(
            props.topoQuark,
            path,
            props.boulderOrder
        );
        setSectorToRename(() => newSector);
    }, [props.topoQuark, props.boulderOrder]);

    return (
        <>
            {creating &&
                <Draw 
                    source='sectors'
                    type='Polygon'
                    style={creatingSectorMarkerStyle}
                    onDrawEnd={handleDrawEnd}
                />
            }

            <VectorLayer
                id="sectors"     
                style={useCallback((f: FeatureLike, res: number) => {
                    const item = f.get("data") as SelectedSector;
                    const selected = selectedItem.value ? item.value().id === selectedItem.value().id : false;
                    return sectorMarkerStyle(selected, f, res)
                }, [selectedItem])}
                updateWhileAnimating
                updateWhileInteracting
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