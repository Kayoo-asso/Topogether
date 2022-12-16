import { setReactRef } from "helpers/utils";
import { update } from "idb-keyval";
import {
	ForwardedRef,
	useEffect,
	useRef,
	useState,
} from "react";
import { Event, EventFn, eventHandlers, EventHandlers } from "./events";
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
	[EH in EventHandlers[Events]]?: EventFn<EH>;
};

export type InferOptions<UseBehavior extends (...args: any) => any> =
	Parameters<UseBehavior>[0];

type RemoveUndefined<T> = T extends undefined ? never : T;

export function createLifecycle<
	Options,
	T extends OLBase<any, any>,
	Events extends Event,
	ReactiveProps extends string & keyof RemoveUndefined<Options>,
	ResetProps extends string & keyof RemoveUndefined<Options>,
	D extends Definition<Options, Events, ReactiveProps, ResetProps>
>(constructor: new <_>(options: Options) => T, definition: D) {
	const events = definition.events;
	const handlers = events.map(ev => eventHandlers[ev])
	// const handlers = events.map((x) => eventHandlers[x]);
	const updateMethods = definition.reactive.map(setMethodName);

	// console.log(`=== Definition for ${constructor.name} ===`)
	// console.log(`-> Reset props = ${definition.reset}`)
	// console.log(`-> Handlers = ${handlers}`)
	// console.log(`-> Update methods = ${updateMethods}`)

	return function (
		props: BuildProps<Options, Events>,
		ref: ForwardedRef<T> | undefined
	) {
		const [instance, setInstance] = useState<T>();
		const observed = definition.reactive.map((x) => props[x]);
		const prevObserved = useRef(observed);
		const propsThatRequireAReset = definition.reset ? definition.reset.map(x => props[x]) : [];

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
		}, propsThatRequireAReset);

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
					if(fn) {
						instance.on(event, fn);
					}
				}
				return () => {
					for (let i = 0; i < eventFns.length; i++) {
						if(eventFns[i]) {
							instance.un(definition.events[i], eventFns[i]);
						}
					}
				};
			}
		}, [instance, ...eventFns]);

		return instance;
	};
}