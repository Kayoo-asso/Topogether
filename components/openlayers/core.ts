import { setReactRef } from "helpers/utils";
import type BaseEvent from "ol/events/Event";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import type MapEvent from "ol/MapEvent";
import type { ObjectEvent } from "ol/Object";
import type RenderEvent from "ol/render/Event";
import { TileSourceEvent } from "ol/source/Tile";
import { ForwardedRef, useEffect, useRef, useState } from "react";
import { setMethodName } from "./utils";

// TODO:
// - Add checks that all reactive props `P` have an associated `setP` method

interface Definition<
	Options,
	// Options,
	Events extends Event,
	ReactiveProps extends string & keyof Options,
	ResetProps extends string & keyof Options
> {
	reactive: ReactiveProps[];
	reset: ResetProps[];
	events: Events[];
}

interface OLBase<Events, Handlers> {
	on: (event: Events, handler: Handlers) => void;
	un: (event: Events, handler: Handlers) => void;
	dispose?: () => void;
}

type BuildProps<Options, Events extends Event> = Options & {
	[E in EventHandlers[Events]]?: EventFn<E>;
};

export type PropsWithChildren<UseBehavior extends (...args: any) => any> =
	React.PropsWithChildren<Props<UseBehavior>>;

export type Props<UseBehavior extends (...args: any) => any> =
	Parameters<UseBehavior>[0];

export function createBehavior<
	Options,
	T extends OLBase<any, any>,
	Events extends Event,
	ReactiveProps extends string & keyof Options,
	ResetProps extends string & keyof Options,
	D extends Definition<Options, Events, ReactiveProps, ResetProps>
>(constructor: new (options?: Options) => T, definition: D) {
	const handlers = definition.events.map((x) => eventHandlers[x]);
	const updateMethods = definition.reactive.map(setMethodName);

	return function (
		props: BuildProps<Options, Events>,
		ref: ForwardedRef<T> | undefined
	) {
		const [instance, setInstance] = useState<T>();
		const observed = definition.reactive.map((x) => props[x]);
		const prevObserved = useRef(observed);

		//
		useEffect(() => {
			// Do we need to delete eventFns from the props before instantiation?
			const obj = new constructor(props);
			setInstance(obj);

			return () => {
				if (obj.dispose) {
					obj.dispose();
				}
			};
		}, []);

		// ForwardRef
		useEffect(() => {
			if (ref && instance) {
				setReactRef(ref, instance);
			}
		}, [ref, instance]);

		// Reactive properties
		// Synchronous updates should be fine
		if (instance) {
			for (let i = 0; i < observed.length; i++) {
				const current = observed[i];
				const prev = prevObserved.current[i];
				if (current !== prev) {
					const methodName = updateMethods[i];
					((instance as any)[methodName] as Function)(current);
				}
			}
		}

		// Event listeners
		const eventFns = handlers.map((x) => props[x]);
		useEffect(() => {
			if (instance) {
				for (let i = 0; i < eventFns.length; i++) {
					const fn = eventFns[i];
					const event = definition.events[i];
					instance.on(event, fn);
				}
				return () => {
					for (let i = 0; i < eventFns.length; i++) {
						instance.un(definition.events[i], eventFns[i]);
					}
				};
			}
		}, [instance, ...eventFns]);

		return instance;
	};
}

const eventHandlers = {
	change: "onChange",
	"change:center": "onChangeCenter",
	"change:extent": "onChangeExtent",
	"change:layerGroup": "onChangeLayerGroup",
	"change:maxResolution": "onChangeMaxResolution",
	"change:maxZoom": "onChangeMaxZoom",
	"change:minResolution": "onChangeMinResolution",
	"change:minZoom": "onChangeMinZoom",
	"change:opacity": "onChangeOpacity",
	"change:preload": "onChangePreload",
	"change:resolution": "onChangeResolution",
	"change:rotation": "onChangeRotation",
	"change:size": "onChangeSize",
	"change:source": "onChangeSource",
	"change:target": "onChangeTarget",
	"change:view": "onChangeView",
	"change:useInterimTilesOnError": "onChangeUseInterimTilesOnError",
	"change:visible": "onChangeVisible",
	"change:zIndex": "onChangeZIndex",

	click: "onClick",
	dblclick: "onDoubleClick",
	error: "onError",
	loadend: "onLoadEnd",
	loadstart: "onLoadStart",
	moveend: "onMoveEnd",
	movestart: "onMoveStart",
	pointerdrag: "onPointerDrag",
	pointermove: "onPointerMove",
	postcompose: "onPostCompose",
	postrender: "onPostRender",
	precompose: "onPreCompose",
	prerender: "onPreRender",
	propertychange: "onPropertyChange",
	rendercomplete: "onRenderComplete",
	singleclick: "onSingleClick",
	tileloadend: "onTileLoadEnd",
	tileloaderror: "onTileLoadError",
	tileloadstart: "onTileLoadStart",
} as const;

interface EventMap {
	onChange(e: BaseEvent): void;
	onChangeCenter(e: ObjectEvent): void;
	onChangeExtent(event: ObjectEvent): void;
	onChangeLayerGroup(event: ObjectEvent): void;
	onChangeMaxResolution(event: ObjectEvent): void;
	onChangeMaxZoom(event: ObjectEvent): void;
	onChangeMinResolution(event: ObjectEvent): void;
	onChangeMinZoom(event: ObjectEvent): void;
	onChangeOpacity(event: ObjectEvent): void;
	onChangePreload(event: ObjectEvent): void;
	onChangeResolution(e: ObjectEvent): void;
	onChangeRotation(e: ObjectEvent): void;
	onChangeSize(event: ObjectEvent): void;
	onChangeSource(event: ObjectEvent): void;
	onChangeTarget(event: ObjectEvent): void;
	onChangeView(event: ObjectEvent): void;
	onChangeUseInterimTilesOnError(event: ObjectEvent): void;
	onChangeVisible(event: ObjectEvent): void;
	onChangeZIndex(event: ObjectEvent): void;

	onClick(event: MapBrowserEvent<MouseEvent>): void;
	onDoubleClick(event: MapBrowserEvent<MouseEvent>): void;
	onError(e: BaseEvent): void;
	onLoadEnd(event: MapEvent): void;
	onLoadStart(event: MapEvent): void;
	onMoveEnd(event: MapEvent): void;
	onMoveStart(event: MapEvent): void;
	onPointerDrag(event: MapBrowserEvent<PointerEvent>): void;
	onPointerMove(event: MapBrowserEvent<PointerEvent>): void;
	onPostCompose(event: MapEvent): void;
	onPostRender(event: RenderEvent): void;
	onPreCompose(event: RenderEvent): void;
	onPreRender(event: RenderEvent): void;
	onPropertyChange(e: ObjectEvent): void;
	onRenderComplete(event: RenderEvent): void;
	onSingleClick(event: MapBrowserEvent<MouseEvent>): void;
	onTileLoadEnd(event: TileSourceEvent): void;
	onTileLoadError(event: TileSourceEvent): void;
	onTileLoadStart(event: TileSourceEvent): void;
}
type EventHandlers = typeof eventHandlers;
type Event = keyof EventHandlers;
type EventHandler<E extends Event> = EventHandlers[E];
type EventFn<EH extends EventHandler<Event>> = EventMap[EH];
