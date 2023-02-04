import React, { useCallback } from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import {
	Point,
	VectorLayer,
	VectorSource,
} from "components/openlayers";
import { FeatureLike } from "ol/Feature";
import { Fill, Icon, Style, Text } from "ol/style";
import { Boulder, UUID } from "types";
import { SelectedBoulder, useSelectStore } from "components/pages/selectStore";
import { fromLonLat } from "ol/proj";
import { Cluster } from "components/openlayers/sources/Cluster";
import { Breakpoint, useBreakpoint } from "helpers/hooks/DeviceProvider";

interface BoulderMarkersLayerProps {
	boulders: Quark<Boulder>[];
	boulderOrder: globalThis.Map<UUID, number>;
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
	// console.log(label);
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
		offsetX: -1,
	});
	return new Style({
		image: icon,
		text,
		zIndex: 100,
	});
};
export const clusterMarkerStyle = (selected: boolean, anySelected: boolean, size: number) => {
	const icon = new Icon({
		opacity: anySelected ? (selected ? 1 : 0.4) : 1,
		src: "/assets/icons/markers/clusterBoulder.svg",
		scale: 0.8,
	});
	const text = new Text({
		text: size.toString(),
		fill: new Fill({
			color: anySelected
			? selected
				? "#fff"
				: "rgba(255, 255, 255, 0.3)"
			: "#fff",
		}),
		font: "bold 26px Poppins",
		offsetY: 3,
	});
	return new Style({
		image: icon,
		text,
	});
};

export const BoulderMarkersLayer: React.FC<BoulderMarkersLayerProps> = watchDependencies((props: BoulderMarkersLayerProps) => {
	const selectedItem = useSelectStore(s => s.item);
	const selectedType = selectedItem.type;
	const anySelected = !!(selectedType !== 'none' && selectedType !== 'sector');

	const device = useBreakpoint();

	return (
		<>
			<VectorLayer
				id="clusters"
				style={useCallback((cluster: FeatureLike) => {
					const features: FeatureLike[] = cluster.get("features");
					let selected = false;
					// If there is a selectedItem and the cluster contains the selected item, the clust must be selected also
					if (selectedType === "boulder") {
						if (features.some(f => f.get("data").value().id === selectedItem.value!().id)) selected = true;
					}
					if (features.length > 1) {
						return clusterMarkerStyle(
							selected,
							anySelected,
							features.length
						);
					}
				}, [selectedItem, selectedItem.value && selectedItem.value(), selectedType, anySelected])}		
			>
				<Cluster source="boulders" minDistance={20} distance={60} />
			</VectorLayer>

			<VectorLayer
				id="boulders"
				style={useCallback(
					(f: FeatureLike) => {
						const item = f.get("data") as SelectedBoulder;
                        const selected = selectedItem.value ? item.value().id === selectedItem.value().id : false;
						return boulderMarkerStyle(
							selected,
							anySelected,
							device,
							props.boulderOrder,
							f
						);
					},
					[device, anySelected, props.boulderOrder]
				)}
			>
				<VectorSource>
					{props.boulders.map((bQuark) => {
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
});

BoulderMarkersLayer.displayName = "BoulderMarkersLayer";
