import { Map } from "components/openlayers/Map";
import { View } from "components/openlayers/View";
import { OSM } from "components/openlayers/OSM";
import { fromLonLat } from "ol/proj";

// minX, minY, maxX, maxY
// and transform from lat/lon to Web Mercator
const USBoundingBox = [-124.848974, 24.396308, -66.885444, 49.384358];

const USCenter = fromLonLat([
	(USBoundingBox[0] + USBoundingBox[2]) / 2,
	(USBoundingBox[1] + USBoundingBox[3]) / 2,
]);

export default function Page() {
	return (
		<View center={USCenter} zoom={4}>
			<Map>
				<OSM />
			</Map>
		</View>
	);
}
