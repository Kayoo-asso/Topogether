import { SelectedSector } from "components/store/selectStore";
import { Topo } from "types";
import { Modify } from "components/openlayers/interactions/Modify";
import { getPathFromFeature } from "./SectorAreaMarkersLayer";
import { sectorChanged } from "helpers/builder";
import { Quark, watchDependencies } from "helpers/quarky";
import { ModifyEvent } from "ol/interaction/Modify";
import { FeatureLike } from "ol/Feature";
import { Circle, Fill, Stroke, Style } from "ol/style";
import { useBoulderOrder } from "components/store/boulderOrderStore";

interface ModifyInteractionProps {
    topoQuark: Quark<Topo>;
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
    const boulderOrder = useBoulderOrder(bo => bo.value);

    const handleModifyEnd = (e: ModifyEvent) => {
        const feature = e.features.getArray()[0];
        const item = feature.get("data") as SelectedSector;
        const newPath = getPathFromFeature(feature);
        item.value.set(s => ({ ...s, path: newPath }));
        sectorChanged(props.topoQuark, item.value().id, boulderOrder);
    }

    return (
        <Modify 
            collection="selectedSector"
            snapToPointer
            pixelTolerance={10}
            style={modifyingSectorMarkerStyle}
            onModifyEnd={handleModifyEnd}
            deleteCondition={(e) => {
                if (
                    (e.type === 'click' && e.originalEvent.altKey) 
                    || (e.type === 'pointerup' && e.originalEvent.longPress)
                ) {
                    return true;
                }
                return false;
            }}
        />
    )
});

ModifyInteraction.displayName = 'ModifyInteraction';