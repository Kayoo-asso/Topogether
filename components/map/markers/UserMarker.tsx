import React, { useCallback, useContext, useEffect, useState } from "react";
import { useCircle, useMarker } from "helpers/map";
import { MarkerEventHandlers } from "types";
import { useBreakpoint, usePosition } from "helpers/hooks";

interface UserMarkerProps {
	onClick?: (e: google.maps.MapMouseEvent) => void;
}

type DeviceOrientation = {
	alpha: number | null;
	beta: number | null;
	gamma: number | null;
};

export const UserMarker: React.FC<UserMarkerProps> = (
	props: UserMarkerProps
) => {
	const breakpoint = useBreakpoint();
	const { position, accuracy } = usePosition();
	const center = position
		? { lng: position[0], lat: position[1] }
		: { lng: 0, lat: 0 };
	const [orientation, setOrientation] = useState<DeviceOrientation>();
	const alpha = orientation?.alpha;

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
		window.addEventListener("click", handleClick);
		// Clean the event listener in case it did not get triggered
		return () => window.removeEventListener("click", handleClick);
	}, []);

	// Main blue dot
	const mainIcon: google.maps.Symbol = {
		path: window.google.maps.SymbolPath.CIRCLE,
		scale: 8,
		fillOpacity: 1,
		fillColor: "#4EABFF",
		strokeColor: "white",
		strokeWeight: 2,
	};
	const mainOptions: google.maps.MarkerOptions = {
		icon: mainIcon,
		zIndex: 5,
		cursor: "inherit",
		clickable: !!props.onClick,
		position: center,
	};
	const mainHandlers: MarkerEventHandlers = {
		onClick: useCallback(
			(e) => props.onClick && props.onClick(e),
			[props.onClick]
		),
	};
	useMarker(mainOptions, mainHandlers);

	//Precision circle
	const circleOptions: google.maps.CircleOptions = {
		center,
		radius: accuracy,
		strokeWeight: 0,
		fillColor: "#4EABFF",
		fillOpacity: 0.3,
		clickable: !!props.onClick,
		zIndex: 2,
	};
	useCircle(circleOptions);

	// Heading
	const headingIcon: google.maps.Symbol = {
		path: window.google.maps.SymbolPath.FORWARD_OPEN_ARROW,
		rotation: alpha ? 360 - alpha : 0,
		scale: alpha ? 6 : 0,
		fillOpacity: alpha && breakpoint === "mobile" ? 0.4 : 0,
		fillColor: "#4EABFF",
		strokeWeight: 0,
	};
	const headingOptions: google.maps.MarkerOptions = {
		icon: headingIcon,
		zIndex: 3,
		cursor: "inherit",
		label: "",
		position: center,
	};
	const headingHandlers: MarkerEventHandlers = {};
	useMarker(headingOptions, headingHandlers);

	return null;
};

UserMarker.displayName = "UserMarker";
