import {
	Circle,
	Point,
	VectorLayer,
	VectorSource,
	useMap,
} from "~/components/openlayers";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import React from "react";
import { usePosition } from "~/components/providers/UserPositionProvider";
import { get as getProjection } from "ol/proj";

const userMarkerStyle = new Style({
	image: new CircleStyle({
		radius: 6,
		fill: new Fill({
			color: "#4EABFF",
		}),
		stroke: new Stroke({
			color: "white",
			width: 2,
		}),
	}),
	zIndex: 5,
});

const accuracyMarkerStyle = new Style({
	zIndex: 2,
	fill: new Fill({
		color: "rgba(31, 67, 100, 0.3)",
	}),
});

export function UserMarker() {
	let { position, accuracy } = usePosition();
	// We need to convert the accuracy in meters to the lon/lat projection of the map
	const projection = getProjection("EPSG:4326")!;
	const metersPerUnit = projection.getMetersPerUnit();
	if (metersPerUnit && accuracy) {
		accuracy = accuracy / metersPerUnit;
	} else {
		accuracy = 0;
	}

	return (
		<>
			<VectorLayer id="accuracy">
				<VectorSource>
					{position && !!accuracy && (
						<Circle
							center={position}
							radius={accuracy}
							style={accuracyMarkerStyle}
						/>
					)}
				</VectorSource>
			</VectorLayer>

			<VectorLayer id="user">
				<VectorSource>
					{position && <Point coordinates={position} style={userMarkerStyle} />}
				</VectorSource>
			</VectorLayer>
		</>
	);
}

UserMarker.displayName = "UserMarkerLayer";
