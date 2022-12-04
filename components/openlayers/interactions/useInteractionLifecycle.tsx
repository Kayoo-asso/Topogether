import { useMap } from "../contexts";
import type Interaction from "ol/interaction/Interaction";
import { useEffect } from "react";
import { Map } from "ol";

export function useInteractionLifecycle(
	interaction: Interaction | undefined,
	active: boolean | undefined,
  map: Map | undefined
) {
	if (active) interaction?.setActive(active);

	useEffect(() => {
		if (interaction && map) {
			map.addInteraction(interaction);
			return () => {
				map.removeInteraction(interaction);
			};
		}
	}, [interaction, map]);

  return map;
}

