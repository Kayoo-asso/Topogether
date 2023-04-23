import { FeatureLike } from "ol/Feature";
import { Icon, Style } from "ol/style";
import React, { useCallback } from "react";
import { GeoCoordinates, LightTopo, TopoTypes, UUID } from "types";
import { Point, VectorLayer, VectorSource } from "~/components/openlayers";
import { OnClickFeature } from "~/components/openlayers/extensions/OnClick";
import { topoColors } from "~/helpers/colors";
import { useWorldMapStore } from "~/stores/worldmapStore";
import { filterTopos } from "./TopoFilters";

type TopoInfo = { id: UUID; type: TopoTypes; location: GeoCoordinates };

interface TopoMarkersProps {
	topos: TopoInfo[];
}

export type TopoMarkerData = {
	// label: string;
	topo: LightTopo;
};

export const topoMarkerStyle = (
	topoType: TopoTypes,
	selected: boolean,
	anySelected: boolean
) => {
	const icon = new Icon({
		opacity: anySelected ? (selected ? 1 : 0.4) : 1,
		src: "/assets/icons/markers/topo/" + topoColors[topoType] + ".svg",
		scale: 0.8,
	});
	return new Style({
		image: icon,
		zIndex: 100,
	});
};

// Only used in the world map
export function TopoInteractions() {
	const selected = useWorldMapStore((s) => s.selectedTopo);
	const selectTopo = useWorldMapStore((s) => s.selectTopo);
	return (
		<OnClickFeature
			layers="topos"
			hitTolerance={5}
			onClick={useCallback(
				(e) => {
					const { topo } = e.feature.get("data") as TopoMarkerData;
					if (topo.id !== selected) {
						selectTopo(topo.id);
					} else {
						selectTopo(undefined);
					}
				},
				[selected, selectTopo]
			)}
		/>
	);
}

// Used in the world map + topo creation screen
export function TopoMarkers(props: TopoMarkersProps) {
	// Always false during topo creation
	const selected = useWorldMapStore((s) => s.selectedTopo);
	const style = useCallback(
		(feature: FeatureLike) => {
			const { topo } = feature.get("data") as TopoMarkerData;
			const isSelected = topo.id === selected;
			const anySelected = !!selected;
			const shadowed = anySelected && !isSelected;

			const icon = new Icon({
				opacity: shadowed ? 0.4 : 1,
				src: "/assets/icons/markers/topo/" + topoColors[topo.type] + ".svg",
				scale: 0.8,
			});
			return new Style({
				image: icon,
				zIndex: 100,
			});
		},
		[selected]
	);
	return (
		<VectorLayer id="topos" style={style}>
			<VectorSource>
				{props.topos.map((t) => {
					return (
						<Point key={t.id} coordinates={t.location} data={{ topo: t }} />
					);
				})}
			</VectorSource>
		</VectorLayer>
	);
}
