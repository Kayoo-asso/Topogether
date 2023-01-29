import { InteractItem, useSelectStore } from 'components/pages/selectStore';
import { createTrack } from 'helpers/builder';
import { Quark, watchDependencies } from 'helpers/quarky';
import { useSession } from 'helpers/services';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Boulder, Sector } from 'types';
import { ModalRenameSector } from './ModalRenameSector';
import { Dropdown, DropdownOption } from 'components/molecules/form/Dropdown';

interface BuilderDropdownProps {
    position?: { x: number; y: number };
    dropdownItem?: InteractItem,
    setDropdownItem: Dispatch<SetStateAction<InteractItem>>,
    setDeleteItem: Dispatch<SetStateAction<InteractItem>>,
}

export const BuilderDropdown: React.FC<BuilderDropdownProps> = watchDependencies(
    (props: BuilderDropdownProps) => {
    const session = useSession();
    const selectTack = useSelectStore(s => s.select.track);
        
    const [sectorToRename, setSectorToRename] = useState<Quark<Sector>>();
    
    const addTrack = useCallback((bQuark: Quark<Boulder>) => {
        if (session) {
            const trackQuark = createTrack(bQuark(), session.id);
            selectTack(trackQuark, bQuark);
        }
    }, [session]);

    const getOptions = useCallback((): DropdownOption[] => {
        const item = props.dropdownItem!;
        if (item.type === 'sector') 
            return [
                { value: "Renommer", action: () => setSectorToRename(() => item.value as Quark<Sector>) },
                { value: "Supprimer", action: () => props.setDeleteItem(item) },
            ]
        else if (item.type === 'boulder')
            return [
                { value: "Ajouter un passage", action: () => addTrack(item.value as Quark<Boulder>) },
                { value: "Supprimer", action: () => props.setDeleteItem(item) },
            ];
        else if (item.type === 'parking')
            return [{ value: "Supprimer", action: () => props.setDeleteItem(item) }]
        else // Case Waypoint
            return [{ value: "Supprimer", action: () => props.setDeleteItem(item) }]
    }, [props.dropdownItem, addTrack]);
   
    return (
        <>
            {props.position && props.dropdownItem && props.dropdownItem.type !== 'none' &&
                <Dropdown 
                    position={props.position}
                    options={getOptions()}
                    onSelect={() => props.setDropdownItem({ type:'none', value: undefined })}
                />
            }

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