import type BaseEvent from "ol/events/Event";
import type { ObjectEvent } from "ol/Object";
import type RenderEvent from "ol/render/Event";
import { useEffect, useRef, useState } from "react";
import { setMethodName } from "./utils";
import OLVectorTileLayer, { Options } from "ol/layer/VectorTile";
import { LayerContext } from "./Layer";
import { useMap } from "./MapOld";
import { createBehavior } from "./core";

const useBehavior = createBehavior(OLVectorTileLayer, {
	events: [
		"change",
		"change:extent",
		"change:maxResolution",
		"change:maxZoom",
		"change:minResolution",
		"change:minZoom",
		"change:opacity",
		"change:preload",
		"change:source",
		"change:useInterimTilesOnError",
		"change:visible",
		"change:zIndex",
		"error",
		"postrender",
		"prerender",
		"propertychange",
	],
	reactive: [
		"background",
		"extent",
		"maxResolution",
		"maxZoom",
		"minResolution",
		"minZoom",
		"opacity",
		"preload",
		// Or should it be controlled through components?
		"style",
	],
	reset: [],
});

type RestrictedOptions = Omit<Options, "map" | "source">;

interface Props extends React.PropsWithChildren<RestrictedOptions> {
	onChange(event: BaseEvent): void;
	onChangeExtent(event: ObjectEvent): void;
	onChangeMaxResolution(event: ObjectEvent): void;
	onChangeMaxZoom(event: ObjectEvent): void;
	onChangeMinResolution(event: ObjectEvent): void;
	onChangeMinZoom(event: ObjectEvent): void;
	onChangeOpacity(event: ObjectEvent): void;
	onChangePreload(event: ObjectEvent): void;
	onChangeSource(event: ObjectEvent): void;
	onChangeUseInterimTilesOnError(event: ObjectEvent): void;
	onChangeVisible(event: ObjectEvent): void;
	onChangeZIndex(event: ObjectEvent): void;
	onError(event: BaseEvent): void;
	onPreRender(event: RenderEvent): void;
	onPostRender(event: RenderEvent): void;
	onPropertyChange(event: ObjectEvent): void;
}

// TODO: hint
const updateProps = [
	"background",
	"extent",
	"maxResolution",
	"maxZoom",
	"minResolution",
	"minZoom",
	"opacity",
	"preload",
	// Or should it be controlled through components?
	"style",
] as const;
const updateMethods = updateProps.map(setMethodName);
const resetProps: ReadonlyArray<keyof RestrictedOptions> = [] as const;

const events = [
	"change",
	"change:extent",
	"change:maxResolution",
	"change:maxZoom",
	"change:minResolution",
	"change:minZoom",
	"change:opacity",
	"change:preload",
	"change:source",
	"change:useInterimTilesOnError",
	"change:visible",
	"change:zIndex",
	"error",
	"postrender",
	"prerender",
	"propertychange",
] as const;

const eventMethods = [
	"onChange",
	"onChangeExtent",
	"onChangeMaxResolution",
	"onChangeMaxZoom",
	"onChangeMinResolution",
	"onChangeMinZoom",
	"onChangeOpacity",
	"onChangePreload",
	"onChangeSource",
	"onChangeUseInterimTilesOnError",
	"onChangeVisible",
	"onChangeZIndex",
	"onError",
	"onPostRender",
	"onPreRender",
	"onPropertyChange",
] as const;

export function VectorTileLayer(props: Props) {
	const map = useMap();
	const [layer, setLayer] = useState<OLVectorTileLayer>();
	const { children, ...options } = props;

	const reactive = updateProps.map((x) => options[x]);
	const prevReactive = useRef(reactive);

	// Those are the properties that, if they change, we have to blow out the View and recreate it
	// TBD whether automating this is a good idea
	const resetDeps = resetProps.map((x) => options[x]);

	useEffect(() => {
		const l = new OLVectorTileLayer(options);
		setLayer(l);
		map.addLayer(l);

		return () => {
			map.removeLayer(l);
			l.dispose();
		};
	}, resetDeps);

	// Synchronously updating the map should be fine, so we can avoid many useEffect
	// (but maybe we want to prioritise DOM updates and we move this into a useEffect)
	if (layer) {
		for (let i = 0; i < reactive.length; i++) {
			const current = reactive[i];
			const prev = prevReactive.current[i];
			if (current !== prev) {
				const methodName = updateMethods[i];
				const method = layer[methodName] as Function;
				method(current);
			}
		}
	}

	const eventListeners = eventMethods.map((x) => options[x]);
	useEffect(() => {
		if (layer) {
			for (let i = 0; i < eventListeners.length; i++) {
				const fn = eventListeners[i];
				const event = events[i];
				layer.on(event as any, fn as any);
			}
			return () => {
				for (let i = 0; i < eventListeners.length; i++) {
					layer.un(events[i] as any, eventListeners[i] as any);
				}
			};
		}
	}, [layer, ...eventListeners]);

	if (layer) {
		return (
			<LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
		);
	} else {
		return null;
	}
}
