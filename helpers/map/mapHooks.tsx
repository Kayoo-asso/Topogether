import { useEffect, useRef } from "react";
import equal from "fast-deep-equal/es6";
import {
	MarkerEventHandlers,
	markerEvents,
	PolygonEventHandlers,
	polygonEvents,
	PolylineEventHandlers,
	polylineEvents,
} from "types/MapTypes";
import { useCluster } from "components/map/markers/ClusterProvider";
import { useMap } from "components/map";

export function useMarker(
	options: google.maps.MarkerOptions,
	handlers: MarkerEventHandlers
) {
	const marker = useRef<google.maps.Marker>();
	const map = useMap();
	const cluster = useCluster();
	// console.log(map);
	// console.log(cluster);

	useEffect(() => {
		if (!marker.current) {
			const m = new google.maps.Marker({
				...options,
			});
			marker.current = m;

			if (cluster) {
				cluster.addMarker(m);
			} else {
				m.setMap(map);
			}
		}
		return () => {
			if (marker.current) {
				marker.current.setMap(null);
			}
		};
		// do not include marker as a dependency here
	}, [map, cluster]);

	useEffectWithDeepEqual(() => {
		if (marker.current) {
			marker.current.setOptions({
				...options,
			});
		}
	}, [marker.current, options]);

	useEffect(() => {
		const listeners: google.maps.MapsEventListener[] = [];
		if (marker.current) {
			for (const [eventName, handlerName] of markerEvents) {
				const handler = handlers[handlerName];
				if (handler) {
					const listener = marker.current.addListener(eventName, handler);
					listeners.push(listener);
				}
			}
		}

		return () => {
			for (const listener of listeners) {
				listener.remove();
			}
		};
	}, [
		marker.current,
		handlers.onAnimationChange,
		handlers.onClick,
		handlers.onClickableChange,
		handlers.onContextMenu,
		handlers.onCursorChange,
		handlers.onDoubleClick,
		handlers.onDrag,
		handlers.onDragEnd,
		handlers.onDraggableChange,
		handlers.onDragStart,
		handlers.onFlatChange,
		handlers.onIconChange,
		handlers.onMouseDown,
		handlers.onMouseOut,
		handlers.onMouseOver,
		handlers.onMouseUp,
		handlers.onPositionChange,
		handlers.onShapeChange,
		handlers.onTitleChange,
		handlers.onVisibleChange,
		handlers.onZIndexChange,
	]);

	return marker.current;
}

export function useCircle(options: google.maps.CircleOptions) {
	const circle = useRef<google.maps.Circle>();
	const map = useMap();

	useEffect(() => {
		if (!circle.current) {
			circle.current = new google.maps.Circle({
				...options,
				map,
			});
		}
		return () => {
			if (circle.current) {
				circle.current.setMap(null);
			}
		};
		// do not include marker as a dependency here
	}, [map]);

	useEffectWithDeepEqual(() => {
		if (circle.current) {
			circle.current.setOptions({
				...options,
				map,
			});
		}
	}, [circle.current, options]);
}

export function usePolygon(
	options: google.maps.PolygonOptions,
	handlers: PolygonEventHandlers
) {
	const polygon = useRef<google.maps.Polygon>();
	const map = useMap();

	useEffect(() => {
		if (!polygon.current) {
			polygon.current = new google.maps.Polygon({
				...options,
				map,
			});
		}
		return () => {
			if (polygon.current) {
				polygon.current.setMap(null);
			}
		};
		// do not include marker as a dependency here
	}, [map]);

	useEffectWithDeepEqual(() => {
		if (polygon.current) {
			polygon.current.setOptions({
				...options,
				map,
			});
		}
	}, [polygon.current, options]);

	useEffect(() => {
		const listeners: google.maps.MapsEventListener[] = [];
		if (polygon.current) {
			for (const [eventName, handlerName] of polygonEvents) {
				const handler = handlers[handlerName];
				if (handler) {
					const listener = polygon.current.addListener(eventName, handler);
					listeners.push(listener);
				}
			}
		}
		return () => {
			for (const listener of listeners) {
				listener.remove();
			}
		};
	}, [
		polygon.current,
		handlers.onClick,
		handlers.onContextMenu,
		handlers.onDoubleClick,
		handlers.onDrag,
		handlers.onDragEnd,
		handlers.onDragStart,
		handlers.onMouseDown,
		handlers.onMouseMove,
		handlers.onMouseOut,
		handlers.onMouseOver,
		handlers.onMouseUp,
	]);

	return polygon;
}

export function usePolyline(
	options: google.maps.PolylineOptions,
	handlers: PolylineEventHandlers
) {
	const polyline = useRef<google.maps.Polyline>();
	const map = useMap();

	useEffect(() => {
		if (!polyline.current) {
			polyline.current = new google.maps.Polyline({
				...options,
				map,
			});
		}
		return () => {
			if (polyline.current) {
				polyline.current.setMap(null);
			}
		};
		// do not include marker as a dependency here
	}, [map]);

	useEffectWithDeepEqual(() => {
		if (polyline.current) {
			polyline.current.setOptions({
				...options,
				map,
			});
		}
	}, [polyline.current, options]);

	useEffect(() => {
		const listeners: google.maps.MapsEventListener[] = [];
		if (polyline.current) {
			for (const [eventName, handlerName] of polylineEvents) {
				const handler = handlers[handlerName];
				if (handler) {
					const listener = polyline.current.addListener(eventName, handler);
					listeners.push(listener);
				}
			}
		}
		return () => {
			for (const listener of listeners) {
				listener.remove();
			}
		};
	}, [
		polyline.current,
		handlers.onClick,
		handlers.onContextMenu,
		handlers.onDoubleClick,
		handlers.onDrag,
		handlers.onDragEnd,
		handlers.onDragStart,
		handlers.onMouseDown,
		handlers.onMouseMove,
		handlers.onMouseOut,
		handlers.onMouseOver,
		handlers.onMouseUp,
	]);

	return polyline;
}

export function useEffectWithDeepEqual(
	callback: React.EffectCallback,
	deps: React.DependencyList
) {
	useEffect(callback, deps.map(useDeepMemo));
}

function useDeepMemo(value: unknown) {
	const ref = useRef<unknown>();
	if (!equal(value, ref.current)) {
		ref.current = value;
	}
	return ref.current;
}
