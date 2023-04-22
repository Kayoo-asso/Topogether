import { setReactRef } from "helpers/utils";
import { ForwardedRef, useEffect, useRef, useState } from "react";
import {
	baseEvents,
	e,
	Event,
	EventFn,
	eventHandlers,
	EventHandlers,
} from "./events";
import { setMethodName } from "./utils";
import { useEffectDeepEqual } from "components/openlayers/useEffectDeepEqual";

type BaseEvents = keyof typeof baseEvents;

interface OLBase<Events, Handlers> {
	on: (event: Events, handler: Handlers) => void;
	un: (event: Events, handler: Handlers) => void;
	dispose?: () => void;
}

type BuildProps<Options, Events extends Event> = RemoveUndefined<Options> & {
	[EH in EventHandlers[Events]]?: EventFn<EH>;
};

export type InferOptions<Fn extends UseBehavior<any, any, any>> =
	Fn extends UseBehavior<infer Options, any, infer Events>
		? BuildProps<Options, Events>
		: never;

type RemoveUndefined<T> = T extends undefined ? never : T;

type UseBehavior<Options, T extends OLBase<any, any>, E extends Event> = (
	props: BuildProps<Options, E>,
	ref: ForwardedRef<T> | undefined
) => T | undefined;

export function createLifecycle<
	Options,
	T extends OLBase<any, any>,
	E extends Event
>(
	constructor:
		| (new (options: Options) => T)
		| (new (options?: Options) => T)
		| (new <_>(options: Options) => T),
	events: Array<E>,
	reactive: Array<string & keyof Options>,
	reset: Array<string & keyof Options> = []
): UseBehavior<Options, T, E | BaseEvents> {
	events.push(...(e(baseEvents) as any));
	const handlers = events.map((ev) => eventHandlers[ev]);
	const updateMethods = reactive.map(setMethodName);

	return function (
		props: BuildProps<Options, E | BaseEvents>,
		ref: ForwardedRef<T> | undefined
	) {
		const [instance, setInstance] = useState<T>();
		const observed = reactive.map((x) => props[x]);
		const propsThatRequireAReset = reset ? reset.map((x) => props[x]) : [];

		useEffectDeepEqual(() => {
			// Do we need to delete eventFns from the props before instantiation?
			const obj = new constructor(props);
			setInstance(obj);

			return () => {
				if (obj.dispose) {
					obj.dispose();
				}
			};
		}, propsThatRequireAReset);

		// ForwardRef
		// Can't use `useImperativeHandle` because we can't return null or undefined there
		useEffect(() => {
			if (ref && instance) {
				setReactRef(ref, instance);
			}
		}, [ref, instance]);

		// Reactive properties
		for (let i = 0; i < observed.length; i++) {
			const current = observed[i];
			useEffectDeepEqual(() => {
				if (instance) {
					const methodName = updateMethods[i];
					((instance as any)[methodName] as Function)(current);
				}
			}, [current]);
		}

		// Event listeners
		const eventFns = handlers.map((x) => (props as any)[x]);
		useEffect(() => {
			if (instance) {
				for (let i = 0; i < eventFns.length; i++) {
					const fn = eventFns[i];
					const event = events[i];
					if (fn) {
						instance.on(event, fn);
					}
				}
				return () => {
					for (let i = 0; i < eventFns.length; i++) {
						if (eventFns[i]) {
							instance.un(events[i], eventFns[i]);
						}
					}
				};
			}
		}, [instance, ...eventFns]);

		return instance;
	};
}
