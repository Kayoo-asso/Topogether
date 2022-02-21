import React, { useCallback, useContext } from 'react';
import { createTrack, Dropdown } from 'components';
import { Boulder, Track } from 'types';
import { UserContext } from 'helpers';
import { Quark, SelectQuark, watchDependencies } from 'helpers/quarky';

interface BoulderMarkerDropdownProps {
    boulder: Quark<Boulder>;
    dropdownPosition?: { x: number, y: number };
    toggleTrackSelect: (track: Quark<Track>, boulderQuark: Quark<Boulder>) => void;
    deleteBoulder: (boulder: Quark<Boulder>) => void;
}

export const BoulderMarkerDropdown: React.FC<BoulderMarkerDropdownProps> = watchDependencies((props: BoulderMarkerDropdownProps) => {
    const { session } = useContext(UserContext);

    const addTrack = () => {
        const trackQuark = createTrack(props.boulder(), session!.id);
        props.toggleTrackSelect(trackQuark, props.boulder);
    };
    const addImage = useCallback(() => console.log('Downloading the topo...'), []);

    const deleteBoulder = useCallback(() => props.deleteBoulder(props.boulder), [props.boulder]);

    return (
        <Dropdown
            style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
            options={[
                { value: 'Ajouter un passage', action: addTrack },
                { value: 'Ajouter une image', action: addImage },
                { value: 'Supprimer', action: deleteBoulder },
            ]}
        />
    );
});

BoulderMarkerDropdown.displayName = 'BoulderMarkerDropdown';
