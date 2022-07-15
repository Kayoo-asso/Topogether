import { staticUrl } from "helpers/constants";
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import { GeoCoordinates } from "types";
import { Breakpoint, useBreakpoint, useDevice } from "./DeviceProvider";
import { useFirstRender } from "./useFirstRender";
import { useModal } from "./useModal";
import isMobile from "ismobilejs";
import useDimensions from "react-cool-dimensions";

export type UserPosition = {
	position: GeoCoordinates | null;
	accuracy: number | null;
	heading: number | null;
};

const defaultPosition: UserPosition = {
	position: null,
	accuracy: null,
	heading: null,
};

const UserPositionContext = createContext<UserPosition>(defaultPosition);

export function usePosition() {
	return useContext(UserPositionContext);
}

export const UserPositionProvider = ({
	children,
}: React.PropsWithChildren<{}>) => {
	const [position, setPosition] = useState<UserPosition>(defaultPosition);
	const [ModalAskAccess, showModalAskAccess] = useModal();
	const [ModalUndenyAccess, showModalUndenyAccess] = useModal();

	const device = useDevice();
	const isIos = device.apple.device;

	const bp = useBreakpoint();
	
	useEffect(() => {
		// if (isIos) {
		// 	const permission = localStorage.getItem('geolocationPermission');
		// 	if (permission && permission === "denied") showModalUndenyAccess();
		// 	else if (permission && permission === "granted") launchGeolocation();
		// 	else showModalAskAccess();
		// }
		if (isIos) {
			const permission = localStorage.getItem('geolocationPermission');
			if (permission) {
				const success = () => launchGeolocation();
				const error: PositionErrorCallback = (err) => { showModalUndenyAccess(); console.log(err) };
				navigator.geolocation.getCurrentPosition(success, error)
			}
			else showModalAskAccess();
			
		}
		else {
			(async () => {
				const permission = await navigator.permissions.query({ name:'geolocation' });
				if (permission.state === "prompt") showModalAskAccess();
				else if (permission.state === "denied") showModalUndenyAccess();
				else launchGeolocation();
			})();
		}
	}, []);

	const launchGeolocation = () => {
		const options: PositionOptions = {
			timeout: 3000,
			enableHighAccuracy: true,
		};
		
		const onPosChange: PositionCallback = (pos) => {
			if (isIos && !position.position) localStorage.setItem("geolocationPermission", "granted");
			setPosition({
				position: [pos.coords.longitude, pos.coords.latitude],
				accuracy: pos.coords.accuracy,
				heading: pos.coords.heading,
			});
		};
		const onError: PositionErrorCallback = (err) => {
			if (err.code === 1) {
				if (isIos) localStorage.setItem("geolocationPermission", "denied");
				console.log(err.message);
			}
			else if (err.code === 3) {
				console.error("Geolocation timed out!");
			} else {
				console.error("Geolocation error:", err);
			}
		};

		const watcher = navigator.geolocation.watchPosition(
			onPosChange,
			onError,
			options
		);

		return () => navigator.geolocation.clearWatch(watcher);
	}

	const launchDeviceOrientation = () => {
		if (
			window.DeviceOrientationEvent &&
			typeof (DeviceOrientationEvent as any).requestPermission === "function"
		) {
			// If this succeeds, we get data from the deviceorientation event
			// If it doesn't, oh well, we don't really care about it, we don't show anything
			(DeviceOrientationEvent as any).requestPermission();
		}
	}

	return (
		<UserPositionContext.Provider value={position}>
			{children}

			<ModalAskAccess
				buttonText="Valider"
				imgUrl={staticUrl.defaultProfilePicture}
				onConfirm={() => {
					launchGeolocation();
					launchDeviceOrientation();	
				}}
				onClose={() => {
					launchGeolocation();
					launchDeviceOrientation();
				}}
			>
				Pour une expérience optimale, l'application va utiliser votre géolocalisation et l'orientation de votre téléphone.
			</ModalAskAccess>
			<ModalUndenyAccess
				buttonText="Valider"
				imgUrl={staticUrl.deleteWarning}
			>
				Ouuups ! Il semble que vous ayez refusé l'accès à la géolocalisation. Pour une app de topo, c'est embêtant.
				<br />
				<br />
				{/* TODO: specify text depending on the device and the navigator. */}
				Pour autoriser la géolocalisation, rendez-vous dans les paramètres de votre navigateur.
			</ModalUndenyAccess>
		</UserPositionContext.Provider>
	);
};
