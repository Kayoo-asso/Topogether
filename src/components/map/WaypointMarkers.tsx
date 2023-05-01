import { getBreakpoint } from "../providers/DeviceProvider";
import { FeatureLike } from "ol/Feature";
import { Icon, Style } from "ol/style";
import { useUUIDQueryParam } from "~/helpers/queryParams";
import { Parking, Waypoint } from "~/types";
import { VectorLayer, VectorSource, Point } from "~/components/openlayers";
import { useCallback } from "react";
import { useZoomThreshold } from "~/helpers/map";

export const waypointZoomThreshold = 14;

// Parkings and waypoint markers are identical, they just have different icons.
type Props =
	| {
			parkings: Parking[];
			waypoints?: undefined;
	  }
	| {
			parkings?: undefined;
			waypoints: Waypoint[];
	  };

export type WaypointMarkerData =
	| {
			type: "parking";
			value: Parking;
	  }
	| { type: "waypoint"; value: Waypoint };

const icons = {
	parking: "/assets/icons/markers/parking.svg",
	waypoint: "/assets/icons/markers/info.svg",
};

export function WaypointMarkers(props: Props) {
	const [selected] = useUUIDQueryParam("selected");
	const threshold = useZoomThreshold(waypointZoomThreshold);
	const type = props.parkings ? "parking" : "waypoint";
	const items = props.parkings || props.waypoints;
	return (
		<VectorLayer
			id="parkings"
			style={useCallback(
				(feature: FeatureLike) => {
					const data = feature.get("data") as WaypointMarkerData;
					const breakpoint = getBreakpoint();
					const item = data.value;
					let opacity;
					if (threshold === "below") {
						opacity = 0;
					} else if (!!selected && selected !== item.id) {
						// When another marker is selected
						opacity = 0.4;
					} else {
						opacity = 1;
					}
					return new Style({
						image: new Icon({
							opacity,
							src: icons[type],
							scale: breakpoint.isDesktop ? 0.7 : 0.8,
						}),
						zIndex: 100,
					});
				},
				[selected, threshold]
			)}
		>
			<VectorSource>
				{items.map((item) => (
					<Point
						key={item.id}
						coordinates={item.location}
						data={{
							type,
							value: item,
						}}
					/>
				))}
			</VectorSource>
		</VectorLayer>
	);
}
