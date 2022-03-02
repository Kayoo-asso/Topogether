import React, { useCallback, useEffect, useState } from "react";
import { useMarker } from "helpers";
import { MarkerEventHandlers } from "types";

interface UserMarkerProps {
    onClick?: () => void,
    onUserPosChange?: (pos: google.maps.LatLngLiteral) => void,
}

export const UserMarker: React.FC<UserMarkerProps> = (props: UserMarkerProps) => {
    const [userPosition, setUserPosition] = useState<google.maps.LatLngLiteral>();
    const [userPositionAccuracy, setUserPositionAccuracy] = useState<number>();
    const [userHeading, setUserHeading] = useState<number | null>(null);
    const [userSpeed, setUserSpeed] = useState<number | null>(null);
    const onPosChange = async ({ coords }: { coords: GeolocationCoordinates }) => {
        // console.log(coords);
        // alert(coords.heading);
        const pos = {
            lat: coords.latitude,
            lng: coords.longitude
        }
        setUserPosition(pos);
        if (props.onUserPosChange) props.onUserPosChange(pos);
        
        setUserPositionAccuracy(coords.accuracy);
        setUserHeading(coords.heading);
        setUserSpeed(coords.speed);
    } 
    useEffect(() => {
        let watcher: number;
        if (navigator.geolocation) {
            watcher = navigator.geolocation.watchPosition(
                onPosChange,
                err => console.log(err),
                { enableHighAccuracy: true, timeout: 10000 }
            )
        }
        return () => {
            navigator.geolocation.clearWatch(watcher);
        }
    }, []);

    // Main blue dot
    const icon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8, 
        fillOpacity: 1,
        fillColor: '#4EABFF',
        strokeColor: 'white',
        strokeWeight: 2,
    };
    const options: google.maps.MarkerOptions = {
        icon,
        zIndex: 5,
        cursor: 'inherit',
        position: userPosition
    };
    const handlers: MarkerEventHandlers = {
        onClick: useCallback(() => props.onClick && props.onClick(), [props.onClick]),
    }
    useMarker(options, handlers);

    // Precision blue area
    const precisionIcon: google.maps.Symbol = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: userPositionAccuracy ? Math.min(userPositionAccuracy, 50) : 50, 
        fillOpacity: 0.3,
        fillColor: '#4EABFF',
        strokeWeight: 0,
    };
    const precisionsOptions: google.maps.MarkerOptions = {
        icon: precisionIcon,
        zIndex: 2,
        cursor: 'inherit',
        position: userPosition
    };
    const precisionHandlers: MarkerEventHandlers = {}
    useMarker(precisionsOptions, precisionHandlers);

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