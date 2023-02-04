import { useSelectStore } from "components/pages/selectStore";
import { SelectedItem } from "components/pages/selectStore";
import { watchDependencies } from "helpers/quarky";
import { OnClickFeature } from "components/openlayers/extensions/OnClick";
import { useMap } from "components/openlayers";
import { FeatureLike } from "ol/Feature";
import { Boulder } from "types";
import { getBouldersExtent } from "helpers/map/getExtent";

interface OnClickInteractionProps {
    selectableSector?: boolean;
}

export const OnClickInteraction: React.FC<OnClickInteractionProps> = watchDependencies(({
    selectableSector = false,
}: OnClickInteractionProps) => {
    const selectedItem = useSelectStore((s) => s.item);
    const map = useMap();

    const select = useSelectStore((s) => s.select);
    const flush = useSelectStore((s) => s.flush);

    return (
        <>
            <OnClickFeature 
                layers="clusters"
                hitTolerance={5}
                onClick={(e) => {
                    const boulderFeatures = e.feature.get("features") as FeatureLike[];
                    const boulders = boulderFeatures.map(f => f.get("data").value() as Boulder);
                    const extent = getBouldersExtent(boulders, 60);
                    if (extent) map.getView().fit(extent, { duration: 300 });
                }} 
            />
            <OnClickFeature 
                layers={["boulders", "parkings", "waypoints", selectableSector ||true ? "sectors" : ""]}
                hitTolerance={5}
                onClick={(e) => {
                    const item = e.feature.get("data") as SelectedItem;
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
        </>
    )
});

OnClickInteraction.displayName = 'OnClickInteraction';