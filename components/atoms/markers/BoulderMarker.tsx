import React, { MouseEvent, useCallback, useState } from "react";
import { boulderChanged, markerSize, toLatLng, useMarker } from "helpers";
import { Quark, useQuarkyCallback, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, MarkerEventHandlers, Topo, UUID } from "types";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    boulderOrder: Map<UUID, number>,
    selected?: boolean,
    topo?: Quark<Topo>,
    draggable?: boolean,
    onClick?: (boulder: Quark<Boulder>) => void,
    onContextMenu?: (e: Event, boulder: Quark<Boulder>) => void
}

export const isMouseEvent = (e: MouseEvent|TouchEvent|PointerEvent|KeyboardEvent|Event|MouseEvent<HTMLDivElement, MouseEvent>): e is MouseEvent => (e as MouseEvent).button !== undefined;
export const isTouchEvent = (e: MouseEvent|TouchEvent|PointerEvent|KeyboardEvent|Event|MouseEvent<HTMLDivElement, MouseEvent>): e is TouchEvent => (e as TouchEvent).touches !== undefined;
export const isPointerEvent = (e: MouseEvent|TouchEvent|PointerEvent|KeyboardEvent|Event|MouseEvent<HTMLDivElement, MouseEvent>): e is PointerEvent => (e as PointerEvent).pointerType !== undefined;

export const BoulderMarker: React.FC<BoulderMarkerProps> = watchDependencies(({
    draggable = false,
    selected = false,
    ...props
}: BoulderMarkerProps) => {
    const boulder = props.boulder();

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_rock_bold.svg' : '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
        labelOrigin: new google.maps.Point(15, 34)
    }

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(boulder.location),
        label: {
            text: (props.boulderOrder.get(boulder.id)! + (process.env.NODE_ENV === 'development' ? '. '+boulder.name : '')).toString(),
            color: '#04D98B',
            fontFamily: 'Poppins',
            fontWeight: selected ? '700' : '500'
        }
    };

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => {}, 0))
    const [blockClick, setBlockClick] = useState(false);
    const handleContextMenu= useCallback((e: google.maps.MapMouseEvent) => {
        const evt = e.domEvent;
        if (isMouseEvent(evt) && evt.button === 2 && props.onContextMenu) { //Right click
            props.onContextMenu(evt, props.boulder);
        }
        else if (isTouchEvent(evt) || isPointerEvent(evt)) {
            setBlockClick(false);
            setTimer(setTimeout(() => { 
                props.onContextMenu!(evt, props.boulder);
                setBlockClick(true);
            }, 800));
        }
    }, [props.boulder, timer, blockClick, props.onContextMenu, props.onClick]);

    const handlers: MarkerEventHandlers = {
        onDragStart: useCallback(() => setBlockClick(true), []),
        onDragEnd: useQuarkyCallback((e: google.maps.MapMouseEvent) => {
            setTimeout(() => setBlockClick(false), 5);
            if (e.latLng) {
                const loc: GeoCoordinates = [e.latLng.lng(), e.latLng.lat()];
                props.boulder.set({
                    ...boulder,
                    location: loc
                });
                boulderChanged(props.topo!, boulder.id, loc);
            }
        }, [props.topo, boulder]),
        onContextMenu: handleContextMenu,
        onMouseDown: handleContextMenu,
        onMouseUp: useCallback((e: google.maps.MapMouseEvent) => {
            clearTimeout(timer);
            const evt = e.domEvent;   
            if (!blockClick && props.onClick) {
                if (isMouseEvent(evt) && evt.button !== 0) return;
                props.onClick(props.boulder); 
            }
        }, [timer, blockClick, props.boulder, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";