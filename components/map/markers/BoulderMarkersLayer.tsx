import React, { useCallback } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from "ol/Feature";
import { Fill, Icon, Style, Text } from "ol/style";
import { Boulder, GeoCoordinates, Topo, UUID } from "types";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { fromLonLat, toLonLat } from "ol/proj";
import { Cluster } from "components/openlayers/sources/Cluster";
import { Breakpoint, useBreakpoint } from "helpers/hooks";
import PointGeom from "ol/geom/Point";
import { boulderChanged } from "helpers/builder";
import { Drag } from "components/openlayers/interactions/Drag";

interface BoulderMarkersLayerProps {
	topo: Quark<Topo>;
	boulderOrder: globalThis.Map<UUID, number>;
	draggable?: boolean;
}

export const boulderMarkerStyle = (
	selected: boolean,
	anySelected: boolean,
	device: Breakpoint,
	boulderOrder: globalThis.Map<UUID, number>,
	feature?: FeatureLike,
) => {
	const label = feature
		? boulderOrder.get(feature.get("data").value().id)?.toString()
		: (boulderOrder.size + 1).toString();

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
									const bId = feature.get("data").value().id as UUID;
									return !!(selectedItem && selectedItem().id === bId);
								},
								[selectedItem]
							)}
							onDragEnd={(e) => {
								const data = e.feature.get("data") as SelectedBoulder;
								const point = e.feature.getGeometry() as PointGeom;
								const coords = toLonLat(point.getCoordinates());
								const loc = [coords[0], coords[1]] as GeoCoordinates;
								if (data) {
									data.value.set((b) => ({
										...b,
										location: loc,
									}));
									boulderChanged(props.topo!, data.value().id, loc);
								}
							}}
						/>
					)}

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
								return boulderMarkerStyle(
									false,
									selectedType !== "none",
									device,
									props.boulderOrder,
									feature
								);
							},
							[selectedType, device]
						)}
					>
						<VectorSource>
							{props.topo().boulders.quarks().map((bQuark) => {
								const b = bQuark();
								return (
									<Point
										key={b.id}
										coordinates={fromLonLat(b.location)}
										data={{ type: 'boulder', value: bQuark }}
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
