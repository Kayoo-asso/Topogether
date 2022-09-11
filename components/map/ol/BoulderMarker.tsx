import { Quark } from "helpers/quarky";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import { Icon, Style, Text, Fill } from "ol/style";
import type { Options as IconOptions } from "ol/style/Icon";
import Feature from "ol/Feature";
import { useEffect, useState } from "react";
import type { Boulder, Topo, UUID } from "types";
import { useLayer, useMap, useSource } from "./Map";
import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";
import { text } from "node:stream/consumers";

type BoulderMarkerProps = {
	boulder: Quark<Boulder>;
	boulderOrder: Map<UUID, number>;
	selectedBoulder?: Quark<Boulder>;
	topo?: Quark<Topo>;
	draggable?: boolean;
	onClick?: (boulder: Quark<Boulder>) => void;
	onContextMenu?: (e: Event, boulder: Quark<Boulder>) => void;
};

const iconOptions: IconOptions = {
	size: [30, 30],
	anchor: [15, 34],
	anchorOrigin: "top-left",
	anchorXUnits: "pixels",
	anchorYUnits: "pixels",
};
const icon = new Icon({
	...iconOptions,
	src: "/assets/icons/colored/_rock.svg",
});

const selectedIcon = new Icon({
	...iconOptions,
	src: "/assets/icons/colored/_rock_bold.svg",
});

const font = "500 16px Poppins";
const selectedFont = "700 16px Poppins";

let interactionCreated = false;
let count = 0;

export function BoulderMarker(props: BoulderMarkerProps) {
	const map = useMap();
	const layer = useLayer("boulders");
	const source = useSource("boulders");
	const [feature, setFeature] = useState<Feature>();

	const boulder = props.boulder();
	// const selectedBoulder = props.selectedBoulder
	// 	? props.selectedBoulder()
	// 	: undefined;
	const nb = props.boulderOrder.get(boulder.id)!;
	let label = nb.toString();
	if (process.env.NODE_ENV === "development") {
		label += `. ${boulder.name}`;
	}

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
			const text = new Text({
				text: label,
				font,
				fill: new Fill({ color: "#04D98B" }),
			});
			const style = new Style({
				image: icon,
				text,
			});

			const center = new Point(fromLonLat(boulder.location));
			feature.setGeometry(center);
			feature.setStyle(style);
		}
	}, [feature, label, boulder.location]);

	// Select interaction
	useEffect(() => {
		if(count !== 3) {
			count++;
		}
		else if(!interactionCreated) {
			console.log("Creating select interaction with layer:", layer)
			interactionCreated = true;
			const selectedText = new Text({
				font: selectedFont,
			});
			const select = new Select({
				condition: click,
				// toggleCondition: click,
				style: new Style({
					image: selectedIcon,
					text: selectedText,
				}),
				layers: [layer],
			});
			map.addInteraction(select);
			select.on("select", (e) => {
				console.log("Select event:", e);
			});

			return () => {
				console.log("Removing select interaction")
				map.removeInteraction(select);
				interactionCreated = false;
			};
		}
	}, [map]);

	return null;
}
