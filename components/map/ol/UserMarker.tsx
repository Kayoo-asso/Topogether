import { useBreakpoint, usePosition } from "helpers/hooks";
import { useEffect, useState } from "react";
import { GeoCoordinates } from "types";
import Circle from "ol/geom/Circle";
import { useMap, useSource } from "./Map";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import { Style, Fill } from "ol/style";
import { hexWithAlpha } from "./colors";
import Geolocation from "ol/Geolocation";
import { fontainebleauLocation } from "helpers/constants";

interface UserMarkerProps {
	// Probably not needed, can just use `usePosition`
	onClick?: (pos: GeoCoordinates) => void;
}

export function UserMarker(props: UserMarkerProps) {
	const map = useMap();
	const source = useSource("user");
	const breakpoint = useBreakpoint();
	const { position, accuracy } = usePosition();
	const [orientation, setOrientation] = useState<DeviceOrientationEvent>();
	const alpha = orientation?.alpha;
	const [circle, setCircle] = useState<Circle>();
	const [feature, setFeature] = useState<Feature>();

	const center = fromLonLat(position || [0, 0]);
	const radius = accuracy || 0;

	useEffect(() => {
		const circle = new Circle(center, radius);
		const feature = new Feature({ geometry: circle });
		feature.setStyle(
			new Style({
				fill: new Fill({ color: hexWithAlpha("#4EABFF", 0.3) }),
				zIndex: 2,
			})
		);
		source.addFeature(feature);
		setCircle(circle);
		setFeature(feature);

		return () => source.removeFeature(feature);
	}, [source]);

	useEffect(() => {
		if (circle) {
			circle.setCenterAndRadius(center, radius);
		}
	}, [circle, position, radius]);

	useEffect(() => {
		// Check for support before adding a listener
		if (!window.DeviceOrientationEvent) return;

		window.addEventListener("deviceorientation", setOrientation);
		return () =>
			window.removeEventListener("deviceorientation", setOrientation);
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

	return null;
}
