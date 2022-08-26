import React, {
	useCallback,
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
	Topo,
	UUID,
} from "types";
import { isMouseEvent, isPointerEvent, isTouchEvent } from "./BoulderMarker";
import { toLatLng, usePolygon } from "helpers/map";
import { useMap } from "..";
import { sectorChanged } from "helpers/builder";
import { useSelectStore } from "components/pages/selectStore";

interface SectorAreaMarkerProps {
	topoQuark: Quark<Topo>,
	sector: Quark<Sector>,
	boulderOrder: Map<UUID, number>,
	isOnBuilder?: boolean;
	onClick?: (sector: Quark<Sector>) => void;
	onContextMenu?: (e: Event, sector: Quark<Sector>) => void;
}

export const SectorAreaMarker: React.FC<SectorAreaMarkerProps> =
	watchDependencies((props: SectorAreaMarkerProps) => {
		const select = useSelectStore(s => s.select);
		const flush = useSelectStore(s => s.flush);
		const item = useSelectStore(s => { if (s.item.type === 'sector') return s.item });

		const sector = props.sector();
		const selected = item && item.value().id === sector.id;
		const map = useMap();

		const options: google.maps.PolygonOptions = {
			paths: sector.path.map((p) => toLatLng(p)),
			draggable: props.isOnBuilder && selected,
			editable: props.isOnBuilder && selected,
			clickable: props.isOnBuilder,
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
					if (selected) dragging.current = true;
				},
				[selected]
			),
			// Hack around Google Maps' weird behavior of not propagating the mouse move to the map
			// onMouseMove: useCallback(
			// 	(e: google.maps.PolyMouseEvent) => {
			// 		if (!map) return;
			// 		// google.maps.event.trigger(map, 'mousemove', e);
			// 	},
			// 	[map]
			// ),
			onClick: useCallback((e: PolyMouseEvent) => {
			    if (selected) flush.item();
				else select.sector(props.sector);
			}, [props.sector, selected]),
			// onMouseMove: useCallback((e: google.maps.PolyMouseEvent) => props.onMouseMoveOnSector && props.onMouseMoveOnSector(e), [props.sector, props.onMouseMoveOnSector]),
			onDragEnd: useCallback(() => {
				if (dragging.current) {
					dragging.current = false;
					updatePath();
					sectorChanged(props.topoQuark, sector.id, props.boulderOrder);
				}
			}, [updatePath, props.topoQuark, sector.id, props.boulderOrder]),
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
