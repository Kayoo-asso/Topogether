import { setReactRef } from "helpers/utils";
import type BaseEvent from "ol/events/Event";
import { DragBoxEvent } from "ol/interaction/DragBox";
import { DrawEvent } from "ol/interaction/Draw";
import { ModifyEvent } from "ol/interaction/Modify";
import type { SelectEvent } from "ol/interaction/Select";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import type MapEvent from "ol/MapEvent";
import type { ObjectEvent } from "ol/Object";
import type RenderEvent from "ol/render/Event";
import { TileSourceEvent } from "ol/source/Tile";
import { VectorSourceEvent } from "ol/source/Vector";
import {
	ForwardedRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { setMethodName } from "./utils";

// TODO:
// - Add checks that all reactive props `P` have an associated `setP` method

interface Definition<
	Options,
	// Options,
	Events extends Event,
	ReactiveProps extends string & keyof RemoveUndefined<Options>,
	ResetProps extends string & keyof RemoveUndefined<Options>
> {
	events: Events[];
	reactive: ReactiveProps[];
	reset?: ResetProps[];
}

interface OLBase<Events, Handlers> {
	on: (event: Events, handler: Handlers) => void;
	un: (event: Events, handler: Handlers) => void;
	dispose?: () => void;
}

type BuildProps<Options, Events extends Event> = RemoveUndefined<Options> & {
	[E in EventHandlers[Events]]?: EventFn<E>;
};

export type InferPropsWithChildren<UseBehavior extends (...args: any) => any> =
	React.PropsWithChildren<InferProps<UseBehavior>>;

export type InferProps<UseBehavior extends (...args: any) => any> =
	Parameters<UseBehavior>[0];

type RemoveUndefined<T> = T extends undefined ? never : T;

export function createBehavior<
	Options,
	T extends OLBase<any, any>,
	Events extends Event,
	ReactiveProps extends string & keyof RemoveUndefined<Options>,
	ResetProps extends string & keyof RemoveUndefined<Options>,
	D extends Definition<Options, Events, ReactiveProps, ResetProps>
>(constructor: new <_>(options: Options) => T, definition: D) {
	const events = { ...baseEvents, ...definition.events };
	const handlers = Object.values(events);
	// const handlers = events.map((x) => eventHandlers[x]);
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
		// Can't use `useImperativeHandle` because we can't return null or undefined there
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

export const baseEvents = {
	change: "onChange",
	error: "onError",
	propertychange: "onPropertyChange",
} as const;

export const renderEvents = {
	postrender: "onPostRender",
	prerender: "onPreRender",
} as const;

export const layerEvents = {
	...renderEvents,
	"change:extent": "onChangeExtent",
	"change:maxResolution": "onChangeMaxResolution",
	"change:maxZoom": "onChangeMaxZoom",
	"change:minResolution": "onChangeMinResolution",
	"change:minZoom": "onChangeMinZoom",
	"change:opacity": "onChangeOpacity",
	"change:source": "onChangeSource",
	"change:visible": "onChangeVisible",
	"change:zIndex": "onChangeZIndex",
} as const;

export const mapEvents = {
	"change:layerGroup": "onChangeLayerGroup",
	"change:size": "onChangeSize",
	"change:target": "onChangeTarget",
	"change:view": "onChangeView",
	click: "onClick",
	dblclick: "onDoubleClick",
	loadend: "onLoadEnd",
	loadstart: "onLoadStart",
	moveend: "onMoveEnd",
	movestart: "onMoveStart",
	pointerdrag: "onPointerDrag",
	pointermove: "onPointerMove",
	postcompose: "onPostCompose",
	precompose: "onPreCompose",
	rendercomplete: "onRenderComplete",
	singleclick: "onSingleClick",
} as const;

export const tileSourceEvents = {
	tileloadend: "onTileLoadEnd",
	tileloaderror: "onTileLoadError",
	tileloadstart: "onTileLoadStart",
} as const;

export const vectorSourceEvents = {
	addfeature: "onAddFeature",
	changefeature: "onChangeFeature",
	clear: "onClear",
	featuresloadend: "onFeaturesLoadEnd",
	featuresloaderror: "onFeaturesLoadError",
	featuresloadstart: "onFeaturesLoadStart",
	removefeature: "onRemoveFeature",
} as const;

export const tileLayerEvents = {
	"change:preload": "onChangePreload",
	"change:useInterimTilesOnError": "onChangeUseInterimTilesOnError",
} as const;

export const viewEvents = {
	"change:center": "onChangeCenter",
	"change:resolution": "onChangeResolution",
	"change:rotation": "onChangeRotation",
} as const;

export function events(
	...args: Partial<Record<Event, EventHandler<Event>>>[]
): Event[] {
	return Object.keys(Object.assign({}, ...args)) as Event[];
}

export const eventHandlers = {
	...baseEvents,
	...layerEvents,
	...mapEvents,
	...renderEvents,
	...vectorSourceEvents,
	...tileSourceEvents,
	...tileLayerEvents,
	...viewEvents,
	// Interaction events
	"change:active": "onChangeActive",
	// Select
	"select": "onSelect",
	// Draw
	"drawabort": "onDrawAbort",
	"drawend": "onDrawEnd",
	"drawstart": "onDrawStart",
	// DragBox
	"boxcancel": "onBoxCancel",
	"boxdrag": "onBoxDrag",
	"boxend": "onBoxEnd",
	"boxstart": "onBoxStart",
	// Modify
	"modifyend": "onModifyEnd",
	"modifystart": "onModifyStart"
} as const;

interface EventMap {
	// Base
	onChange(e: BaseEvent): void;
	onError(e: BaseEvent): void;
	onPropertyChange(e: ObjectEvent): void;

	// Render
	onPostRender(event: RenderEvent): void;
	onPreRender(event: RenderEvent): void;

	// Map
	onChangeLayerGroup(event: ObjectEvent): void;
	onChangeSize(event: ObjectEvent): void;
	onChangeTarget(event: ObjectEvent): void;
	onChangeView(event: ObjectEvent): void;
	onClick(event: MapBrowserEvent<MouseEvent>): void;
	onDoubleClick(event: MapBrowserEvent<MouseEvent>): void;
	onLoadEnd(event: MapEvent): void;
	onLoadStart(event: MapEvent): void;
	onMoveEnd(event: MapEvent): void;
	onMoveStart(event: MapEvent): void;
	onPointerDrag(event: MapBrowserEvent<PointerEvent>): void;
	onPointerMove(event: MapBrowserEvent<PointerEvent>): void;
	onPostCompose(event: MapEvent): void;
	onPreCompose(event: RenderEvent): void;
	onRenderComplete(event: RenderEvent): void;
	onSingleClick(event: MapBrowserEvent<MouseEvent>): void;

	// View
	onChangeCenter(e: ObjectEvent): void;
	onChangeResolution(e: ObjectEvent): void;
	onChangeRotation(e: ObjectEvent): void;

	// Layer
	onChangeExtent(event: ObjectEvent): void;
	onChangeMaxResolution(event: ObjectEvent): void;
	onChangeMaxZoom(event: ObjectEvent): void;
	onChangeMinResolution(event: ObjectEvent): void;
	onChangeMinZoom(event: ObjectEvent): void;
	onChangeOpacity(event: ObjectEvent): void;
	onChangeSource(event: ObjectEvent): void;
	onChangeVisible(event: ObjectEvent): void;
	onChangeZIndex(event: ObjectEvent): void;

	// Tile layer
	onChangePreload(event: ObjectEvent): void;
	onChangeUseInterimTilesOnError(event: ObjectEvent): void;

	// Vector layer

	// Tile source
	onTileLoadEnd(event: TileSourceEvent): void;
	onTileLoadError(event: TileSourceEvent): void;
	onTileLoadStart(event: TileSourceEvent): void;

	// Vector source
	onAddFeature(event: VectorSourceEvent): void;
	onChangeFeature(event: VectorSourceEvent): void;
	onClear(event: VectorSourceEvent): void;
	onFeaturesLoadEnd(event: VectorSourceEvent): void;
	onFeaturesLoadError(event: VectorSourceEvent): void;
	onFeaturesLoadStart(event: VectorSourceEvent): void;
	onRemoveFeature(event: VectorSourceEvent): void;

	// Interactions
	onChangeActive(event: ObjectEvent): void;
	// Draw
	onDrawAbort(event: DrawEvent): void;	
	onDrawEnd(event: DrawEvent): void;
	onDrawStart(event: DrawEvent): void;
	// Select
	onSelect(event: SelectEvent): void;
	// DragBox
	onBoxCancel(event: DragBoxEvent): void;
	onBoxDrag(event: DragBoxEvent): void;
	onBoxEnd(event: DragBoxEvent): void;
	onBoxStart(event: DragBoxEvent): void;
	// Modify
	onModifyEnd(event: ModifyEvent): void;
	onModifyStart(event: ModifyEvent): void;
}
type EventHandlers = typeof eventHandlers;
type Event = keyof EventHandlers;
type EventHandler<E extends Event> = EventHandlers[E];
type EventFn<EH extends EventHandler<Event>> = EventMap[EH];
