import React, { useCallback } from "react";
import { Quark, QuarkArray, watchDependencies } from "helpers/quarky";
import {
	Point,
	Select,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import Feature, { FeatureLike } from "ol/Feature";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { Boulder, UUID } from "types";
import { useSelectStore } from "components/pages/selectStore";
import { fromLonLat, toLonLat } from "ol/proj";
import { Drag } from "components/openlayers/interactions/Drag";
import { Cluster } from "components/openlayers/sources/Cluster";
import CircleStyle from "ol/style/Circle";
import { Breakpoint, useBreakpoint } from "helpers/hooks";

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
	feature: FeatureLike,
	selected: boolean,
	anySelected: boolean, 
	device: Breakpoint
) => {
	const { label } = feature.get("data") as BoulderMarkerData;
	const icon = new Icon({
		opacity: anySelected ? (selected ? 1 : 0.4) : 1,
		src: "/assets/icons/markers/boulder.svg",
		scale: device === 'desktop' ? 0.8 : 1,
	});
	const text = new Text({
		text: label,
		fill: new Fill({
			color: anySelected
				? selected
					? "#04D98B"
					: "rgba(4, 217, 139, 0.3)"
				: "#04D98B",
		}),
		font: "14px Poppins",
		offsetY: 32,
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
		offsetY: 3
	})
	return new Style({
		image: icon,
		text,
	});
}

export const BoulderMarkersLayer: React.FC<BoulderMarkersLayerProps> = watchDependencies(({ draggable = false, ...props }: BoulderMarkersLayerProps) => {
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
							const bId = e.feature.get("data").quark().id as UUID;
							return !!(selectedItem && selectedItem().id === bId);
						},
						[selectedItem]
					)}
					onDragEnd={(e) => {
						const newLoc = toLonLat(e.mapBrowserEvent.coordinate);
						const { quark } = e.feature.get("data") as BoulderMarkerData;
						quark.set((b) => ({
							...b,
							location: [newLoc[0], newLoc[1]],
						}));
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
						const cluster = e.selected[0];
						const clusterFeatures = cluster.get('features');
						if(clusterFeatures.length === 1) {
							const feature = clusterFeatures[0];
							const { quark } = feature.get("data") as BoulderMarkerData;
							select.boulder(quark);
						} else {
							// TODO: zoom into the cluster?
						}
					} else if (e.deselected.length === 1) {
						flush.item();
					}
				}}
			/>

			<VectorLayer
				id="boulders"
				style={useCallback((cluster) => {
					// TODO: fix this, by ensuring the layer does not get a simple VectorSource before the Cluster
					const features = cluster.get("features") as Array<FeatureLike> | undefined;
					const size = features?.length || 0;
					// Cluster style
					if (size > 1) return clusterMarkerStyle(size);
					else {
						const feature = features ? features[0] : cluster;
						const bId = feature.get("data").quark().id as UUID;
						return boulderMarkerStyle(
							feature,
							selectedItem ? selectedItem().id === bId : false,
							selectedType !== "none",
							device
						);
					}
				}, [selectedType, selectedItem])}
			>
				<Cluster
					minDistance={10}
					distance={30}
				/>
				<VectorSource>
					{props.boulders.quarks().map((bQuark) => {
						const b = bQuark();
						const label =
							props.boulderOrder.get(b.id)! +
							(process.env.NODE_ENV === "development" ? ". " + b.name : "");
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
});

BoulderMarkersLayer.displayName = "BoulderMarkersLayer";
