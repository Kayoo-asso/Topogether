import React, { useCallback, useState } from 'react';
import { Quark, watchDependencies } from 'helpers/quarky';
import {
    Draw,
	Polygon,
	Select,
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
import { Drag } from 'components/openlayers/interactions/Drag';

interface SectorAreaMarkersLayerProps {
    topoQuark: Quark<Topo>,
	boulderOrder: Map<UUID, number>;
    draggable?: boolean;
    selectable?: boolean;
    creating?: boolean;
}

export type SectorMarkerData = {
	label: string;
	quark: Quark<Sector>;
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
        zIndex: 10
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

const getPathFromFeature = (feature: FeatureLike) => {
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
    draggable = false,
    selectable = false,
    creating = false,
    ...props
}: SectorAreaMarkersLayerProps) => {
    const sectors = props.topoQuark().sectors;
    const flush = useSelectStore(s => s.flush);

    const [selected, setSelected] = useState<UUID>();
    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();

    return (
        <>
            {draggable &&
                <Drag 
                    sources='sectors'
                    hitTolerance={5}
                    startCondition={useCallback((e) => { 
                        const sId = e.feature.get("data").quark().id as UUID;
                        return (selected === sId); 
                    }, [selected])}
                    onDragEnd={(e) => {
                        const path = getPathFromFeature(e.feature);
                        const { quark } = e.feature.get("data") as SectorMarkerData;
                        quark.set(s => ({
                            ...s,
                            path: path,
                        }))
                    }}
                />
            }

            {selectable &&
                <Select
                    layers={["sectors"]}
                    hitTolerance={5}
                    style={function (feature) {
                        return sectorMarkerStyle(true);
                    }}
                    onSelect={(e) => {
                        e.mapBrowserEvent.stopPropagation();
                        e.mapBrowserEvent.preventDefault();
                        flush.item();
                        if (e.selected.length === 1) {
                            const feature = e.selected[0];
                            const { quark } = feature.get("data") as SectorMarkerData;
                            setSelected(quark().id);
                        }
                    }}
                />
            }

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
                                data={{ quark: sQuark }}
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