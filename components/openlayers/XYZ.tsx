
import type BaseEvent from "ol/events/Event";
import type { ObjectEvent } from "ol/Object";
import type RenderEvent from "ol/render/Event";
import { useEffect, useRef, useState } from "react";
import { setMethodName } from "./utils";
import OLXYZ, { Options } from "ol/source/XYZ";
import { SourceContext } from "./Source";
import { TileSourceEvent } from "ol/source/Tile";
import { useLayer } from "./Layer";

// TODO: How to handle TileGrid and Projection?
type RestrictedOptions = Options;

interface Props extends React.PropsWithChildren<RestrictedOptions> {
	onChange(event: BaseEvent): void;
	onError(event: BaseEvent): void;
	onPropertyChange(event: ObjectEvent): void;
	onTileLoadEnd(event: TileSourceEvent): void;
	onTileLoadError(event: TileSourceEvent): void;
	onTileLoadStart(event: TileSourceEvent): void;
}

// TODO: 
// - setTileGridForProjection
// - setRenderReprojectionEdges
const updateProps = [
	"attributions",
	"tileLoadFunction",
	"tileUrlFunction",
	"url",
	"urls"
] as const;
const updateMethods = updateProps.map(setMethodName);
const resetProps: ReadonlyArray<keyof RestrictedOptions> = [] as const;

const events = [
	"change",
	"error",
	"propertychange",
	"tileloadend",
	"tileloaderror",
	"tileloadstart"
] as const;

const eventMethods = [
	"onChange",
	"onError",
	"onPropertyChange",
	"onTileLoadEnd",
	"onTileLoadError",
	"onTileLoadStart"
] as const;

export function XYZ (props: Props) {
	const layer = useLayer();
	const [source, setSource] = useState<OLXYZ>();
	const { children, ...options } = props;

	const reactive = updateProps.map((x) => options[x]);
	const prevReactive = useRef(reactive);

	// Those are the properties that, if they change, we have to blow out the View and recreate it
	// TBD whether automating this is a good idea
	const resetDeps = resetProps.map((x) => options[x]);

	useEffect(() => {
		const s = new OLXYZ(options);
		layer.setSource(s);
		setSource(s);

		return () => {
			layer.setSource(null);
			s.dispose();
		};
	}, resetDeps);

	// Synchronously updating the map should be fine, so we can avoid many useEffect
	// (but maybe we want to prioritise DOM updates and we move this into a useEffect)
	if (source) {
		for (let i = 0; i < reactive.length; i++) {
			const current = reactive[i];
			const prev = prevReactive.current[i];
			if (current !== prev) {
				const methodName = updateMethods[i];
				const method = source[methodName] as Function;
				method(current);
			}
		}
	}

	const eventListeners = eventMethods.map((x) => options[x]);
	useEffect(() => {
		if (source) {
			for (let i = 0; i < eventListeners.length; i++) {
				const fn = eventListeners[i];
				const event = events[i];
				source.on(event as any, fn as any);
			}
			return () => {
				for (let i = 0; i < eventListeners.length; i++) {
					source.un(events[i] as any, eventListeners[i] as any);
				}
			};
		}
	}, [source, ...eventListeners]);

	if (source) {
		return (
			<SourceContext.Provider value={source}>{children}</SourceContext.Provider>
		);
	} else {
		return null;
	}
};