import React, { useCallback, useContext } from "react";
import { useCircle, useMarker } from "helpers";
import { MarkerEventHandlers } from "types";
import { UserPositionContext } from "components/molecules/map/UserPositionProvider";

interface UserMarkerProps {
    onClick?: (e: google.maps.MapMouseEvent) => void,
}

export const UserMarker: React.FC<UserMarkerProps> = (props: UserMarkerProps) => {
    const { position, accuracy, heading } = useContext(UserPositionContext);
    const center = { lng: position[0], lat: position[1] };

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
        path: window.google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
        rotation: heading || 0,
        scale: heading ? 12 : 0, 
        fillOpacity: heading ? 0.4 : 0,
        fillColor: '#4EABFF',
        strokeWeight: 0,
    };
    const headingOptions: google.maps.MarkerOptions = {
        icon: headingIcon,
        zIndex: 3,
        cursor: 'inherit',
        position: center
    };
    const headingHandlers: MarkerEventHandlers = {}
    useMarker(headingOptions, headingHandlers);

    return null;
};

UserMarker.displayName = "UserMarker";