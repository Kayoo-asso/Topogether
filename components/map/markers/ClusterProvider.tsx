import { MarkerClusterer, Cluster } from "@googlemaps/markerclusterer";
import { createContext, useContext, useMemo, useEffect } from "react";
import { useMap } from "..";

const ClusterContext = createContext<MarkerClusterer | undefined>(undefined);

export function useCluster() {
	return useContext(ClusterContext);
}

type ClusterProviderProps = React.PropsWithChildren<{}>;

export function ClusterProvider({ children }: ClusterProviderProps) {
	const map = useMap();

	const cluster = useMemo(() => {
		// const clusterMarkerIcon:  google.maps.Icon = {
		//     url: '/assets/icons/colored/_rock_bold.svg',
		//     scaledSize: markerSize(50),
		//     labelOrigin: new google.maps.Point(25, 30)
		// }

		const mainIcon: google.maps.Symbol = {
			path: window.google.maps.SymbolPath.CIRCLE,
			scale: 18,
			fillOpacity: 1,
			fillColor: "#04D98B",
			strokeColor: "white",
			strokeWeight: 2,
		};

		const renderer = {
			render: ({ count, position }: Cluster) =>
				new google.maps.Marker({
					icon: mainIcon,
					label: {
						text: String(count),
						color: "#ffffff",
						fontWeight: "500",
						fontSize: "14px",
					},
					position,
					// adjust zIndex to be above other markers
					zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
				}),
		};

		return new MarkerClusterer({ map, markers: [], renderer: renderer });
	}, []);

	// Clean up on unmount;
	useEffect(() => () => cluster.setMap(null), []);

	return (
		<ClusterContext.Provider value={cluster}>
			{children}
		</ClusterContext.Provider>
	);
}
