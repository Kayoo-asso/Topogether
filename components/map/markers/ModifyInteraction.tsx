import { SelectedSector, useSelectStore } from "components/store/selectStore";
import { useCallback } from "react";
import { Topo, UUID } from "types";
import { Modify } from "components/openlayers/interactions/Modify";
import { getPathFromFeature } from "./SectorAreaMarkersLayer";
import { sectorChanged } from "helpers/builder";
import { Quark, watchDependencies } from "helpers/quarky";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { ModifyEvent } from "ol/interaction/Modify";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style } from "ol/style";

interface ModifyInteractionProps {
    topoQuark: Quark<Topo>;
    boulderOrder: globalThis.Map<UUID, number>;
}

const modifyingSectorMarkerStyle = (feature: FeatureLike) => {
	const geometry = feature.getGeometry()!;
	if (geometry.getType() === "Point") {
		const styles = [
			new Style({
				image: new Circle({
					fill: new Fill({
						color: "rgb(4, 217, 139)",
					}),
					stroke: new Stroke({
						color: "#fff",
						width: 2,
					}),
					radius: 5,
				}),
			}),
		];
		return styles;
	}
	return [];
};

export const ModifyInteraction: React.FC<ModifyInteractionProps> = watchDependencies((props: ModifyInteractionProps) => {
    const selectedType = useSelectStore((s) => s.item.type);
    const anySelected = !!(selectedType !== 'none' && selectedType !== 'sector');

    const bp = useBreakpoint();

    return (
        <Modify 
            collection="selectedSector"
            snapToPointer
            pixelTolerance={10}
            style={modifyingSectorMarkerStyle}
            onModifyEnd={useCallback((e: ModifyEvent) => {
                const feature = e.features.getArray()[0];
                const item = feature.get("data") as SelectedSector;
                const newPath = getPathFromFeature(feature);
                item.value.set(s => ({ ...s, path: newPath }));
                sectorChanged(props.topoQuark, item.value().id, props.boulderOrder);
            }, [props.topoQuark, props.boulderOrder, anySelected, bp])}
        />
    )
});

ModifyInteraction.displayName = 'ModifyInteraction';