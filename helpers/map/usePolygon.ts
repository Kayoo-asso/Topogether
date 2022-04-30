import { useEffectWithDeepEqual } from "helpers";
import { MapContext } from "helpers/context";
import { useContext, useEffect, useRef } from "react";
import { PolygonEventHandlers, polygonEvents } from "types";

export function usePolygon(options: google.maps.PolygonOptions, handlers: PolygonEventHandlers) {
    const polygon = useRef<google.maps.Polygon>();
    const map = useContext(MapContext);

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
        const listeners: google.maps.MapsEventListener[] = [];
        if (polygon.current) {
            for (const [eventName, handlerName] of polygonEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = polygon.current.addListener(eventName, handler);
                    listeners.push(listener)
                }
            }
        }
        return () => {
            for (const listener of listeners) {
                listener.remove();
            }
        }
    }, [polygon.current, handlers.onClick, handlers.onContextMenu, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDragStart, handlers.onMouseDown, handlers.onMouseMove, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp]);

    return polygon;
}