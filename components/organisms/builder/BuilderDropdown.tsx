import { Dropdown, DropdownOption } from 'components/molecules';
import { InteractItem, SelectedNone, useSelectStore } from 'components/pages/selectStore';
import { createTrack } from 'helpers/builder';
import { Quark, watchDependencies } from 'helpers/quarky';
import { useSession } from 'helpers/services';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Boulder, Sector } from 'types';
import { ModalRenameSector } from './ModalRenameSector';

interface BuilderDropdownProps {
    position: { x: number; y: number };
    dropdownItem: Exclude<InteractItem, SelectedNone>,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    setDeleteItem: Dispatch<SetStateAction<InteractItem>>,
}

export const BuilderDropdown: React.FC<BuilderDropdownProps> = watchDependencies(
    (props: BuilderDropdownProps) => {
    const session = useSession();
    const selectTack = useSelectStore(s => s.select.track);

    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();
    const addTrack = useCallback(() => {
        if (session) {
            const boulderQuark = props.dropdownItem.value as Quark<Boulder>
            const trackQuark = createTrack(boulderQuark(), session.id);
            selectTack(trackQuark, boulderQuark);
        }
    }, [props.dropdownItem, session]);

    const getOptions = (): DropdownOption[] => {
        if (props.dropdownItem.type === 'sector') 
            return [
                { value: "Renommer", action: () => setSectorToRename(props.dropdownItem.value as Quark<Sector>) },
                { value: "Supprimer", action: () => props.setDeleteItem(props.dropdownItem) },
            ]
        else if (props.dropdownItem.type === 'boulder')
            return [
                { value: "Ajouter un passage", action: addTrack },
                { value: "Supprimer", action: () => props.setDeleteItem(props.dropdownItem) },
            ];
        else if (props.dropdownItem.type === 'parking')
            return [{ value: "Supprimer", action: () => props.setDeleteItem(props.dropdownItem) }]
        else // Case Waypoint
            return [{ value: "Supprimer", action: () => props.setDeleteItem(props.dropdownItem) }]
    }
   
    return (
        <>
            <Dropdown 
                position={props.position}
                options={getOptions()}
                onSelect={() => props.setDropdownItem({ type:'none', value: undefined })}
            />

            {sectorToRename &&
                <ModalRenameSector 
                    sector={sectorToRename}
                    onClose={() => setSectorToRename(undefined)}
                />
            }
        </>
    )
})

BuilderDropdown.displayName = "BuilderDropdown";