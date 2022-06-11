import React, { useCallback, useContext, useEffect, useState } from "react";
import { OrientationContext, useCircle, useDevice, useDeviceOrientation, useMarker } from "helpers";
import { MarkerEventHandlers } from "types";
import { UserPositionContext } from "components/molecules/map/UserPositionProvider";

interface UserMarkerProps {
    onClick?: (e: google.maps.MapMouseEvent) => void,
}

export const UserMarker: React.FC<UserMarkerProps> = (props: UserMarkerProps) => {
    const { position, accuracy } = useContext(UserPositionContext);
    const center = position ? { lng: position[0], lat: position[1] } : { lng: 0, lat: 0};
    const device = useDevice();
    const orientation = useContext(OrientationContext); 

    // const { orientation, requestAccess, revokeAccess, error } = useDeviceOrientation();
    const [alpha, setAlpha] = useState(0);
    console.log(alpha);

    useEffect(() => {
        if (orientation?.alpha) setAlpha(orientation.alpha);
    }, [orientation])

    // useEffect(() => {
    //     const handleClick = () => {
    //       if (!alpha) requestAccess();
    //     }
    //     window.addEventListener('click', handleClick);
    //     return () => window.removeEventListener('click', handleClick);
    //   }, []);

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
        clickable: !!props.onClick,
        position: center
    };
    const mainHandlers: MarkerEventHandlers = {
        onClick: useCallback((e) => props.onClick && props.onClick(e), [props.onClick]),
    }
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
        rotation: alpha ? (360 - alpha) : 0,
        scale: alpha ? 6 : 0, 
        fillOpacity: (alpha && device === "mobile") ? 0.4 : 0,
        fillColor: '#4EABFF',
        strokeWeight: 0,
    };
    const headingOptions: google.maps.MarkerOptions = {
        icon: headingIcon,
        zIndex: 3,
        cursor: 'inherit',
        label: '',
        position: center
    };
    const headingHandlers: MarkerEventHandlers = {}
    useMarker(headingOptions, headingHandlers);

    return null;
};

UserMarker.displayName = "UserMarker";