import CenterIcon from "assets/icons/center.svg";
import { fromLonLat } from "ol/proj";
import { Map } from "ol";
import { Quark, watchDependencies } from "helpers/quarky";
import { Topo } from "types";
import { Extent, containsCoordinate } from "ol/extent";
import { Coordinate } from "ol/coordinate";
import { usePosition } from "helpers/hooks/UserPositionProvider";
import { RoundButton } from "components/atoms/buttons/RoundButton";
import { DEFAULT_EXTENT_BUFFER, getTopoExtent } from "helpers/map/getExtent";

interface CenterButtonProps {
	map: Map | null;
	topo?: Quark<Topo>;
}

const centerOnUser = (map: Map, pos: Coordinate) =>
	map.getView().setCenter(pos);
const fitOnTopo = (map: Map, extent: Extent) =>
	map.getView().fit(extent, { duration: 300 });

export const CenterButton: React.FC<CenterButtonProps> = watchDependencies(
	(props: CenterButtonProps) => {
		const { position } = usePosition();
		const extent = props.topo
			? getTopoExtent(props.topo(), DEFAULT_EXTENT_BUFFER)
			: null;
		const activated = props.map && (position || extent);

		const handleClick = () => {
			if (!props.map) return;
			if (position) {
				const pos = fromLonLat(position);
				// If it's a topo or the builder
				if (props.topo) {
					const extent = getTopoExtent(props.topo(), DEFAULT_EXTENT_BUFFER);
					// If the user is inside the topo, we center on him
					if (containsCoordinate(extent, pos)) centerOnUser(props.map, pos);
					else fitOnTopo(props.map, extent);
				}
				// If it's the world map
				else centerOnUser(props.map, pos);
			} else {
				if (props.topo) {
					const extent = getTopoExtent(props.topo(), DEFAULT_EXTENT_BUFFER);
					fitOnTopo(props.map, extent);
				}
			}
		};

		return (
			<RoundButton onClick={handleClick}>
				<CenterIcon
					className={`h-7 w-7 ${
						activated
							? "fill-main stroke-main"
							: "fill-grey-light stroke-grey-light"
					}`}
				/>
			</RoundButton>
		);
	}
);

CenterButton.displayName = "CenterButton";
