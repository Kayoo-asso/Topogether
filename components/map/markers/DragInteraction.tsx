import { useSelectStore } from "components/store/selectStore";
import { useCallback } from "react";
import { SelectedItem } from "components/store/selectStore";
import { GeoCoordinates, Topo, UUID } from "types";
import { Drag } from "components/openlayers/interactions/Drag";
import PointGeom from "ol/geom/Point";
import { toLonLat } from "ol/proj";
import { getPathFromFeature } from "./SectorAreaMarkersLayer";
import { boulderChanged, sectorChanged } from "helpers/builder";
import { Quark, watchDependencies } from "helpers/quarky";
import { boulderMarkerStyle } from "./BoulderMarkersLayer";
import { DragEvent } from "components/openlayers/extensions/DragInteraction";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";


interface DragInteractionProps {
    topoQuark: Quark<Topo>;
    boulderOrder: globalThis.Map<UUID, number>;
}

export const DragInteraction: React.FC<DragInteractionProps> = watchDependencies((props: DragInteractionProps) => {
    const selectedItem = useSelectStore((s) => s.item.value);
    const selectedType = useSelectStore((s) => s.item.type);
    const anySelected = !!(selectedType !== 'none' && selectedType !== 'sector');

    const bp = useBreakpoint();

    return (
        <Drag 
            sources={["boulders", "parkings", "waypoints", "sectors"]}
            hitTolerance={5}
            startCondition={useCallback((e) => { 
                const id = e.feature.get("data")?.value().id as UUID;
                return !!(selectedItem && selectedItem().id === id); 
            }, [selectedItem])}
            onDragEnd={useCallback((e: DragEvent) => {
                const item = e.feature.get("data") as SelectedItem;
                const point = e.feature.getGeometry() as PointGeom;
                const coords = toLonLat(point.getCoordinates());
                const location = [coords[0], coords[1]] as GeoCoordinates;
                switch (item.type) {
                    case 'boulder': 
                        item.value.set((b) => ({ ...b, location }));
                        boulderChanged(props.topoQuark, item.value().id, location);
                        boulderMarkerStyle(true, anySelected, bp, props.boulderOrder, e.feature)
                        break;
                    case 'parking': item.value.set((p) => ({ ...p, location })); break;
                    case 'waypoint': item.value.set((w) => ({ ...w, location })); break;
                    case 'sector':
                        const path = getPathFromFeature(e.feature);
                        item.value.set(s => ({ ...s, path: path }));
                        sectorChanged(props.topoQuark, item.value().id, props.boulderOrder);
                        break;
                    default: return;
                }
            }, [props.topoQuark, props.boulderOrder, anySelected, bp])}
        />
    )
});

DragInteraction.displayName = 'DragInteraction';