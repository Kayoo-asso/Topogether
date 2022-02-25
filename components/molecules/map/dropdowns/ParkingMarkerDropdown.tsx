import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { Parking } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';

interface PakingMarkerDropdownProps {
    parking: Quark<Parking>;
    dropdownPosition?: { x: number, y: number };
    deleteParking: (boulder: Quark<Parking>) => void;
}

export const PakingMarkerDropdown: React.FC<PakingMarkerDropdownProps> = watchDependencies((props: PakingMarkerDropdownProps) => {
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

PakingMarkerDropdown.displayName = 'PakingMarkerDropdown';
