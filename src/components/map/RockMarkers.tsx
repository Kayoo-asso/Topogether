import { useUUIDQueryParam } from "~/helpers/queryParams";
import { Rock, Sector, UUID } from "~/types";
import { useTopoDoc } from "../providers/TopoDocProvider";
import {
	Point,
	VectorLayer,
	VectorSource,
	Cluster,
} from "~/components/openlayers";
import { useCallback } from "react";
import { type FeatureLike } from "ol/Feature";
import { Fill, Icon, Style, Text } from "ol/style";
import { getBreakpoint } from "../providers/DeviceProvider";

interface Props {
	rocks: Rock[];
}

export interface RockMarkerData {
	type: "rock";
	value: Rock;
}

export function RockMarkers({ rocks }: Props) {
	const [selected, ] = useUUIDQueryParam("selected");
	const { sectors } = useTopoDoc();
	const order = rockOrder(rocks, sectors);

	return (
		<>
			<VectorLayer
				id="clusters"
				style={useCallback(
					(cluster: FeatureLike) => {
						const features: FeatureLike[] = cluster.get("features");
						const rockIds = features.map(
							(f) => f.get("data").value.id
						) as UUID[];
						const isSelected = selected && rockIds.includes(selected);
						// The markers are all solid if no item is selected.
						// If an item is selected, only the marker containing that item gets a solid color.
						const anySelected = !!selected;
						const solid = !anySelected || isSelected;
						const icon = new Icon({
							opacity: solid ? 1 : 0.4,
							src: "/assets/icons/markers/clusterBoulder.svg",
							scale: 0.6,
						});
						const text = new Text({
							text: features.length.toString(),
							fill: new Fill({
								color: solid ? "#fff" : "rgba(255, 255, 255, 0.3)",
							}),
							font: "bold 20px Poppins",
							offsetY: 3,
						});
						return new Style({
							image: icon,
							text,
						});
					},
					[selected]
				)}
			>
				<Cluster source="boulders" minDistance={20} distance={60} />
			</VectorLayer>

			<VectorLayer
				id="boulders"
				style={useCallback(
					(f: FeatureLike) => {
						const data = f.get("data") as RockMarkerData;
						const rock = data.value;

						const isSelected = rock.id === selected;
						// The markers are all solid if no item is selected.
						// If an item is selected, only the marker containing that item gets a solid color.
						const anySelected = !!selected;
						const solid = !anySelected || isSelected;
						const label = order.get(rock.id)!.toString();
						return boulderMarkerStyle(label, solid);
					},
					[selected]
				)}
			>
				<VectorSource>
					{rocks.map((rock) => (
						<Point
							key={rock.id}
							coordinates={rock.location}
							data={{ type: "rock", value: rock } satisfies RockMarkerData}
						/>
					))}
				</VectorSource>
			</VectorLayer>
		</>
	);
}

function rockOrder(rocks: Rock[], sectors: Sector[]) {
	const rocksBySector = new Map<UUID, Rock[]>();

	const rocksWithoutSector: Rock[] = [];
	for (const rock of rocks) {
		if (!rock.sectorId) {
			rocksWithoutSector.push(rock);
		} else {
			let list = rocksBySector.get(rock.sectorId);
			if (!list) {
				list = [];
				rocksBySector.set(rock.sectorId, list);
			}
			list.push(rock);
		}
	}

	const boulderOrder = new Map<UUID, number>();

	sectors.sort((s1, s2) => s1.index - s2.index);
	let idx = 0;
	for (const sector of sectors) {
		const list = rocksBySector.get(sector.id)!;
		for (const rock of list) {
			boulderOrder.set(rock.id, idx);
			idx += 1;
		}
	}
	for (const rock of rocksWithoutSector) {
		boulderOrder.set(rock.id, idx);
		idx += 1;
	}
	return boulderOrder;
}

export function boulderMarkerStyle(label: string, solid: boolean) {
	const bp = getBreakpoint();
	const icon = new Icon({
		opacity: solid ? 1 : 0.4,
		src: "/assets/icons/markers/boulder.svg",
		scale: bp.isDesktop ? 0.9 : 1,
	});
	const text = new Text({
		text: label,
		fill: new Fill({
			color: solid ? "#343644" : "rgba(52, 54, 68, 0.3)",
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
}
