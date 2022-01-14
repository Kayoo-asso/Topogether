import { MapContext } from "components";
import { useEffectWithDeepEqual } from "helpers";
import { useContext, useEffect, useRef, useState } from "react";
import { MarkerEventHandlers, markerEvents } from "types";

export function useMarker(options: google.maps.MarkerOptions, handlers: MarkerEventHandlers) {
    // const [marker, setMarker] = useState<google.maps.Marker>();
    const marker = useRef<google.maps.Marker>();
    const map = useContext(MapContext);
    const listeners = useRef<google.maps.MapsEventListener[]>([]);

    useEffect(() => {
        if (!marker.current) {
            marker.current = new google.maps.Marker({
                ...options,
                map
            });
        }
        return () => {
            if (marker.current) {
                marker.current.setMap(null);
            }
        }
    // do not include marker as a dependency here
    }, [map]);

    useEffectWithDeepEqual(() => {
        if (marker.current) {
            marker.current.setOptions({
                ...options,
                map,
            })
        }
    }, [marker.current, options])

    useEffect(() => {
        if (marker.current) {
            const l = [];
            for (const [eventName, handlerName] of markerEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = marker.current.addListener(eventName, handler);
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
    }, [marker.current, handlers.onAnimationChange, handlers.onClick, handlers.onClickableChange, handlers.onContextMenu, handlers.onCursorChange, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDraggableChange, handlers.onDragStart, handlers.onFlatChange, handlers.onIconChange, handlers.onMouseDown, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp, handlers.onPositionChange, handlers.onShapeChange, handlers.onTitleChange, handlers.onVisibleChange, handlers.onZIndexChange])
}