import {
	Map,
	View,
	TileLayer,
	XYZ,
} from "components/openlayers";
import { Coordinate } from "ol/coordinate";

interface BaseMapProps {
	center: Coordinate;
	zoom: number;
	className?: string;
	// add more props here, to pass as needed
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";

export function BaseMap({
	...props
}: React.PropsWithChildren<BaseMapProps>) {
	return (
		<View center={props.center} zoom={props.zoom}>
			<Map>
				{/* <MapboxVector
					styleUrl="mapbox://styles/mapbox/outdoors-v11"
					accessToken={MAPBOX_TOKEN}
				/> */}
				<TileLayer>
					<XYZ
						attributions={attributions}
						url={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_TOKEN}`}
						// IMPORTANT
						tilePixelRatio={2}
						tileSize={512}
					/>
				</TileLayer>

				{props.children}
			</Map>
		</View>
	);
}
