import { useUUIDQueryParam } from "~/helpers/queryParams";
import { Rock, Sector } from "~/types";
import { useTopoDoc } from "../providers/TopoDocProvider";
import { UUID } from "crypto";

interface Props {
	rocks: Rock[];
}

export function RockMarkers({ rocks }: Props) {
	const [selected, setSelected] = useUUIDQueryParam("selected");
	const anySelected = !!selected;
	const { sectors } = useTopoDoc();
}

function boulderOrder(rocks: Rock[], sectors: Sector[]) {
	sectors.sort((s1, s2) => s1.index - s2.index);
  const bouldersBySector = new Map<UUID, Rock[]>();
  for(const rock of rocks) {
    // const list = bouldersBySector.
  }
}
