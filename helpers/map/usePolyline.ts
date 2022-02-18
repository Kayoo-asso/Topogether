import { MapContext } from "components";
import { useEffectWithDeepEqual } from "helpers";
import { useContext, useEffect, useRef } from "react";
import { PolygonEventHandlers, polylineEvents } from "types";

export function usePolyline(options: google.maps.PolylineOptions, handlers: PolygonEventHandlers) {
    const polyline = useRef<google.maps.Polyline>();
    const map = useContext(MapContext);
    const listeners = useRef<google.maps.MapsEventListener[]>([]);

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
        if (polyline.current) {
            const l = [];
            for (const [eventName, handlerName] of polylineEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = polyline.current.addListener(eventName, handler);
                    l.push(listener)
                }
            }
            listeners.current = l;
        }
        return () => {
            for (const listener of listeners.current) {
                listener.remove();
            }
            listeners.current = [];
        }
    }, [polyline.current, handlers.onClick, handlers.onContextMenu, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDragStart, handlers.onMouseDown, handlers.onMouseMove, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp]);

    return polyline;
}