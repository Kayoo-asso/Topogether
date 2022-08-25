import { Quark } from "helpers/quarky";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style, Text, Fill } from "ol/style";
import Feature from "ol/Feature";
import { useEffect, useState } from "react";
import type { Boulder, Topo, UUID } from "types";
import { useLayer, useMap, useSource } from "./Map";
import Select from "ol/interaction/Select";

type BoulderMarkerProps = {
	boulder: Quark<Boulder>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder?: Quark<Boulder>;
	topo?: Quark<Topo>;
	draggable?: boolean;
	onClick?: (boulder: Quark<Boulder>) => void;
	onContextMenu?: (e: Event, boulder: Quark<Boulder>) => void;
};

const style = new Style({
	
})

export function BoulderMarker(props: BoulderMarkerProps) {
	const layer = useLayer("boulders");
	const source = useSource("boulders");
	const [feature, setFeature] = useState<Feature>();

	const boulder = props.boulder();
	const selectedBoulder = props.selectedBoulder
		? props.selectedBoulder()
		: undefined;
	const selected = selectedBoulder?.id === boulder.id;
	const src = selected
		? "/assets/icons/colored/_rock_bold.svg"
		: "/assets/icons/colored/_rock.svg";
	const nb = props.boulderOrder.get(boulder.id)!;
	let label = nb.toString();
	if (process.env.NODE_ENV === "development") {
		label += `. ${boulder.name}`;
	}
	const fontWeight = selected ? "700" : "500";
	const font = `${fontWeight} 16px Poppins`;

	// Create an empty feature
	// Location + styles will be set in the next useEffect
	// That way we only depend on markerSource in this effect
	useEffect(() => {
		const feature = new Feature({
			geometry: new Point([0, 0]),
		});
		source.addFeature(feature);
		setFeature(feature);
		return () => source.removeFeature(feature);
	}, [source]);

	// Update
	useEffect(() => {
		if (feature) {
			const icon = new Icon({
				src,
				size: [30, 30],
				anchor: [15, 34],
				anchorOrigin: "top-left",
				anchorXUnits: "pixels",
				anchorYUnits: "pixels",
			});
			const text = new Text({
				text: label,
				font,
				fill: new Fill({ color: "#04D98B" }),
			});
			const style = new Style({
				image: icon,
				text,
			});

			const select = new Select({});

			feature.setGeometry(new Point(fromLonLat(boulder.location)));
			feature.setStyle(style);
		}
	}, [feature, font, label, src, boulder.location]);

	return null;
}
