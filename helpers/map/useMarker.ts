import { MapContext } from "components";
import { useEffectWithDeepEqual } from "helpers";
import { useContext, useEffect, useRef, useState } from "react";
import { MarkerEventHandlers, markerEvents } from "types";

export function useMarker(options: google.maps.MarkerOptions, handlers: MarkerEventHandlers) {
    const [marker, setMarker] = useState<google.maps.Marker>();
    const map = useContext(MapContext);
    const listeners = useRef<google.maps.MapsEventListener[]>([]);

    useEffect(() => {
        if (!marker) {
            const m = new google.maps.Marker({
                ...options,
                map
            });
            setMarker(m);
        }
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        }
    // do not include marker as a dependency here
    }, [map]);

    useEffectWithDeepEqual(() => {
        if (marker) {
            marker.setOptions({
                ...options,
                map,
            })
        }
    }, [marker, options])

    useEffect(() => {
        if (marker) {
            const l = [];
            for (const [eventName, handlerName] of markerEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = marker.addListener(eventName, handler);
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
    }, [marker, handlers.onAnimationChange, handlers.onClick, handlers.onClickableChange, handlers.onContextMenu, handlers.onCursorChange, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDraggableChange, handlers.onDragStart, handlers.onFlatChange, handlers.onIconChange, handlers.onMouseDown, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp, handlers.onPositionChange, handlers.onShapeChange, handlers.onTitleChange, handlers.onVisibleChange, handlers.onZIndexChange])
}