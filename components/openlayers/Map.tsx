import type BaseEvent from "ol/events/Event";
import type { ObjectEvent } from "ol/Object";
import Map, { MapOptions } from "ol/Map";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { setMethodName } from "./utils";
import type { MapEvent, MapBrowserEvent } from "ol";
import type RenderEvent from "ol/render/Event";
import { useView } from "./View";

type RestrictedOptions = Omit<
	MapOptions,
	"controls" | "interactions" | "overlays" | "target" | "view"
>;

interface MapProps extends React.PropsWithChildren<RestrictedOptions> {
	onChange(event: BaseEvent): void;
	onChangeLayerGroup(event: ObjectEvent): void;
	onChangeSize(event: ObjectEvent): void;
	onChangeTarget(event: ObjectEvent): void;
	onChangeView(event: ObjectEvent): void;
	onClick(event: MapBrowserEvent<MouseEvent>): void;
	onDoubleClick(event: MapBrowserEvent<MouseEvent>): void;
	onError(event: BaseEvent): void;
	onLoadEnd(event: MapEvent): void;
	onLoadStart(event: MapEvent): void;
	onMoveEnd(event: MapEvent): void;
	onMoveStart(event: MapEvent): void;
	onPointerDrag(event: MapBrowserEvent<PointerEvent>): void;
	onPointerMove(event: MapBrowserEvent<PointerEvent>): void;
	onPostCompose(event: MapEvent): void;
	onPostRender(event: RenderEvent): void;
	onPreCompose(event: RenderEvent): void;
	onPropertyChange(event: ObjectEvent): void;
	onRenderComplete(event: RenderEvent): void;
	onSingleClick(event: MapBrowserEvent<MouseEvent>): void;
}

const MapContext = createContext<Map | null>(null);

export function useMap(message?: string): Map {
	const view = useContext(MapContext);
	if (!view) {
		throw new Error(
			message || "useView should only used in children of a <View> component"
		);
	}
	return view;
}

const updateProps = [
	// "size",
] as const;
const updateMethods = updateProps.map(setMethodName);
const resetProps: ReadonlyArray<keyof RestrictedOptions> = [];

const events = [
	"change",
	"change:layerGroup",
	"change:size",
	"change:target",
	"change:view",
	"click",
	"dblclick",
	"error",
	"loadend",
	"loadstart",
	"moveend",
	"movestart",
	"pointerdrag",
	"pointermove",
	"postcompose",
	"postrender",
	"precompose",
	"propertychange",
	"rendercomplete",
	"singleclick",
] as const;

const eventMethods = [
	"onChange",
	"onChangeLayerGroup",
	"onChangeSize",
	"onChangeTarget",
	"onChangeView",
	"onClick",
	"onDoubleClick",
	"onError",
	"onLoadEnd",
	"onLoadStart",
	"onMoveEnd",
	"onMoveStart",
	"onPointerDrag",
	"onPointerMove",
	"onPostCompose",
	"onPostRender",
	"onPreCompose",
	"onPropertyChange",
	"onRenderComplete",
	"onSingleClick",
] as const;

const Component = function (props: MapProps) {
	const view = useView();
	const [map, setMap] = useState<Map>();
	const { children, ...options } = props;

	const reactive = updateProps.map((x) => options[x]);
	const prevReactive = useRef(reactive);

	// Those are the properties that, if they change, we have to blow out the View and recreate it
	// TBD whether automating this is a good idea
	const resetDeps = resetProps.map((x) => options[x]);

	useEffect(() => {
		(options as MapOptions).view = view;
		const m = new Map(options);
		setMap(m);

		return () => m.dispose();
	}, resetDeps);

	// Synchronously updating the map should be fine, so we can avoid many useEffect
	// (but maybe we want to prioritise DOM updates and we move this into a useEffect)
	if (map) {
		for (let i = 0; i < reactive.length; i++) {
			const current = reactive[i];
			const prev = prevReactive.current[i];
			if (current !== prev) {
				const methodName = updateMethods[i];
				const method = map[methodName] as Function;
				method(current);
			}
		}
	}

	const eventListeners = eventMethods.map((x) => options[x]);
	useEffect(() => {
		if (map) {
			for (let i = 0; i < eventListeners.length; i++) {
				const fn = eventListeners[i];
				const event = events[i];
				map.on(event as any, fn as any);
			}
			return () => {
				for (let i = 0; i < eventListeners.length; i++) {
					map.un(events[i] as any, eventListeners[i] as any);
				}
			};
		}
	}, [map, ...eventListeners]);

	if (map) {
		return <MapContext.Provider value={map}>{children}</MapContext.Provider>;
	} else {
		return null;
	}
};

Component.displayName = "Map";
export default Component;
