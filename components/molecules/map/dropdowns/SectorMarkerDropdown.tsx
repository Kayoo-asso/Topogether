import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { Sector } from 'types';
import { Quark, watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';

interface SectorMarkerDropdownProps {
    sector: Quark<Sector>;
    dropdownPosition?: { x: number, y: number };
    deleteSector: (sector: Quark<Sector>) => void;
    renameSector: (sector: Quark<Sector>) => void;

}

export const SectorMarkerDropdown: React.FC<SectorMarkerDropdownProps> = watchDependencies((props: SectorMarkerDropdownProps) => {
    const session = api.user();

    // surement que ces useCallback ne sont pas nécessaire si les props le sont
    const deleteSector = useCallback(() => props.deleteSector(props.sector), [props.sector]);
    const renameSector = useCallback(() => props.deleteSector(props.sector), [props.sector]);

    if (!session) return null;
    return (
        <Dropdown
            style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
            options={[
                { value: 'Renommer', action: renameSector },
                { value: 'Supprimer', action: deleteSector },
            ]}
        />
    );
});

SectorMarkerDropdown.displayName = 'SectorMarkerDropdown';
