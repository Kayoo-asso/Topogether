import OLSelect from "ol/interaction/Select";
import { forwardRef, useContext, useEffect } from "react";
import { LayerContext, useLayer, useMap } from "../contexts";
import { createBehavior, InferProps } from "../core";

const useBehavior = createBehavior(OLSelect, {
	events: ["change:active", "select"],
	reactive: ["hitTolerance"],
});

type P = Omit<InferProps<typeof useBehavior>, "layers"> & {
	layers: string[];
	active?: boolean;
};

export const Select = forwardRef<OLSelect, P>(
	({ active, layers, ...props }, ref) => {
		const map = useMap();
		const mapLayers = map.getLayers();
		const actualLayers = layers.map((key) => mapLayers.get(key));
		const options: InferProps<typeof useBehavior> = props;
		options.layers = actualLayers;

		// TODO: actually recreate the Select if we change the layers selection
		const select = useBehavior(props, ref);

		// Additional property
		if (active) {
			select?.setActive(!!active);
		}

		useEffect(() => {
			if (select) {
				map.addInteraction(select);
				return () => {
					map.removeInteraction(select);
				};
			}
		}, [select, map]);

		return null;
	}
);
