import { Map } from "components/openlayers/Map";
import { View } from "components/openlayers/View";
import { OSM } from "components/openlayers/OSM";
import { TileLayer } from "components/openlayers/TileLayer";
import { useEffect, useState } from "react";
import { VectorLayer, VectorSource } from "components/openlayers";
import { Point } from "components/openlayers/Point";
import { fontainebleauLocation } from "helpers/constants";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";

export default function Page() {
	const [zoom, setZoom] = useState(2);
	useEffect(() => {
		setTimeout(() => {
			console.log("Setting zoom")
			setZoom(zoom === 2 ? 6 : 2);
		}, 2000);
	});
	return (
		<View center={[0, 0]} zoom={zoom}>
			<Map className="h-[600px] w-[1200px]">
				<TileLayer>
					<OSM />
				</TileLayer>
				<VectorLayer>
					<VectorSource>
						<Point coordinates={fontainebleauLocation} style={new Style({
							image: new Icon({
								src: "/assets/icons/colored/_rock_bold.svg"
							})
						})}/>
					</VectorSource>
				</VectorLayer>
			</Map>
		</View>
	);
}
