import type BaseEvent from "ol/events/Event";
import type { ObjectEvent } from "ol/Object";
import View, { ViewOptions } from "ol/View";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { setMethodName } from "./utils";

interface ViewProps extends React.PropsWithChildren<ViewOptions> {
	onChange(event: BaseEvent): void;
	onChangeCenter(event: ObjectEvent): void;
	onChangeResolution(event: ObjectEvent): void;
	onChangeRotation(event: ObjectEvent): void;
	onError(event: BaseEvent): void;
	onPropertyChange(event: ObjectEvent): void;
}

const ViewContext = createContext<View | null>(null);

export function useView(message?: string): View {
	const view = useContext(ViewContext);
	if (!view) {
		throw new Error(
			message || "useView should only used in children of a <View> component"
		);
	}
	return view;
}

// TODO: hint
const updateProps = [
	"center",
	"constrainResolution",
	"resolution",
	"rotation",
	"zoom",
	"minZoom",
	"maxZoom",
] as const;
const updateMethods = updateProps.map(setMethodName);
const resetProps: ReadonlyArray<keyof ViewOptions> = [] as const;

const events = [
	"change",
	"change:center",
	"change:resolution",
	"change:rotation",
	"error",
	"propertychange",
] as const;
const eventMethods = [
	"onChange",
	"onChangeCenter",
	"onChangeResolution",
	"onChangeRotation",
	"onError",
	"onPropertyChange",
] as const;

const Component = function (props: ViewProps) {
	const [view, setView] = useState<View>();
	const { children, ...options } = props;

	const reactive = updateProps.map((x) => options[x]);
	const prevReactive = useRef(reactive);

	// Those are the properties that, if they change, we have to blow out the View and recreate it
	// TBD whether automating this is a good idea
	const resetDeps = resetProps.map((x) => options[x]);

	useEffect(() => {
		const v = new View(options);
		setView(v);

		return () => v.dispose();
	}, resetDeps);

	// Synchronously updating the map should be fine, so we can avoid many useEffect
	// (but maybe we want to prioritise DOM updates and we move this into a useEffect)
	if (view) {
		for (let i = 0; i < reactive.length; i++) {
			const current = reactive[i];
			const prev = prevReactive.current[i];
			if (current !== prev) {
				const methodName = updateMethods[i];
				const method = view[methodName] as Function;
				method(current);
			}
		}
	}

	const eventListeners = eventMethods.map((x) => options[x]);
	useEffect(() => {
		if (view) {
			for (let i = 0; i < eventListeners.length; i++) {
				const fn = eventListeners[i];
				const event = events[i];
				view.on(event as any, fn);
			}
			return () => {
				for (let i = 0; i < eventListeners.length; i++) {
					view.un(events[i] as any, eventListeners[i]);
				}
			};
		}
	}, [view, ...eventListeners]);

	if (view) {
		return <ViewContext.Provider value={view}>{children}</ViewContext.Provider>;
	} else {
		return null;
	}
};

Component.displayName = "View";
export default Component;
