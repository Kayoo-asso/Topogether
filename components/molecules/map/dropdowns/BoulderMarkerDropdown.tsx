import React, { useCallback } from 'react';
import { createTrack, Dropdown } from 'components';
import { Boulder, Track } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';

interface BoulderMarkerDropdownProps {
    boulder: Quark<Boulder>;
    dropdownPosition?: { x: number, y: number };
    toggleTrackSelect: (track: Quark<Track>, boulderQuark: Quark<Boulder>) => void;
    deleteBoulder: (boulder: Quark<Boulder>) => void;
}

export const BoulderMarkerDropdown: React.FC<BoulderMarkerDropdownProps> = watchDependencies((props: BoulderMarkerDropdownProps) => {
    const session = api.user();

    const addTrack = () => {
        if (session) {
            const trackQuark = createTrack(props.boulder(), session.id);
            props.toggleTrackSelect(trackQuark, props.boulder);
        }
    };
    const addImage = useCallback(() => console.log('Downloading the image...'), []);

    const deleteBoulder = useCallback(() => props.deleteBoulder(props.boulder), [props.boulder]);

    if (!session) return null;
    return (
        <Dropdown
            style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
            options={[
                { value: 'Ajouter un passage', action: addTrack },
                { value: 'Ajouter une image', disabled: true, action: addImage },
                { value: 'Supprimer', action: deleteBoulder },
            ]}
        />
    );
});

BoulderMarkerDropdown.displayName = 'BoulderMarkerDropdown';
