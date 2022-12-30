// Custom interaction here
// Based on: https://openlayers.org/en/latest/examples/custom-interactions.html

import type { Map, MapBrowserEvent } from "ol";
import type { Coordinate } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import type { FeatureLike } from "ol/Feature";
import type { Geometry } from "ol/geom";
import PointerInteraction from "ol/interaction/Pointer";
import { Vector } from "ol/source";
import { boundingExtent } from "ol/extent";
import VectorSource from "ol/source/Vector";
import Layer from "ol/layer/Layer";

// Departure from standard OpenLayers API
// TODO: change that & use collections for fine-grained feature selection
type Condition = (event: DragEvent) => boolean;

export interface DragOptions {
	startCondition?: Condition;
	cursor?: string;
	hitTolerance?: number;
	sources: Vector | Array<VectorSource>;
}

type DragEvents = "dragstart" | "drag" | "dragend";

// Adapted from OpenLayer's ModifyEvent
export class DragEvent extends BaseEvent {
	feature: FeatureLike;
	mapBrowserEvent: MapBrowserEvent<UIEvent>;
	constructor(
		type: DragEvents,
		feature: FeatureLike,
		mapBrowserEvent: MapBrowserEvent<UIEvent>
	) {
		super(type);

		this.feature = feature;

		this.mapBrowserEvent = mapBrowserEvent;
	}
}

export class DragInteraction extends PointerInteraction {
	protected coordinate_: Coordinate | null;
	protected cursor_: string | undefined;
	protected feature_: FeatureLike | null;
	protected element_: HTMLElement | null;
	protected previousCursor_: string | undefined;
	protected startCondition_: Condition | undefined;
	protected hitTolerance_: number;
	protected sources: Array<VectorSource>;
	protected layerFilter_: (layer: Layer) => boolean;

	constructor(options: DragOptions) {
		super({
			handleDownEvent: handleDownEvent,
			handleDragEvent: handleDragEvent,
			handleMoveEvent: handleMoveEvent,
			handleUpEvent: handleUpEvent,
		});

		this.coordinate_ = null;
		this.cursor_ = options.cursor || "pointer";
		this.feature_ = null;
		this.element_ = null;
		this.previousCursor_ = undefined;
		this.startCondition_ = options.startCondition;
		this.hitTolerance_ = options.hitTolerance ?? 0;

		if (Array.isArray(options.sources)) {
			this.sources = options.sources;
		} else {
			this.sources = [options.sources];
		}

		this.layerFilter_ = function (
			this: DragInteraction,
			layer: Layer
		): boolean {
			const layerSource = layer.getSource();
			return !!this.sources.find((x) => x === layerSource);
		}.bind(this);
	}

	findFeature(evt: MapBrowserEvent<UIEvent>): FeatureLike | undefined {
		const map = evt.map;
		if (this.sources) {
			const features = map.getFeaturesAtPixel(evt.pixel, {
				layerFilter: this.layerFilter_,
				hitTolerance: this.hitTolerance_,
			});
			if (features.length > 0) {
				return features[0];
			}
		}
	}

	setStartCondition(condition: Condition | undefined) {
		this.startCondition_ = condition;
	}

	setCursor(cursor: string | undefined) {
		this.cursor_ = cursor;
	}
}
function handleDownEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	const feature = this.findFeature(evt);

	if (feature) {
		this.coordinate_ = evt.coordinate;
		this.feature_ = feature;
		const dragEvent = new DragEvent("dragstart", feature, evt);
		// If a condition exists and it is false, do not initiate a drag sequence
		if (this.startCondition_ && !this.startCondition_(dragEvent)) {
			return false;
		}
		this.dispatchEvent(dragEvent);
	}

	return !!feature;
}

function handleDragEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	const deltaX = evt.coordinate[0] - this.coordinate_![0];
	const deltaY = evt.coordinate[1] - this.coordinate_![1];

	const geometry = this.feature_!.getGeometry() as Geometry;
	geometry.translate(deltaX, deltaY);

	this.coordinate_![0] = evt.coordinate[0];
	this.coordinate_![1] = evt.coordinate[1];
	this.dispatchEvent(new DragEvent("drag", this.feature_!, evt));
}

function handleMoveEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	if (this.cursor_) {
		const feature = this.findFeature(evt);
		const element = (this.element_ = evt.map.getTargetElement());

		if (feature) {
			if (element.style.cursor != this.cursor_) {
				this.previousCursor_ = element.style.cursor;
				element.style.cursor = this.cursor_;
			}
		} else if (this.previousCursor_ !== undefined) {
			element.style.cursor = this.previousCursor_;
			this.previousCursor_ = undefined;
		}
	}
}

function handleUpEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	// If the drag sequence was not initiated, this.feature_ may be null
	if (this.feature_) {
		this.dispatchEvent(new DragEvent("dragend", this.feature_, evt));
	}
	this.coordinate_ = null;
	this.feature_ = null;
	return false;
}
