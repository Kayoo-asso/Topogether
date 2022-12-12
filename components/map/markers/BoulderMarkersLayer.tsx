import React, { useCallback, useEffect, useRef } from 'react';
import { Quark, QuarkArray, watchDependencies } from 'helpers/quarky';
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from 'ol/Feature';
import { Fill, Icon, Style, Text } from 'ol/style';
import { Boulder, UUID } from 'types';
import { singleClick } from "ol/events/condition";
import { useSelectStore } from 'components/pages/selectStore';
import { fromLonLat } from 'ol/proj';

interface BoulderMarkersLayerProps {
    boulders: QuarkArray<Boulder>;
	boulderOrder: Map<UUID, number>;
    draggable?: boolean;
}

export type BoulderMarkerData = {
	label: string;
	quark: Quark<Boulder>;
}

export const boulderMarkerStyle = (feature: FeatureLike, selected: boolean, anySelected: boolean) => {
    const { label } = feature.get("data") as BoulderMarkerData;

    const icon = new Icon({
        opacity: anySelected ? (selected ? 1 : 0.4) : 1,
        src: selected ? "/assets/icons/colored/_rock_bold.svg" : "/assets/icons/colored/_rock.svg",
        scale: 1,
    });
    const text = new Text({
        text: label,
        scale: 1.4,
        fill: new Fill({ color: "#04D98B" }),
        font: "Poppins",
        offsetY: 22,
    })
    return new Style({
        image: icon,
        text,
        // zIndex: 100
    });
}

export const BoulderMarkersLayer: React.FC<BoulderMarkersLayerProps> = watchDependencies(({
    draggable = false,
    ...props
}: BoulderMarkersLayerProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const selectedItem = useSelectStore((s) => s.item.value);

    const select = useSelectStore(s => s.select);
    const flush = useSelectStore(s => s.flush);


    // const boulderMarkerStyle = useCallback((feature: FeatureLike, selected: boolean, anySelected: boolean) => {
    //     const { label } = feature.get("data") as BoulderMarkerData;
    //     const { quark } = feature.get("data");
    //     const selectedB = selectedItem && selectedItem()
    //     const same = quark().id === selectedB?.id;
    //     // console.log(quark().id);
    //     // console.log(selectedB?.id)
 
    //     const icon = new Icon({
    //         opacity: anySelected ? (same ? 1 : 0.4) : 1,
    //         src: same ? "/assets/icons/colored/_rock_bold.svg" : "/assets/icons/colored/_rock.svg",
    //         scale: 1,
    //     });
    //     const text = new Text({
    //         text: label,
    //         scale: 1.4,
    //         fill: new Fill({ color: "#04D98B" }),
    //         font: "Poppins",
    //         offsetY: 22,
    //     })
    //     return new Style({
    //         image: icon,
    //         text,
    //         // zIndex: 100
    //     });
    // }, [selectedItem, selectedItem && selectedItem()]);


    return (
        <>
            {/* TODO: Drag Interaction */}

            <Select
                layers={["boulders"]}
                hitTolerance={5}
                style={(feature) => {
                    console.log("ici");
                    return boulderMarkerStyle(feature, true, true);
                }}
                onSelect={(ev) => {
                    // console.log(ev);
                    if (ev.selected.length === 1) {
                        const feature = ev.selected[0];
                        const { quark } = feature.get("data") as BoulderMarkerData;
                        select.boulder(quark);
                        // console.log("Selected boulder: ", quark());
                    } else if (ev.deselected.length === 1) {
                        // flush.item();
                    }
                }}
                condition={singleClick}
                toggleCondition={singleClick}
            />

            <VectorLayer
                id="boulders"     
                style={useCallback(
                    (feature) => boulderMarkerStyle (
                            feature,
                            false,
                            selectedType === "boulder"
                        )
                    , [selectedType])
                }
            >
                <VectorSource>
                    {props.boulders.quarks().map(bQuark => {
                        const b = bQuark();
                        const label = props.boulderOrder.get(b.id)! +
                            (process.env.NODE_ENV === "development" ? ". " + b.name : "")
                        return (
                            <Point
                                key={b.id}
                                coordinates={fromLonLat(b.location)}
                                data={{ quark: bQuark, label }}
                            />
                        )
                    })}
                </VectorSource>
            </VectorLayer>
        </>
    )
})

BoulderMarkersLayer.displayName = "BoulderMarkersLayer";