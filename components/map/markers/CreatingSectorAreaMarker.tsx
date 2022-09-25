import React, { useCallback, useEffect, useState } from "react";
import { createSector } from "helpers/builder";
import { usePolygon, usePolyline } from "helpers/map";
import { Quark, watchDependencies } from "helpers/quarky";
import { GeoCoordinates, MapEventHandlers, Sector, Topo, UUID } from "types";
import { useMap } from "..";
import { ValidationMarker } from "./ValidationMarker";
import { ModalRenameSector } from "components/organisms/builder/ModalRenameSector";
import { useSelectStore } from "components/pages/selectStore";

interface CreatingSectorAreaMarkerProps {
	topoQuark: Quark<Topo>,
	boulderOrder: Map<UUID, number>;
}

function addPoint(
	path: google.maps.LatLng[],
	point: google.maps.LatLng
): google.maps.LatLng[] {
	// add the point twice, the last point of the path is there to follow the map cursor
	if (path.length === 0) return [point, point];
	return [...path, point];
}

// Events we need to handle
// - window.keydown: ENTER or ESC
// - map.click: add point to path
// - polyline.click: add point to path (edge case, due to following mouse pointer)
// - map.move: last point in path follows mouse cursor
export const CreatingSectorAreaMarker: React.FC<
	CreatingSectorAreaMarkerProps
> = watchDependencies((props: CreatingSectorAreaMarkerProps) => {
	// NOTE: the last point of the path follows the mouse cursor, after we started drawing
	const flush = useSelectStore(s => s.flush);
	const [path, setPath] = useState<google.maps.LatLng[]>([]);
	const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();

	const moveHandler: MapEventHandlers["onMouseMove"] = (e) => {
		if (!startedDrawing || !e.latLng) return;
		const latlng = e.latLng;
		// Replace the last point with the current mouse position
		setPath((current) => {
			const newPath = current.slice();
			newPath[newPath.length - 1] = latlng;
			return newPath;
		});
	};
	const onClick = useCallback(
		(e: google.maps.MapMouseEvent) => {
			if (e.latLng) {
				const latlng = e.latLng;
				setPath((current) => addPoint(current, latlng));
			}
		},
		[setPath]
	);

	const map = useMap();
	const polygonOptions: google.maps.PolygonOptions = {
		paths: [...path],
		strokeColor: 'none',
		strokeOpacity: 0,
		fillColor: '#04D98B',
		fillOpacity: path.length > 3 ?  0.4 : 0,
	}
	usePolygon(polygonOptions, {
		onMouseMove: moveHandler,
		onClick
	});
	
	const polylineOptions: google.maps.PolylineOptions = {
		path: path,
		strokeColor: "#04D98B",
		strokeWeight: 2,
	};
	usePolyline(
		polylineOptions,
		{ onClick }
	);

	const startedDrawing = path.length > 0;
	useEffect(() => {
		// Use MapEventHandlers for the type, to avoid mistakes
		const clickHandler: MapEventHandlers["onClick"] = (e) => {
			if (e.latLng) {
				const latlng = e.latLng;
				setPath((current) => addPoint(current, latlng));
			}
			e.stop();
		};
		const clickListener = map.addListener("click", clickHandler);

		// Use MapEventHandlers for the type, to avoid mistakes
		// const moveHandler: MapEventHandlers["onMouseMove"] = (e) => {
		// 	if (!startedDrawing || !e.latLng) return;
		// 	const latlng = e.latLng;
		// 	// Replace the last point with the current mouse position
		// 	setPath((current) => {
		// 		const newPath = current.slice();
		// 		newPath[newPath.length - 1] = latlng;
		// 		return newPath;
		// 	});
		// };
		const moveListener = map.addListener("mousemove", moveHandler);

		let keyHandler = (e: KeyboardEvent) => {
			if (e.code === "Escape") setPath([]);
			else if (e.code === "Enter" && startedDrawing) {
				// add the last point (which follows the mouse cursor)
				// as a free point
				// TODO: if we move the cursor outside the Map and press enter,
				// this shoud add an unintended point, right?
				// Check if the map triggers a mousemove event with no LatLng before exiting
				setPath((current) => [...current, current[current.length - 1]]);
			}
		};
		window.addEventListener("keydown", keyHandler);

		return () => {
			clickListener.remove();
			moveListener.remove();
			window.removeEventListener("keydown", keyHandler);
		};
		// We do not need to get a dependency on `path`, which changes all the time
		// `startedDrawing` is sufficient
	}, [setPath, startedDrawing]);

	return (
		<>
			{path.length > 0 &&
				<ValidationMarker
					path={path}
					onClick={() => {
						// Remove the mouse cursor and close nicely
						path[path.length - 1] = path[0];
						const coords: GeoCoordinates[] = path.map((latlng) => [
							latlng.lng(),
							latlng.lat(),
						]);
						const newSector = createSector(
							props.topoQuark,
							coords,
							props.boulderOrder
						);
						setSectorToRename(() => newSector);
					}}
				/>
			}

			{sectorToRename &&
				<ModalRenameSector 
					sector={sectorToRename}
					firstNaming
					onClose={() => {
						flush.tool();
						setPath([]);
						setSectorToRename(undefined);
					}}
				/>
			}
		</>
	);
});

CreatingSectorAreaMarker.displayName = "Creating Sector AreaMarker";
