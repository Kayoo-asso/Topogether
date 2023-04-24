// Custom interaction here
// Based on: https://openlayers.org/en/latest/examples/custom-interactions.html

import type MapBrowserEvent from "ol/MapBrowserEvent";
import Feature from "ol/Feature";
import type { Coordinate } from "ol/coordinate";
import BaseEvent from "ol/events/Event";
import type { Geometry } from "ol/geom";
import PointerInteraction from "ol/interaction/Pointer";
import type Layer from "ol/layer/Layer";
import VectorLayer from "ol/layer/Vector";
import type Vector from "ol/source/Vector";
import VectorSource from "ol/source/Vector";

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
	feature: Feature;
	mapBrowserEvent: MapBrowserEvent<UIEvent>;
	constructor(
		type: DragEvents,
		feature: Feature,
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
	protected feature_: Feature | null;
	protected previousCursor_: string | undefined;
	protected startCondition_: Condition | undefined;
	protected hitTolerance_: number;
	protected sources: Array<VectorSource>;
	protected layerFilter_: (layer: Layer) => boolean;
	protected origLayer_: VectorLayer<VectorSource> | null;
	protected tempLayer_: VectorLayer<VectorSource> | null;

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

		this.tempLayer_ = null;
		this.origLayer_ = null;
	}

	findFeature(
		evt: MapBrowserEvent<UIEvent>
	): [Feature, VectorLayer<VectorSource>] | undefined {
		const map = evt.map;
		if (this.sources) {
			let feature: Feature | undefined;
			let layer: VectorLayer<VectorSource> | undefined;
			map.forEachFeatureAtPixel(
				evt.pixel,
				function (f, l) {
					if (f instanceof Feature) {
						feature = f;
						// TODO: remove after debugging
						if (!(l instanceof VectorLayer)) {
							throw new Error("Unexpected!");
						}
						layer = l;
						// Signal to stop
						return true;
					}
				},
				{
					layerFilter: this.layerFilter_,
					hitTolerance: this.hitTolerance_,
				}
			);
			if (feature && layer) {
				return [feature, layer];
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
	const found = this.findFeature(evt);

	if (found) {
		const [feature, layer] = found;
		// Check if we should start dragging
		const dragEvent = new DragEvent("dragstart", feature, evt);
		// If a condition exists and it is false, do not initiate a drag sequence
		if (this.startCondition_ && !this.startCondition_(dragEvent)) {
			return false;
		}
		// Keep track of the last coordinate, to translate the feature as the pointer moves
		this.coordinate_ = evt.coordinate;
		// Keep track of the feature and its original source
		this.feature_ = feature;
		this.origLayer_ = layer;
		// We'll setup a temporary layer for the Drag on the first move
		this.dispatchEvent(dragEvent);
	}

	return !!found;
}

function handleDragEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	const origLayer = this.origLayer_!;
	const origSource = origLayer.getSource()!;
	const feature = this.feature_!;
	if (!this.tempLayer_) {
		// Setup a temporary layer for the dragging motion
		this.tempLayer_ = new VectorLayer({
			source: new VectorSource({
				useSpatialIndex: false,
				wrapX: origSource.getWrapX(),
				features: [feature],
			}),
			style: origLayer.getStyle(),
			updateWhileAnimating: true,
			updateWhileInteracting: true,
		});
		// Show the new layer
		evt.map.addLayer(this.tempLayer_);
		// Remove the feature from its original source
		origSource.removeFeature(feature);
	}
	const prevCoord = this.coordinate_!;
	const deltaX = evt.coordinate[0] - prevCoord[0];
	const deltaY = evt.coordinate[1] - prevCoord[1];

	const geometry = feature.getGeometry() as Geometry;
	geometry.translate(deltaX, deltaY);

	prevCoord[0] = evt.coordinate[0];
	prevCoord[1] = evt.coordinate[1];

	this.dispatchEvent(new DragEvent("drag", feature, evt));
}

function handleMoveEvent(this: DragInteraction, evt: MapBrowserEvent<UIEvent>) {
	if (this.cursor_) {
		const feature = this.findFeature(evt);
		const element = evt.map.getTargetElement();

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
	// (as well as this.tempLayer_ and this.origSource_)
	if (this.feature_) {
		const feature = this.feature_;
		this.dispatchEvent(new DragEvent("dragend", feature, evt));
		// The temporary layer may not have been created if there was no movement
		// In that case, the feature is still in its original source, so we shouldn't move it
		if (this.tempLayer_) {
			evt.map.removeLayer(this.tempLayer_);
			const origLayer = this.origLayer_!;
			origLayer.getSource()?.addFeature(feature);
		}
	}
	this.coordinate_ = null;
	this.feature_ = null;
	this.tempLayer_ = null;
	this.origLayer_ = null;
	return false;
}
