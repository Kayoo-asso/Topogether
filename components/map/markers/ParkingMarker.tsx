import React, { useCallback, useEffect, useState } from "react";
import { Quark, useCreateQuark, watchDependencies } from "helpers/quarky";
import { Parking, MarkerEventHandlers } from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";
import { markerSize, toLatLng, useMarker } from "helpers/map";

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
    const isPressing = useCreateQuark(false);
    const isDragging = useCreateQuark(false);

    const handleContextMenu = useCallback((e: google.maps.MapMouseEvent) => {
        const evt = e.domEvent;
        if (isMouseEvent(evt) && evt.button === 2 && props.onContextMenu) { //Right click
            props.onContextMenu(evt, props.parking);
        }
        else if (isTouchEvent(evt) || isPointerEvent(evt)) {         
            setTimer(setTimeout(() => { 
                if (!isDragging()) {
                    isPressing.set(true);
                    props.onContextMenu!(evt, props.parking);
                }
            }, 800));
        }
    }, [props.parking, timer, props.onContextMenu, props.onClick]);

    const handlers: MarkerEventHandlers = {
        onDragStart: useCallback(() => { isDragging.set(true) }, []),
        onDragEnd: useCallback((e: google.maps.MapMouseEvent) => {
            setTimeout(() => isDragging.set(false), 5);
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
            if (!isPressing() && !isDragging() && props.onClick) {
                if (isMouseEvent(evt) && evt.button !== 0) return;
                props.onClick(props.parking); 
            }
            isPressing.set(false);
        }, [timer, props.parking, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
});

ParkingMarker.displayName = "ParkingMarker";