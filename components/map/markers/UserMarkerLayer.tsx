import React, { useCallback } from "react";
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
	Circle,
	useMap,
} from "components/openlayers";
import { Fill, Stroke, Style, Circle as CircleStyle } from "ol/style";
import { GeoCoordinates } from "types";
import { fromLonLat } from "ol/proj";
import { SelectEvent } from "ol/interaction/Select";
import { usePosition } from "helpers/hooks/UserPositionProvider";

interface UserMarkerLayerProps {
	onClick?: (pos: GeoCoordinates | null) => void;
}

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

export const UserMarkerLayer: React.FC<UserMarkerLayerProps> = (
	props: UserMarkerLayerProps
) => {
	let { position, accuracy } = usePosition();
	// Hook of react-openlayers to get the map, when it loads
	const map = useMap();
	// We need to convert the accuracy in meters to a distance in the map's projection
	const projection = map?.getView().getProjection();
	const metersPerUnit = projection?.getMetersPerUnit();
	if (metersPerUnit && accuracy) {
		accuracy = accuracy / metersPerUnit;
	} else {
		accuracy = 0;
	}

	return (
		<>
			<Select
				layers={["user"]}
				hitTolerance={1}
				onSelect={useCallback(
					(e: SelectEvent) => {
						e.mapBrowserEvent.stopPropagation();
						e.mapBrowserEvent.preventDefault();
						props.onClick && props.onClick(position);
						e.target.getFeatures().clear();
					},
					[position]
				)}
			/>

			<VectorLayer id="accuracy">
				<VectorSource>
					{position && !!accuracy && (
						<Circle
							center={fromLonLat(position)}
							radius={accuracy}
							style={accuracyMarkerStyle}
						/>
					)}
				</VectorSource>
			</VectorLayer>

			<VectorLayer id="user">
				<VectorSource>
					{position && (
						<Point coordinates={fromLonLat(position)} style={userMarkerStyle} />
					)}
				</VectorSource>
			</VectorLayer>
		</>
	);
};

UserMarkerLayer.displayName = "UserMarkerLayer";
