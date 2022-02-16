import { MapContext } from "components";
import { useEffectWithDeepEqual } from "helpers";
import { useContext, useEffect, useRef } from "react";
import { PolygonEventHandlers, polygonEvents } from "types";

export function usePolygon(options: google.maps.PolygonOptions, handlers: PolygonEventHandlers) {
    const polygon = useRef<google.maps.Polygon>();
    const map = useContext(MapContext);
    const listeners = useRef<google.maps.MapsEventListener[]>([]);

    useEffect(() => {
        if (!polygon.current) {
            polygon.current = new google.maps.Polygon({
                ...options,
                map
            });
        }
        return () => {
            if (polygon.current) {
                polygon.current.setMap(null);
            }
        }
        // do not include marker as a dependency here
    }, [map]);

    useEffectWithDeepEqual(() => {
        if (polygon.current) {
            polygon.current.setOptions({
                ...options,
                map,
            })
        }
    }, [polygon.current, options])

    useEffect(() => {
        if (polygon.current) {
            const l = [];
            for (const [eventName, handlerName] of polygonEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = polygon.current.addListener(eventName, handler);
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
    }, [polygon.current, handlers.onClick, handlers.onContextMenu, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDragStart, handlers.onMouseDown, handlers.onMouseMove, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp]);

    return polygon;
}