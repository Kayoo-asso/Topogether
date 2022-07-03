import React, { createContext, useState, useEffect, useContext } from "react";
import { GeoCoordinates } from "types";

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

export const UserPositionProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [position, setPosition] = useState<UserPosition>(defaultPosition);

	useEffect(() => {
		const options: PositionOptions = {
			timeout: 3000,
			enableHighAccuracy: true,
		};

		const onPosChange: PositionCallback = (pos) => {
			setPosition({
				position: [pos.coords.longitude, pos.coords.latitude],
				accuracy: pos.coords.accuracy,
				heading: pos.coords.heading,
			});
		};

		const onError: PositionErrorCallback = (err) => {
			if (err.code === 3) {
				console.error("Geolocation timed out!");
			} else {
				console.error("Geolocation error:", err);
			}
		};

		const watcher = navigator.geolocation.watchPosition(onPosChange, onError, options);

		return () => navigator.geolocation.clearWatch(watcher);
	}, []);

	return <UserPositionContext.Provider value={position}>{children}</UserPositionContext.Provider>;
};
