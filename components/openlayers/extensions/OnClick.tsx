import type { Feature, MapBrowserEvent } from "ol";
import { useLayer, useMap } from "../contexts";
import { useEffect } from "react";
import BaseEvent from "ol/events/Event";
import VectorLayer from "ol/layer/Vector";
import type VectorSource from "ol/source/Vector";
import { useGetLayers } from "../utils";
import { FeatureLike } from "ol/Feature";

export type OnClickProps =
	| {
			layers: string | Array<string>;
			onClick(e: OnClickFeatureEvent<Feature>): void;
			renderFeatures?: false;
	  }
	| {
			layers: string | Array<string>;
			onClick(e: OnClickFeatureEvent<FeatureLike>): void;
			renderFeatures: true;
	  };

// Adapted from OpenLayer's ModifyEvent
export class OnClickFeatureEvent<
	F extends FeatureLike = Feature
> extends BaseEvent {
	feature: F;
	mapBrowserEvent: MapBrowserEvent<UIEvent>;
	constructor(feature: F, mapBrowserEvent: MapBrowserEvent<UIEvent>) {
		super("handle:click");
		this.feature = feature;
		this.mapBrowserEvent = mapBrowserEvent;
	}
}

export function OnClickFeature(props: OnClickProps) {
	const map = useMap();
	const layers = useGetLayers(map, props.layers, true);
	useEffect(() => {
		const layerSet = new Set(layers);
		const handler = (evt: MapBrowserEvent<UIEvent>) => {
			map.forEachFeatureAtPixel(
				evt.pixel,
				(feature) => {
					props.onClick(new OnClickFeatureEvent(feature as any, evt));
				},
				{
					layerFilter: (l) =>
						layerSet.has(l) &&
						(props.renderFeatures || l instanceof VectorLayer),
				}
			);
		};
		map.on("singleclick", handler);
		return () => map.un("singleclick", handler);
	}, [map, layers, props.onClick]);
	return null;
}
