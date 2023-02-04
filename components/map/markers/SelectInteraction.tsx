import { Select } from "components/openlayers";
import { removePreviouslySelected } from "components/openlayers/interactions/Select";
import { useSelectStore } from "components/pages/selectStore";
import { singleClick } from "ol/events/condition";
import { useCallback } from "react";
import { boulderMarkerStyle } from "./BoulderMarkersLayer";
import { SelectedItem } from "components/pages/selectStore";
import { FeatureLike } from "ol/Feature";
import { UUID } from "types";
import { parkingMarkerStyle } from "./ParkingMarkersLayer";
import { useMapZoom } from "helpers/hooks/useMapZoom";
import { disappearZoom, waypointMarkerStyle } from "./WaypointMarkersLayer";
import { sectorMarkerStyle } from "./SectorAreaMarkersLayer";
import { watchDependencies } from "helpers/quarky";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { OnClickFeature } from "components/openlayers/extensions/OnClick";

interface SelectInteractionProps {
    boulderOrder: Map<UUID, number>;
    selectableSector?: boolean;
}

export const SelectInteraction: React.FC<SelectInteractionProps> = watchDependencies(({
    selectableSector = false,
    ...props
}: SelectInteractionProps) => {
    const selectedItem = useSelectStore((s) => s.item);
    const anySelected = !!(selectedItem.type !== 'none' && selectedItem.type !== 'sector');

    const select = useSelectStore((s) => s.select);
    const flush = useSelectStore((s) => s.flush);

    const device = useBreakpoint();
    const mapZoom = useMapZoom(disappearZoom);    

    return (
        <>
        <OnClickFeature 
            layers={["parkings", "waypoints", selectableSector ||true ? "sectors" : "", "boulders"]}
            onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                const item = e.feature.get("data") as SelectedItem;
                console.log(item);
                if (item.value && selectedItem.value && item.value().id === selectedItem.value().id) flush.all();
                else switch (item.type) {
                    case 'boulder': select.boulder(item.value); break;
                    case 'parking': select.parking(item.value); break;
                    case 'waypoint': select.waypoint(item.value); break;
                    case 'sector': select.sector(item.value); break;
                    //TODO : add clusters
                    default: return;
                }
            }}
        />

        <Select 
            layers={[]}
            hitTolerance={5}
            onSelect={(e) => {
                // Avoid selecting something in another layer
                removePreviouslySelected(e);
                if (e.selected.length > 0) {
                    const selected = e.selected[0];
                    const item = selected.get("data") as SelectedItem;
                    // console.log(item);
                    switch (item.type) {
                        case 'boulder': select.boulder(item.value); break;
                        case 'parking': select.parking(item.value); break;
                        case 'waypoint': select.waypoint(item.value); break;
                        case 'sector': select.sector(item.value); break;
                        default: return;
                    }                 
                } else if (e.deselected.length === 1) {
                    flush.item();
                }
            }}
            style={useCallback((feature: FeatureLike, resolution: number) => {
                const item = feature.get("data");
                switch (item.type) {
                    case 'boulder': return boulderMarkerStyle(true, anySelected, device, props.boulderOrder, feature); break;
                    case 'parking': return parkingMarkerStyle(true, anySelected, device, mapZoom); break;
                    case 'waypoint': return waypointMarkerStyle(true, anySelected, device, mapZoom); break;
                    case 'sector': return sectorMarkerStyle(true, feature, resolution); break;
                    default: return;
                }  
            }, [device, mapZoom, anySelected, props.boulderOrder])}
            // Necessary to register single clicks outside any feature
            // Toggle when clicking again
            toggleCondition={singleClick}
        />
        </>
    )
});

SelectInteraction.displayName = 'SelectInteraction';