import React, { useCallback } from "react";
import { Quark, QuarkArray, watchDependencies } from "helpers/quarky";
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from "ol/Feature";
import { Fill, Icon, Style, Text } from "ol/style";
import { Boulder, UUID } from "types";
import { useSelectStore } from "components/pages/selectStore";
import { fromLonLat } from "ol/proj";
import { Cluster } from "components/openlayers/sources/Cluster";
import { Breakpoint, useBreakpoint } from "helpers/hooks";
import { singleClick } from "ol/events/condition";
import { removePreviouslySelected } from "components/openlayers/interactions/Select";

interface BoulderMarkersLayerProps {
	boulders: QuarkArray<Boulder>;
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
	bouldersNb?: number
) => {
	const label = feature
		? feature.get("data").label
		: (bouldersNb! + 1).toString();
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
			const select = useSelectStore((s) => s.select);
			const flush = useSelectStore((s) => s.flush);

			const device = useBreakpoint();

			return (
				<>
					{/* {draggable && (
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
								if (data)
									data.quark.set((b) => ({
										...b,
										location: [coords[0], coords[1]],
									}));
							}}
						/>
					)} */}

					<Select
						layers={["boulders"]}
						hitTolerance={5}
						onSelect={(e) => {
							// Avoid selecting something in another layer
							// TODO: fix by having only a single Select interaction
							e.mapBrowserEvent.stopPropagation();
							removePreviouslySelected(e);
							if (e.selected.length > 0) {
								const selected = e.selected[0];
								const data = selected.get("data") as BoulderMarkerData;
								select.boulder(data.quark);
							} else if (e.deselected.length === 1) {
								flush.item();
							}
						}}
						style={useCallback(
							function (feature) {
								return boulderMarkerStyle(true, true, device, feature);
							},
							[device]
						)}
						// Necessary to register single clicks outside any feature
						// Toggle when clicking again
						toggleCondition={singleClick}
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
								return boulderMarkerStyle(
									false,
									selectedType !== "none",
									device,
									feature
								);
							},
							[selectedType, device]
						)}
					>
						<VectorSource>
							{props.boulders.quarks().map((bQuark) => {
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
