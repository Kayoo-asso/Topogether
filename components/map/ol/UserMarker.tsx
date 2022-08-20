import { useBreakpoint, usePosition } from "helpers/hooks";
import { useEffect, useState } from "react";
import { GeoCoordinates } from "types";
import Circle from "ol/geom/Circle";
import { useMap } from "./Map";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Style, Fill } from "ol/style";
import { hexWithAlpha } from "./colors";

interface UserMarkerProps {
	// Probably not needed, can just use `usePosition`
	onClick?: (pos: GeoCoordinates) => void;
}

type DeviceOrientation = {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;
};

export function UserMarker(props: UserMarkerProps) {
	const map = useMap();
	const breakpoint = useBreakpoint();
	const { position, accuracy } = usePosition();
	const center = position || [0, 0];
	const [orientation, setOrientation] = useState<DeviceOrientation>();
	const alpha = orientation?.alpha;

	useEffect(() => {
		const circle = new Circle(fromLonLat(position || [0, 0]), accuracy || 100);
		const feature = new Feature({ geometry: circle });
		feature.setStyle(
			new Style({
				fill: new Fill({ color: hexWithAlpha("#4EABFF", 0.3) }),
				zIndex: 2,
			})
		);
		map.getla
	}, []);

	useEffect(() => {
		// Check for support before adding a listener
		if (!window.DeviceOrientationEvent) return;

		const onDeviceOrientation = (event: DeviceOrientationEvent): void => {
			// console.log("deviceorientation event:", event);
			setOrientation({
				alpha: event.alpha,
				beta: event.beta,
				gamma: event.gamma,
			});
		};
		window.addEventListener("deviceorientation", onDeviceOrientation);
		return () =>
			window.removeEventListener("deviceorientation", onDeviceOrientation);
	}, []);

	useEffect(() => {
		const handleClick = () => {
			if (
				window.DeviceOrientationEvent &&
				typeof (DeviceOrientationEvent as any).requestPermission === "function"
			) {
				// If this succeeds, we get data from the deviceorientation event
				// If it doesn't, oh well, we don't really care about it, we don't show anything
				(DeviceOrientationEvent as any).requestPermission();
			}
			// Clean itself up, to only request permission once
			window.removeEventListener("click", handleClick);
		};
		// window.addEventListener("click", handleClick);
		// Clean the event listener in case it did not get triggered
		return () => window.removeEventListener("click", handleClick);
	}, []);
}
