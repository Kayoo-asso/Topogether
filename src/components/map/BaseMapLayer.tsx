import { TileLayer, XYZ } from "~/components/openlayers";
import { env } from "~/env.mjs";

interface BaseMapProps {
	satelliteView?: boolean;
}

const token = env.NEXT_PUBLIC_MAPBOX_TOKEN;
const attributions =
	'© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> ' +
	'© <a href="https://www.openstreetmap.org/copyright">' +
	"OpenStreetMap contributors</a>";

export function BaseMapLayer({ satelliteView }: BaseMapProps) {
	return (
		<TileLayer>
			<XYZ
				attributions={attributions}
				url={
					satelliteView
						? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
						: `https://api.mapbox.com/styles/v1/erwinkn/clbs8clin005514qrc9iueujg/tiles/512/{z}/{x}/{y}@2x?access_token=${token}`
				}
				// IMPORTANT
				tilePixelRatio={2}
				tileSize={512}
			/>
		</TileLayer>
	);
}
