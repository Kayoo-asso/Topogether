import { SelectedSector, useSelectStore } from "components/pages/selectStore";
import { useCallback } from "react";
import { Topo, UUID } from "types";
import { Modify } from "components/openlayers/interactions/Modify";
import { getPathFromFeature } from "./SectorAreaMarkersLayer";
import { sectorChanged } from "helpers/builder";
import { Quark, watchDependencies } from "helpers/quarky";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { ModifyEvent } from "ol/interaction/Modify";
import { Snap } from "components/openlayers/interactions/Snap";


interface ModifyInteractionProps {
    topoQuark: Quark<Topo>;
    boulderOrder: globalThis.Map<UUID, number>;
}

export const ModifyInteraction: React.FC<ModifyInteractionProps> = watchDependencies((props: ModifyInteractionProps) => {
    const selectedItem = useSelectStore((s) => s.item.value);
    const selectedType = useSelectStore((s) => s.item.type);
    const anySelected = !!(selectedType !== 'none' && selectedType !== 'sector');

    const bp = useBreakpoint();

    return (
        <> 
            {/* TODO : finish this by preventing non-selected sectors to be modified */}
            <Modify 
                collection="selectedSector"
                onModifyEnd={useCallback((e: ModifyEvent) => {
                    const feature = e.features.getArray()[0];
                    const item = feature.get("data") as SelectedSector;
                    if (selectedItem && item.value().id === selectedItem().id) {
                        const newPath = getPathFromFeature(feature);
                        item.value.set(s => ({ ...s, path: newPath }));
                        sectorChanged(props.topoQuark, item.value().id, props.boulderOrder);
                    }
                }, [props.topoQuark, props.boulderOrder, anySelected, bp])}
            />
            {/* <Snap 
                source="sectors"
            /> */}
        </>
    )
});

ModifyInteraction.displayName = 'ModifyInteraction';