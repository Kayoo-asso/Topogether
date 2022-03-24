import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { Waypoint } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api, auth } from 'helpers/services';

interface WaypointMarkerDropdownProps {
    waypoint: Quark<Waypoint>;
    position?: { x: number, y: number };
    deleteWaypoint: (waypoint: Quark<Waypoint>) => void;
}

export const WaypointMarkerDropdown: React.FC<WaypointMarkerDropdownProps> = watchDependencies((props: WaypointMarkerDropdownProps) => {
    const session = auth.session();

    const deleteWaypoint = useCallback(() => props.deleteWaypoint(props.waypoint), [props.waypoint]);

    if (!session) return null;
    return (
        <Dropdown
            position={props.position}
            options={[
                { value: 'Supprimer', action: deleteWaypoint },
            ]}
        />
    );
});

WaypointMarkerDropdown.displayName = 'WaypointMarkerDropdown';
