import React, { useCallback, useState } from "react";
import { markerSize, toLatLng, useMarker } from "helpers";
import { Quark, watchDependencies } from "helpers/quarky";
import { Parking, MarkerEventHandlers } from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";

interface ParkingMarkerProps {
    parking: Quark<Parking>,
    selected?: boolean,
    draggable?: boolean,
    onClick?: (parking: Quark<Parking>) => void,
    onContextMenu?: (e: Event, parking: Quark<Parking>) => void,
}

export const ParkingMarker: React.FC<ParkingMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: ParkingMarkerProps) => {
    const parking = props.parking();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_parking_bold.svg' : '/assets/icons/colored/_parking.svg',
        scaledSize: markerSize(30)
    };

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(parking.location)
    };

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))
    const [blockClick, setBlockClick] = useState(false);
    const handleContextMenu= useCallback((e: google.maps.MapMouseEvent) => {
        const evt = e.domEvent;
        if (isMouseEvent(evt) && evt.button === 2 && props.onContextMenu) { //Right click
            props.onContextMenu(evt, props.parking);
        }
        else if (isTouchEvent(evt) || isPointerEvent(evt)) {
            setBlockClick(false);
            setTimer(setTimeout(() => { 
                props.onContextMenu!(evt, props.parking);
                setBlockClick(true);
            }, 800));
        }
    }, [props.parking, timer, blockClick, props.onContextMenu, props.onClick]);

    const handlers: MarkerEventHandlers = {
        onDragStart: useCallback(() => setBlockClick(true), []),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            setTimeout(() => setBlockClick(false), 5);
            if (e.latLng) {
                props.parking.set({
                    ...parking,
                    location: [e.latLng.lng(), e.latLng.lat()]
                })
            }
        }, [props.parking]),
        onContextMenu: handleContextMenu,
        onMouseDown: handleContextMenu,
        onMouseUp: useCallback((e: google.maps.MapMouseEvent) => {
            clearTimeout(timer);
            const evt = e.domEvent;   
            if (!blockClick && props.onClick) {
                if (isMouseEvent(evt) && evt.button !== 0) return;
                props.onClick(props.parking); 
            }
        }, [timer, blockClick, props.parking, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
});

ParkingMarker.displayName = "ParkingMarker";