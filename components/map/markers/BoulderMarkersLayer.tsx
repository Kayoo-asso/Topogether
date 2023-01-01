import React, { useCallback } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from "ol/Feature";
import { Fill, Icon, Style, Text } from "ol/style";
import { Boulder, GeoCoordinates, Topo, UUID } from "types";
import { useSelectStore } from "components/pages/selectStore";
import { fromLonLat, toLonLat } from "ol/proj";
import { Drag } from "components/openlayers/interactions/Drag";
import { Cluster } from "components/openlayers/sources/Cluster";
import { Breakpoint, useBreakpoint } from "helpers/hooks";
import PointGeom from "ol/geom/Point";
import { boulderChanged } from "helpers/builder";

interface BoulderMarkersLayerProps {
	topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	draggable?: boolean;
}

export type BoulderMarkerData = {
	label: string;
	quark: Quark<Boulder>;
};

export const boulderMarkerStyle = (
	selected: boolean,
	anySelected: boolean,
	device: Breakpoint,
	feature?: FeatureLike,
	bouldersNb?: number,
) => {
	const label = feature ? feature.get("data").label : (bouldersNb! + 1).toString();
	const icon = new Icon({
		opacity: anySelected ? (selected ? 1 : 0.4) : 1,
		src: "/assets/icons/markers/boulder.svg",
		scale: device === "desktop" ? 1 : 1.2,
	});
	const text = new Text({
		text: label,
		fill: new Fill({
			color: anySelected
				? selected
					? "#343644"
					: "rgba(52, 54, 68, 0.3)"
				: "#343644",
		}),
		font: "bold 11px Poppins",
		offsetY: 7,
	});
	return new Style({
		image: icon,
		text,
		zIndex: 100,
	});
};
export const clusterMarkerStyle = (size: number) => {
	const icon = new Icon({
		src: "/assets/icons/markers/clusterBoulder.svg",
		scale: 0.8,
	});
	const text = new Text({
		text: size.toString(),
		fill: new Fill({
			color: "#343644",
		}),
		font: "bold 26px Poppins",
		offsetY: 3,
	});
	return new Style({
		image: icon,
		text,
	});
};

export const BoulderMarkersLayer: React.FC<BoulderMarkersLayerProps> =
	watchDependencies(
		({ draggable = false, ...props }: BoulderMarkersLayerProps) => {
			const selectedType = useSelectStore((s) => s.item.type);
			const selectedItem = useSelectStore((s) => s.item.value);
			const select = useSelectStore((s) => s.select);
			const flush = useSelectStore((s) => s.flush);

			const device = useBreakpoint();

			return (
				<>
					{draggable && (
						<Drag
							sources="boulders"
							hitTolerance={5}
							startCondition={useCallback(
								(e) => {
									const feature = e.feature;
									const bId = feature.get("data").quark().id as UUID;
									return !!(selectedItem && selectedItem().id === bId);
								},
								[selectedItem]
							)}
							onDragEnd={(e) => {
								const data = e.feature.get("data") as BoulderMarkerData;
								const point = e.feature.getGeometry() as PointGeom;
								const coords = toLonLat(point.getCoordinates());
								const loc = [coords[0], coords[1]] as GeoCoordinates;
								if (data) {
									data.quark.set((b) => ({
										...b,
										location: loc,
									}));
									boulderChanged(props.topo!, data.quark().id, loc);
								}
							}}
						/>
					)}

					<Select
						layers={["boulders"]}
						hitTolerance={5}
						onSelect={(e) => {
							e.target.getFeatures().clear();
							e.mapBrowserEvent.stopPropagation();
							e.mapBrowserEvent.preventDefault();
							if (e.selected.length === 1) {
								// Because we're using Cluster, the feature in the selection is a cluster of features
								const feature = e.selected[0];
								const data = feature.get("data") as BoulderMarkerData;
								select.boulder(data.quark);
							} else if (e.deselected.length === 1) {
								flush.item();
							}
						}}
					/>

					<VectorLayer
						style={useCallback((cluster: FeatureLike) => {
							const features = cluster.get("features");
							if (features.length > 1) {
								return clusterMarkerStyle(features.length);
							}
						}, [])}
					>
						<Cluster source="boulders" minDistance={10} distance={30} />
					</VectorLayer>

					<VectorLayer
						id="boulders"
						style={useCallback(
							(feature: FeatureLike) => {
								const bId = feature.get("data").quark().id as UUID;
								return boulderMarkerStyle(
									selectedItem ? selectedItem().id === bId : false,
									selectedType !== "none",
									device,
									feature
								);
							},
							[selectedType, selectedItem, device]
						)}
					>
						<VectorSource>
							{props.topo().boulders.quarks().map((bQuark) => {
								const b = bQuark();
								const label = props.boulderOrder.get(b.id)?.toString();
								return (
									<Point
										key={b.id}
										coordinates={fromLonLat(b.location)}
										data={{ quark: bQuark, label }}
									/>
								);
							})}
						</VectorSource>
					</VectorLayer>

					{/* Context Menu TODO */}
					{/* <VectorLayer
		id="boulder-controls"
		style={new Style({
			image: new Icon({
				size: [70, 70],
				offset: [-15, 0],
				src: '/assets/icons/colored/_rock_bold.svg',
			})
		})}
	>
		<VectorSource>
			{props.boulders.map(b => {
				if (selectedItem && b.id === selectedItem().id) return (
					<Point
						coordinates={fromLonLat(b.location)}
					/>
				)
			})}
		</VectorSource>
	</VectorLayer> */}
				</>
			);
		}
	);

BoulderMarkersLayer.displayName = "BoulderMarkersLayer";
