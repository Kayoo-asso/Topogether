import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { Waypoint } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';

interface WaypointMarkerDropdownProps {
    waypoint: Quark<Waypoint>;
    dropdownPosition?: { x: number, y: number };
    deleteWaypoint: (waypoint: Quark<Waypoint>) => void;
}

export const WayPointMarkerDropdown: React.FC<WaypointMarkerDropdownProps> = watchDependencies((props: WaypointMarkerDropdownProps) => {
    const session = api.user();

    const deleteWayPoint = useCallback(() => props.deleteWaypoint(props.waypoint), [props.waypoint]);

    if (!session) return null;
    return (
        <Dropdown
            style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
            options={[
                { value: 'Supprimer', action: deleteWayPoint },
            ]}
        />
    );
});

WayPointMarkerDropdown.displayName = 'WaypointMarkerDropdown';
