import React, { MouseEvent, useCallback, useState } from "react";
import { boulderChanged, markerSize, toLatLng, useMarker } from "helpers";
import { Quark, SelectQuarkNullable, useCreateQuark, useQuarkyCallback, watchDependencies } from "helpers/quarky";
import { Boulder, GeoCoordinates, MarkerEventHandlers, Topo, UUID } from "types";

interface BoulderMarkerProps {
    boulder: Quark<Boulder>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder?: SelectQuarkNullable<Boulder>,
    topo?: Quark<Topo>,
    draggable?: boolean,
    onClick?: (boulder: Quark<Boulder>) => void,
    onContextMenu?: (e: Event, boulder: Quark<Boulder>) => void
}

export const isMouseEvent = (e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event | MouseEvent<HTMLDivElement, MouseEvent>): e is MouseEvent => (e as MouseEvent).button !== undefined;
export const isTouchEvent = (e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event | MouseEvent<HTMLDivElement, MouseEvent>): e is TouchEvent => (e as TouchEvent).touches !== undefined;
export const isPointerEvent = (e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event | MouseEvent<HTMLDivElement, MouseEvent>): e is PointerEvent => (e as PointerEvent).pointerType !== undefined;

export const BoulderMarker: React.FC<BoulderMarkerProps> = watchDependencies(({
    draggable = false,
    ...props
}: BoulderMarkerProps) => {
    const boulder = props.boulder();
    const selectedBoulder = props.selectedBoulder && props.selectedBoulder();
    const selected = selectedBoulder?.id === boulder.id;

    const icon: google.maps.Icon = {
        url: selected ? '/assets/icons/colored/_rock_bold.svg' : '/assets/icons/colored/_rock.svg',
        scaledSize: markerSize(30),
        labelOrigin: new google.maps.Point(15, 34)
    }

    const options: google.maps.MarkerOptions = {
        icon,
        draggable,
        position: toLatLng(boulder.location),
        opacity: selectedBoulder ? (selected ? 1 : 0.4) : 1,
        label: {
            text: (props.boulderOrder.get(boulder.id)! + (process.env.NODE_ENV === 'development' ? '. ' + boulder.name : '')).toString(),
            color: '#04D98B',
            fontFamily: 'Poppins',
            fontWeight: selected ? '700' : '500'
        }
    };

    const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(setTimeout(() => { }, 0))
    const isPressing = useCreateQuark(false);
    const isDragging = useCreateQuark(false);

    const handleContextMenu = useCallback((e: google.maps.MapMouseEvent) => {
        if (props.onContextMenu) {
            const evt = e.domEvent;
            if (isMouseEvent(evt) && evt.button === 2) { //Right click
                props.onContextMenu(evt, props.boulder);
            }
            else if (isTouchEvent(evt) || isPointerEvent(evt)) {
                setTimer(setTimeout(() => {
                    if (!isDragging()) {
                        isPressing.set(true);
                        props.onContextMenu!(evt, props.boulder);
                    }
                }, 800));
            }
        }
    }, [props.boulder, timer, props.onContextMenu, props.onClick]);

    const handlers: MarkerEventHandlers = {
        onDragStart: useCallback(() => isDragging.set(true), []),
        onDragEnd: useQuarkyCallback((e: google.maps.MapMouseEvent) => {
            setTimeout(() => isDragging.set(false), 5);
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
            if (!isDragging() && !isPressing() && props.onClick) {
                if (isMouseEvent(evt) && evt.button !== 0) return;
                props.onClick(props.boulder);
            }
            isPressing.set(false);
        }, [timer, props.boulder, props.onClick]),
    }
    useMarker(options, handlers);

    return null;
});

BoulderMarker.displayName = "BoulderMarker";