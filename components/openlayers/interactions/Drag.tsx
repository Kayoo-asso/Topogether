// Custom interaction here
// Based on: https://openlayers.org/en/latest/examples/custom-interactions.html

import type { MapBrowserEvent } from "ol";
import type { Coordinate } from "ol/coordinate";
import type { Condition } from "ol/events/condition";
import type { FeatureLike } from "ol/Feature";
import type { Geometry } from "ol/geom";
import PointerInteraction from "ol/interaction/Pointer";

export class DragInteraction extends PointerInteraction {
	protected coordinate_: Coordinate | null;
	protected cursor_: string | undefined;
	protected feature_: FeatureLike | null;
	protected element_: HTMLElement | null;
	protected previousCursor_: string | undefined;
	protected condition_: Condition | undefined

	constructor(options?: Options) {
		super({
			handleDownEvent: handleDownEvent,
			handleDragEvent: handleDragEvent,
			handleMoveEvent: handleMoveEvent,
			handleUpEvent: handleUpEvent,
		});

		this.coordinate_ = null;
		this.cursor_ = "pointer";
		this.feature_ = null;
		this.element_ = null;
		this.previousCursor_ = undefined;
		this.condition_ = options?.condition;
	}

	protected isActive_(event: MapBrowserEvent<UIEvent>): boolean {
		let active = this.getActive();
		if(this.condition_) {
			 active = active && this.condition_(event);
		}
		return active;
	}
}

function handleDownEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	const map = evt.map;

	const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
		return feature;
	});

	if (feature) {
		this.coordinate_ = evt.coordinate;
		this.feature_ = feature;
	}

	return !!feature;
}

function handleDragEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	const deltaX = evt.coordinate[0] - this.coordinate_![0];
	const deltaY = evt.coordinate[1] - this.coordinate_![1];

	this.getActive()
	const geometry = this.feature_!.getGeometry() as Geometry;
	geometry.translate(deltaX, deltaY);

	this.coordinate_![0] = evt.coordinate[0];
	this.coordinate_![1] = evt.coordinate[1];
}

function handleMoveEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	if (this.cursor_) {
		const map = evt.map;
		const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
			return feature;
		});
		const element = this.element_ = evt.map.getTargetElement();
		
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

function handleUpEvent(this: DragInteraction) {
	this.coordinate_ = null;
	this.feature_ = null;
	return false;
}

type Options = {
	active?: boolean,
	condition?: Condition;
	cursor?: string;
	// onPointerDown(event: MapBrowserEvent<UIEvent>): void;
	// onPointerMove(event: MapBrowserEvent<UIEvent>): void;
	// onPointerDrag(event: MapBrowserEvent<UIEvent>): void;
	// onPointerUp(event: MapBrowserEvent<UIEvent>): void;
}

