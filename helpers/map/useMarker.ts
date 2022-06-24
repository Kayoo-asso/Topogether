import { useEffectWithDeepEqual } from "helpers";
import { MapContext } from "helpers/context";
import { useContext, useEffect, useRef } from "react";
import { MarkerEventHandlers, markerEvents } from "types";

export function useMarker(options: google.maps.MarkerOptions, handlers: MarkerEventHandlers) { 
    const marker = useRef<google.maps.Marker>();
    const map = useContext(MapContext);

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
        const listeners: google.maps.MapsEventListener[] = [];
        if (marker.current) {
            for (const [eventName, handlerName] of markerEvents) {
                const handler = handlers[handlerName];
                if (handler) {
                    const listener = marker.current.addListener(eventName, handler);
                    listeners.push(listener) 
                }
            }
        }
        
        return () => {
            for (const listener of listeners) {
                listener.remove();
            }
        }
    }, [marker.current, handlers.onAnimationChange, handlers.onClick, handlers.onClickableChange, handlers.onContextMenu, handlers.onCursorChange, handlers.onDoubleClick, handlers.onDrag, handlers.onDragEnd, handlers.onDraggableChange, handlers.onDragStart, handlers.onFlatChange, handlers.onIconChange, handlers.onMouseDown, handlers.onMouseOut, handlers.onMouseOver, handlers.onMouseUp, handlers.onPositionChange, handlers.onShapeChange, handlers.onTitleChange, handlers.onVisibleChange, handlers.onZIndexChange])
    
    return marker.current;
}