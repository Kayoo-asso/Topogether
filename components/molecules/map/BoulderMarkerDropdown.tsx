import React, { useCallback, useContext } from 'react';
import { createTrack, Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { Boulder, UUID } from 'types';
import { UserContext } from 'helpers';

interface BoulderMarkerDropdownProps {
    boulder: Boulder;
    dropdownPosition?: { x: number, y: number };
}

export const BoulderMarkerDropdown: React.FC<BoulderMarkerDropdownProps> = React.memo((props: BoulderMarkerDropdownProps) => {
    const { session } = useContext(UserContext);

    const addTrack = () => {console.log('trololol'); createTrack(props.boulder, session!.id)};
    const addImage = useCallback(() => console.log('Downloading the topo...'), []);

    const deleteBoulder = useCallback(() => console.log('Deleting topo...'), []);

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
}, equal);

BoulderMarkerDropdown.displayName = 'BoulderMarkerDropdown';
