import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Quark, useCreateQuark, watchDependencies } from "helpers/quarky";
import {
	GeoCoordinates,
	PolygonEventHandlers,
	PolyMouseEvent,
	Sector,
} from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";
import { toLatLng, usePolygon } from "helpers/map";
import { useMap } from "..";

interface SectorAreaMarkerProps {
	sector: Quark<Sector>;
	selected?: boolean;
	onClick?: (sector: Quark<Sector>) => void;
	onDragStart?: (e: PolyMouseEvent) => void;
	onDragEnd?: () => void;
	onContextMenu?: (e: Event, sector: Quark<Sector>) => void;
}

export const SectorAreaMarker: React.FC<SectorAreaMarkerProps> =
	watchDependencies(({ selected = false, ...props }: SectorAreaMarkerProps) => {
		const sector = props.sector();
		const map = useMap();

		const options: google.maps.PolygonOptions = {
			paths: sector.path.map((p) => toLatLng(p)),
			draggable: false,
			// draggable: !!props.onDragEnd,
			editable: !!props.onDragEnd,
			clickable: !!props.onClick,
			fillColor: "#04D98B",
			fillOpacity: selected ? 0.3 : 0,
			strokeColor: "#04D98B",
			strokeOpacity: selected ? 0.6 : 0.3,
			strokeWeight: 2,
		};
		let polygon: React.MutableRefObject<google.maps.Polygon | undefined>;
		let dragging = useRef(false);

		const updatePath = useCallback(() => {
			const newBounds: google.maps.LatLng[] | undefined = polygon.current
				?.getPath()
				.getArray();
			if (newBounds && !dragging.current) {
				const newPath: GeoCoordinates[] = newBounds.map((b) => [
					b.lng(),
					b.lat(),
				]);
				props.sector.set((s) => ({
					...s,
					path: newPath,
				}));
			}
		}, [props.sector, dragging]);

		const [timer, setTimer] = useState<ReturnType<typeof setTimeout>>(
			setTimeout(() => {}, 0)
		);
		const isPressing = useCreateQuark(false);

		const handleContextMenu = useCallback(
			(e: google.maps.MapMouseEvent) => {
				const evt = e.domEvent;
				if (isMouseEvent(evt) && evt.button === 2 && props.onContextMenu) {
					//Right click
					props.onContextMenu(evt, props.sector);
				} else if (isTouchEvent(evt) || isPointerEvent(evt)) {
					setTimer(
						setTimeout(() => {
							if (!dragging.current) {
								isPressing.set(true);
								props.onContextMenu!(evt, props.sector);
							}
						}, 800)
					);
				}
			},
			[props.sector, timer, props.onContextMenu, props.onClick]
		);

		const handlers: PolygonEventHandlers = {
			onDragStart: useCallback(
				(e) => {
					dragging.current = true;
					if (props.onDragStart) props.onDragStart(e);
				},
				[updatePath]
			),

			// Hack around Google Maps' weird behavior of not propagating the mouse move to the map
			onMouseMove: useCallback(
				(e: google.maps.PolyMouseEvent) => {
					if (!map) return;
					// google.maps.event.trigger(map, 'mousemove', e);
				},
				[map]
			),

			// onClick: useCallback((e: PolyMouseEvent) => {
			//     props.onClick && props.onClick(e)
			// }, [props.sector, props.onClick]),
			// onMouseMove: useCallback((e: google.maps.PolyMouseEvent) => props.onMouseMoveOnSector && props.onMouseMoveOnSector(e), [props.sector, props.onMouseMoveOnSector]),
			onDragEnd: useCallback(() => {
				dragging.current = false;
				updatePath();
				props.onDragEnd && props.onDragEnd();
			}, [updatePath, sector]),
			onContextMenu: handleContextMenu,
			onMouseDown: handleContextMenu,
			onMouseUp: useCallback(
				(e: google.maps.MapMouseEvent) => {
					clearTimeout(timer);
					const evt = e.domEvent;
					if (!dragging.current && !isPressing() && props.onClick) {
						if (isMouseEvent(evt) && evt.button !== 0) return;
						props.onClick(props.sector);
					}
					isPressing.set(false);
				},
				[timer, props.sector, props.onClick]
			),
		};
		polygon = usePolygon(options, handlers);

		useEffect(() => {
			if (polygon.current) {
				const l1 = google.maps.event.addListener(
					polygon.current.getPath(),
					"insert_at",
					updatePath
				);
				const l2 = google.maps.event.addListener(
					polygon.current.getPath(),
					"set_at",
					updatePath
				);
				const l3 = google.maps.event.addListener(
					polygon.current.getPath(),
					"remove_at",
					updatePath
				);
				return () => {
					l1.remove();
					l2.remove();
					l3.remove();
				};
			}
		}, [polygon.current?.getPath(), updatePath, props.sector]);

		return null;
	});

SectorAreaMarker.displayName = "Sector Area Marker";
