import { useEffectWithDeepEqual } from "helpers";
import { MapContext } from "helpers/context";
import { useContext, useEffect, useRef } from "react";
import { PolygonEventHandlers, polylineEvents } from "types";

export function usePolyline(options: google.maps.PolylineOptions, handlers: PolygonEventHandlers) {
    const polyline = useRef<google.maps.Polyline>();
    const map = useContext(MapContext);

    useEffect(() => {
        if (!polyline.current) {
            polyline.current = new google.maps.Polyline({
                ...options,
                map
            });
        }
        return () => {
            if (polyline.current) {
                polyline.current.setMap(null);
            }
        }
        // do not include marker as a dependency here
    }, [map]);

    useEffectWithDeepEqual(() => {
        if (polyline.current) {
            polyline.current.setOptions({
                ...options,
                map,
            })
        }
    }, [polyline.current, options])

    useEffect(() => {
        const listeners: google.maps.MapsEventListener[] = [];
        if (polyline.current) {
            for (const [eventName, handlerName] of polylineEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = polyline.current.addListener(eventName, handler);
                    listeners.push(listener)
                }
            }
        }
        return () => {
            for (const listener of listeners) {
                listener.remove();
            }
        }
    }, [polyline.current, handlers.onClick, handlers.onContextMenu, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDragStart, handlers.onMouseDown, handlers.onMouseMove, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp]);

    return polyline;
}