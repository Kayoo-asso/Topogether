import { Dropdown, DropdownOption } from 'components/molecules';
import { createTrack } from 'helpers/builder';
import { Quark, watchDependencies } from 'helpers/quarky';
import { useSession } from 'helpers/services';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { Boulder, Sector, Topo } from 'types';
import { InteractItem, SelectedItem, SelectedNone } from 'types/SelectedItems';
import { ModalRenameSector } from './ModalRenameSector';

interface BuilderDropdownProps {
    position: { x: number; y: number };
    dropdownItem: Exclude<InteractItem, SelectedNone>,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    selectedItem: SelectedItem,
    setSelectedItem: Dispatch<SetStateAction<SelectedItem>>,
    setDeleteItem: Dispatch<SetStateAction<InteractItem>>,
}

export const BuilderDropdown: React.FC<BuilderDropdownProps> = watchDependencies(
    (props: BuilderDropdownProps) => {
    const session = useSession();

    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();
    const addTrack = useCallback(() => {
        if (session) {
            const boulderQuark = props.dropdownItem.value as Quark<Boulder>
            const trackQuark = createTrack(boulderQuark(), session.id);
            props.setSelectedItem({ type: 'boulder', value: boulderQuark, selectedTrack: trackQuark })
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
                onSelect={() => props.setDropdownItem({ type:'none' })}
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