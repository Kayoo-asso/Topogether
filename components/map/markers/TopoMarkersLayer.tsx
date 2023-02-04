import React, { useCallback } from "react";
import { watchDependencies } from "helpers/quarky";
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { Icon, Style } from "ol/style";
import { GeoCoordinates, LightTopo, TopoTypes, UUID } from "types";
import { fromLonLat, toLonLat } from "ol/proj";
import { TopoTypeToColor } from "helpers/topo";
import { Drag } from "components/openlayers/interactions/Drag";
import { OnClickFeature } from "components/openlayers/extensions/OnClick";
import { FeatureLike } from "ol/Feature";

type TopoForMarkers =
	| LightTopo
	| { id: UUID; type: TopoTypes; location: GeoCoordinates };

interface TopoMarkersLayerProps {
	topos: TopoForMarkers[];
	selectedTopo?: LightTopo;
	draggable?: boolean;
	onTopoSelect?: (topo?: TopoForMarkers) => void;
	onDragEnd?: (topoId: UUID, newLocation: GeoCoordinates) => void;
}

export type TopoMarkerData = {
	label: string;
	topo: LightTopo;
};

export const topoMarkerStyle = (
	topo: LightTopo,
	selected: boolean,
	anySelected: boolean
) => {
	const icon = new Icon({
		opacity: anySelected ? (selected ? 1 : 0.4) : 1,
		src: "/assets/icons/markers/topo/" + TopoTypeToColor(topo.type) + ".svg",
		scale: 0.8,
	});
	return new Style({
		image: icon,
		zIndex: 100,
	});
};

export const TopoMarkersLayer: React.FC<TopoMarkersLayerProps> =
	watchDependencies(
		({ draggable = false, ...props }: TopoMarkersLayerProps) => {
      // Used for both the vector layer and Select
			const topoStyle = useCallback(
				(feature) => {
					const { topo } = feature.get("data");
					return topoMarkerStyle(
						topo,
						props.selectedTopo?.id === topo.id,
						!!props.selectedTopo
					);
				},
				[props.selectedTopo]
			);

			return (
				<>
					{draggable && (
						<Drag
							sources="topos"
							hitTolerance={5}
							onDragEnd={(e) => {
								const newLoc = toLonLat(e.mapBrowserEvent.coordinate);
								const { topo } = e.feature.get("data") as TopoMarkerData;
								props.onDragEnd &&
									props.onDragEnd(topo.id, [newLoc[0], newLoc[1]]);
							}}
						/>
					)}

					<OnClickFeature
						layers={["topos"]}
						onClick={useCallback((e) => {
							const { topo } = e.feature.get("data") as TopoMarkerData;
							if (topo.id === props.selectedTopo?.id) props.onTopoSelect && props.onTopoSelect(undefined);
							else props.onTopoSelect && props.onTopoSelect(topo);
						}, [props.selectedTopo])}
					/>

					<VectorLayer
						id="topos"
						style={topoStyle}
					>
						<VectorSource>
							{props.topos.map((t) => {
								return (
									<Point
										key={t.id}
										coordinates={fromLonLat(t.location)}
										data={{ topo: t }}
									/>
								);
							})}
						</VectorSource>
					</VectorLayer>
				</>
			);
		}
	);

TopoMarkersLayer.displayName = "TopoMarkersLayer";
