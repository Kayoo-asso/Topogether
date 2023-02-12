import type Interaction from "ol/interaction/Interaction";
import { useEffect } from "react";
import { Map } from "ol";

export function useInteractionLifecycle(
	interaction: Interaction | undefined,
  map: Map | undefined
) {
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

