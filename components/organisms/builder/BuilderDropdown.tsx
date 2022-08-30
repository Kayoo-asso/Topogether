import { Dropdown, DropdownOption } from 'components/molecules';
import { InteractItem, SelectedNone, useSelectStore } from 'components/pages/selectStore';
import { createTrack } from 'helpers/builder';
import { Quark, watchDependencies } from 'helpers/quarky';
import { useSession } from 'helpers/services';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
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

    const showModal = useCallback(() => {
        console.log(props.dropdownItem.value());
        console.log(sectorToRename);
        setSectorToRename(() => props.dropdownItem.value as Quark<Sector>);


    }, [props.dropdownItem.value, sectorToRename, setSectorToRename]);

    const getOptions = useCallback((): DropdownOption[] => {
        if (props.dropdownItem.type === 'sector') 
            return [
                { value: "Renommer", action: showModal },
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
    }, [props.dropdownItem, props.dropdownItem.value, addTrack, showModal]);

    useEffect(() => {
        console.log(sectorToRename);
        if (sectorToRename) console.log(sectorToRename())
        else console.log('null')
    }, [sectorToRename])
   
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