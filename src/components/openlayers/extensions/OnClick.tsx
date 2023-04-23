import type { Feature, MapBrowserEvent } from "ol";
import { useMap } from "../contexts";
import { useEffect } from "react";
import BaseEvent from "ol/events/Event";
import VectorLayer from "ol/layer/Vector";
import { useGetLayers } from "../utils";
import { FeatureLike } from "ol/Feature";

export type OnClickProps =
	| {
			layers: string | Array<string>;
			onClick(e: OnClickFeatureEvent<Feature>): void;
			renderFeatures?: false;
			stopPropagation?: boolean;
			hitTolerance?: number;
	  }
	| {
			layers: string | Array<string>;
			onClick(e: OnClickFeatureEvent<FeatureLike>): void;
			renderFeatures: true;
			stopPropagation?: boolean;
			hitTolerance?: number;
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
			let stop = false;
			map.forEachFeatureAtPixel(
				evt.pixel,
				(feature) => {
					if (!stop) {
						props.onClick(new OnClickFeatureEvent(feature as any, evt));
					}
					if (
						props.stopPropagation === undefined ||
						props.stopPropagation === true
					) {
						stop = true;
					}
				},
				{
					hitTolerance: props.hitTolerance,
					layerFilter: (l) =>
						layerSet.has(l) &&
						(props.renderFeatures || l instanceof VectorLayer),
				}
			);
		};
		map.on("click", handler);
		return () => map.un("click", handler);
	}, [
		map,
		layers,
		props.onClick,
		props.stopPropagation,
		props.hitTolerance,
		props.renderFeatures,
	]);
	return null;
}
