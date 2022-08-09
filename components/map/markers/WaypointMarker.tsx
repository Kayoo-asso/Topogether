import React, { useCallback, useState } from "react";
import { markerSize, toLatLng, useMarker } from "helpers/map";
import { Quark, useCreateQuark, watchDependencies } from "helpers/quarky";
import { MarkerEventHandlers, Waypoint } from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";

interface WaypointMarkerProps {
	waypoint: Quark<Waypoint>;
	draggable?: boolean;
	selected?: boolean;
	onClick?: (waypoint: Quark<Waypoint>) => void;
	onContextMenu?: (e: Event, waypoint: Quark<Waypoint>) => void;
}

export const WaypointMarker: React.FC<WaypointMarkerProps> = watchDependencies(
	({ draggable = false, selected = false, ...props }: WaypointMarkerProps) => {
		const waypoint = props.waypoint();

		const icon: google.maps.Icon = {
			url: selected
				? "/assets/icons/colored/_help-round_bold.svg"
				: "/assets/icons/colored/_help-round.svg",
			scaledSize: markerSize(30),
		};

		const options: google.maps.MarkerOptions = {
			icon,
			draggable,
			position: toLatLng(waypoint.location),
		};

		const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(
			setTimeout(() => {}, 0)
		);
		const isPressing = useCreateQuark(false);
		const isDragging = useCreateQuark(false);

		const handleContextMenu = useCallback(
			(e: google.maps.MapMouseEvent) => {
				if (props.onContextMenu) {
					const evt = e.domEvent;
					if (isMouseEvent(evt) && evt.button === 2) {
						//Right click
						props.onContextMenu(evt, props.waypoint);
					} else if (isTouchEvent(evt) || isPointerEvent(evt)) {
						setTimer(
							setTimeout(() => {
								if (!isDragging()) {
									isPressing.set(true);
									props.onContextMenu!(evt, props.waypoint);
								}
							}, 800)
						);
					}
				}
			},
			[props.waypoint, timer, props.onContextMenu, props.onClick]
		);

		const handlers: MarkerEventHandlers = {
			onDragStart: useCallback(() => isDragging.set(true), []),
			onDragEnd: useCallback(
				(e: google.maps.MapMouseEvent) => {
					setTimeout(() => isDragging.set(false), 5);
					if (e.latLng) {
						props.waypoint.set({
							...waypoint,
							location: [e.latLng.lng(), e.latLng.lat()],
						});
					}
				},
				[props.waypoint]
			),
			onContextMenu: handleContextMenu,
			onMouseDown: handleContextMenu,
			onMouseUp: useCallback(
				(e: google.maps.MapMouseEvent) => {
					clearTimeout(timer);
					const evt = e.domEvent;
					if (!isDragging() && !isPressing() && props.onClick) {
						if (isMouseEvent(evt) && evt.button !== 0) return;
						props.onClick(props.waypoint);
					}
					isPressing.set(false);
				},
				[timer, props.waypoint, props.onClick]
			),
		};
		useMarker(options, handlers);

		return null;
	}
);

WaypointMarker.displayName = "WaypointMarker";
