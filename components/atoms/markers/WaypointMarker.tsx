import React, { useCallback, useState } from "react";
import { markerSize, toLatLng, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, Waypoint } from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";

interface WaypointMarkerProps {
    waypoint: Quark<Waypoint>,
    draggable?: boolean,
    selected?: boolean,
    onClick?: (waypoint: Quark<Waypoint>) => void,
    onContextMenu?: (e: Event, waypoint: Quark<Waypoint>) => void,
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: WaypointMarkerProps) => {
    const waypoint = props.waypoint();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_help-round_bold.svg' : '/assets/icons/colored/_help-round.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(waypoint.location)
    };

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))
    const [blockClick, setBlockClick] = useState(false);
    const handleContextMenu= useCallback((e: google.maps.MapMouseEvent) => {
        const evt = e.domEvent;
        if (isMouseEvent(evt) && evt.button === 2 && props.onContextMenu) { //Right click
            props.onContextMenu(evt, props.waypoint);
        }
        else if (isTouchEvent(evt) || isPointerEvent(evt)) {
            setBlockClick(false);
            setTimer(setTimeout(() => { 
                props.onContextMenu!(evt, props.waypoint);
                setBlockClick(true);
            }, 800));
        }
    }, [props.waypoint, timer, blockClick, props.onContextMenu, props.onClick]);

    const handlers: MarkerEventHandlers = {
        onDragStart: useCallback(() => setBlockClick(true), []),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            setTimeout(() => setBlockClick(false), 5);
            if (e.latLng) {
                props.waypoint.set({
                    ...waypoint,
                    location: [e.latLng.lng(), e.latLng.lat()]
                })
            }
        }, [props.waypoint]),
        onContextMenu: handleContextMenu,
        onMouseDown: handleContextMenu,
        onMouseUp: useCallback((e: google.maps.MapMouseEvent) => {
            clearTimeout(timer);
            const evt = e.domEvent;   
            if (!blockClick && props.onClick) {
                if (isMouseEvent(evt) && evt.button !== 0) return;
                props.onClick(props.waypoint); 
            }
        }, [timer, blockClick, props.waypoint, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
});

WaypointMarker.displayName = "WaypointMarker";