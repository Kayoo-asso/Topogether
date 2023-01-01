import { Select } from "components/openlayers";
import { removePreviouslySelected } from "components/openlayers/interactions/Select";
import { useSelectStore } from "components/pages/selectStore";
import { useBreakpoint } from "helpers/hooks";
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

interface SelectInteractionProps {
    boulderOrder: globalThis.Map<UUID, number>;
    selectableSector?: boolean;
}

export const SelectInteraction: React.FC<SelectInteractionProps> = ({
    selectableSector = false,
    ...props
}: SelectInteractionProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const mustDisappear = !!(selectedType !== 'none' && selectedType !== 'sector');
    const select = useSelectStore((s) => s.select);
    const flush = useSelectStore((s) => s.flush);

    const device = useBreakpoint();
    const mapZoom = useMapZoom(disappearZoom);

    return (
        <Select 
            layers={["boulders", "parkings", "waypoints", selectableSector ? "sectors" : ""]}
            hitTolerance={5}
            onSelect={(e) => {
                // Avoid selecting something in another layer
                // TODO: fix by having only a single Select interaction
                e.mapBrowserEvent.stopPropagation();
                removePreviouslySelected(e);
                if (e.selected.length > 0) {
                    const selected = e.selected[0];
                    const item = selected.get("data") as SelectedItem;
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
            style={useCallback((feature: FeatureLike) => {
                const item = feature.get("data");
                switch (item.type) {
                    case 'boulder': return boulderMarkerStyle(true, mustDisappear, device, props.boulderOrder, feature); break;
                    case 'parking': return parkingMarkerStyle(true, mustDisappear, device, mapZoom); break;
                    case 'waypoint': return waypointMarkerStyle(true, mustDisappear, device, mapZoom); break;
                    case 'sector': return sectorMarkerStyle(true); break;
                    default: return;
                }  
            }, [device, mapZoom, mustDisappear])}
            // Necessary to register single clicks outside any feature
            // Toggle when clicking again
            toggleCondition={singleClick}
        />
    )
}