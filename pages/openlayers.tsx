import { Map } from "components/openlayers/Map";
import { View } from "components/openlayers/View";
import { OSM } from "components/openlayers/sources/OSM";
import { TileLayer } from "components/openlayers/layers/TileLayer";
import { useEffect, useState } from "react";
import { VectorLayer, VectorSource } from "components/openlayers";
import { fontainebleauLocation } from "helpers/constants";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { BaseMap } from "components/map/openlayers/BaseMap";

const boulderMarkerStyle = new Style({
	image: new Icon({
		src: "/assets/icons/colored/_rock_bold.svg",
	}),
});

export default function Page() {
	const [zoom, setZoom] = useState(2);
	// useEffect(() => {
	// 	setTimeout(() => {
	// 		console.log("Setting zoom");
	// 		setZoom(zoom === 2 ? 6 : 2);
	// 	}, 2000);
	// });
	return (
		<BaseMap center={[0,0]} zoom={zoom} className="w-[1200px] h-[600px] bg-white">
		</BaseMap>
	);
}
