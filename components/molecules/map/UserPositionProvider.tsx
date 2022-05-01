import React, { createContext, useState, useEffect } from "react"
import { GeoCoordinates } from "types"

export type UserPosition = {
    position: GeoCoordinates,
    accuracy: number,
    heading: number | null
}

const defaultPosition: UserPosition = {
    position: [0, 0],
    accuracy: 0,
    heading: null
}

export const UserPositionContext = createContext<UserPosition>(defaultPosition);

export const UserPositionProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const [position, setPosition] = useState(defaultPosition);

    useEffect(() => {
        const options: PositionOptions = {
            timeout: 3000,
            enableHighAccuracy: true
        };

        const onPosChange: PositionCallback = (pos) => {
            setPosition({
                position: [pos.coords.longitude, pos.coords.latitude],
                accuracy: pos.coords.accuracy,
                heading: pos.coords.heading
            });
        };

        const onError: PositionErrorCallback = (err) => {
            if (err.code === 3) {
                console.error('Geolocation timed out!');
            }
            else {
                console.error('Geolocation error:', err);
            }
        };

        const watcher = navigator.geolocation.watchPosition(
            onPosChange,
            onError,
            options
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    return <UserPositionContext.Provider value={position}>
        {children}
    </UserPositionContext.Provider>
}
