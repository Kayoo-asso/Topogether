import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { Parking } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';

interface ParkingMarkerDropdownProps {
    parking: Quark<Parking>;
    dropdownPosition?: { x: number, y: number };
    deleteParking: (parking: Quark<Parking>) => void;
}

export const ParkingMarkerDropdown: React.FC<ParkingMarkerDropdownProps> = watchDependencies((props: ParkingMarkerDropdownProps) => {
    const session = api.user();

    const deleteParking = useCallback(() => props.deleteParking(props.parking), [props.parking]);

    if (!session) return null;
    return (
        <Dropdown
            style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
            options={[
                { value: 'Supprimer', action: deleteParking },
            ]}
        />
    );
});

ParkingMarkerDropdown.displayName = 'ParkingMarkerDropdown';
