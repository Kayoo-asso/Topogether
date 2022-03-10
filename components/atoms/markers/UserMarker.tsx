import React, { useCallback, useEffect, useState } from "react";
import { useAsyncEffect, useCircle, useMarker } from "helpers";
import { MarkerEventHandlers } from "types";

interface UserMarkerProps {
    onClick?: () => void,
    onUserPosChange?: (pos: google.maps.LatLngLiteral) => void,
}

export const UserMarker: React.FC<UserMarkerProps> = (props: UserMarkerProps) => {
    const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral>();
    const [userPositionAccuracy, setUserPositionAccuracy] = useState<number>();
    const [userHeading, setUserHeading] = useState<number | null>(null);

    useAsyncEffect((isAlive) => {
        const options = {
            // Timeout = 3 seconds (default = infinite). TODO: agree on the best value
            timeout: 3000,
            enableHighAccuracy: true,
        };
        const onPosChange = (pos: GeolocationPosition) => {
            if (isAlive.current) {
                const coords = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
                setUserPosition(coords);
                if (props.onUserPosChange) props.onUserPosChange(coords);            
                setUserPositionAccuracy(pos.coords.accuracy);
                setUserHeading(pos.coords.heading);
            }
        }
        const onError = (err: GeolocationPositionError) => {
            console.log(err);
        }
        const watcher = navigator.geolocation.watchPosition(onPosChange, onError, options);
        return () => {
            navigator.geolocation.clearWatch(watcher);
        }
    }, []);

    // Main blue dot
    const mainIcon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8, 
        fillOpacity: 1,
        fillColor: '#4EABFF',
        strokeColor: 'white',
        strokeWeight: 2,
    };
    const mainOptions: google.maps.MarkerOptions = {
        icon: mainIcon,
        zIndex: 5,
        cursor: 'inherit',
        position: userPosition
    };
    const mainHandlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(), [props.onClick]),
    }
    useMarker(mainOptions, mainHandlers);


    const circleOptions = {
        center: userPosition,
        radius: userPositionAccuracy,
        strokeWeight: 0,
        fillColor: "#4EABFF",
        fillOpacity: 0.3,
        cursor: 'grab',
        zIndex: 2,
    };
    useCircle(circleOptions);

    // Heading
    const headingIcon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
        rotation: userHeading || 0,
        scale: userHeading ? 12 : 0, 
        fillOpacity: userHeading ? 0.4 : 0,
        fillColor: '#4EABFF',
        strokeWeight: 0,
    };
    const headingOptions: google.maps.MarkerOptions = {
        icon: headingIcon,
        zIndex: 3,
        cursor: 'inherit',
        position: userPosition
    };
    const headingHandlers: MarkerEventHandlers = {}
    useMarker(headingOptions, headingHandlers);

    return null;
};

UserMarker.displayName = "UserMarker";