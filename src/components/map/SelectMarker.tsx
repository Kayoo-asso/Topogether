import { useUUIDQueryParam } from "~/helpers/queryParams";
import type { RockMarkerData } from "./RockMarkers";
import type { WaypointMarkerData } from "./WaypointMarkers";
import { OnClickFeature } from "~/components/openlayers/extensions/OnClick";
import { FeatureLike } from "ol/Feature";
import { useMap } from "../openlayers";
import { Rock } from "~/types";
import { getRocksExtent } from "~/helpers/map";

export function SelectMarker() {
	const [selected, setSelected] = useUUIDQueryParam("selected");
	const map = useMap();

	return (
		<>
			<OnClickFeature
				layers={["clusters"]}
				hitTolerance={5}
				onClick={(e) => {
					const features = e.feature.get("features") as FeatureLike[];
					const rockMarkers = features.map(
						(f) => f.get("data") as RockMarkerData
					);
					const extent = getRocksExtent(
						rockMarkers.map((x) => x.value),
						60
					);
					if (extent) {
						map.getView().fit(extent, { duration: 300 });
					}
				}}
			/>
			<OnClickFeature
				layers={["waypoints", "boulders"]}
				hitTolerance={5}
				onClick={(e) => {
					const item = e.feature.get("data") as
						| RockMarkerData
						| WaypointMarkerData;
					setSelected(item.value.id);
				}}
			/>
		</>
	);
}
