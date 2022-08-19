import { InteractItem, useSelectStore } from 'components/pages/selectStore';
import { deleteBoulder, deleteParking, deleteSector, deleteWaypoint } from 'helpers/builder';
import { staticUrl } from 'helpers/constants';
import { useBreakpoint, useModal } from 'helpers/hooks';
import { Quark, watchDependencies } from 'helpers/quarky';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Topo } from 'types';

interface BuilderModalDeleteProps {
    topo: Quark<Topo>,
    deleteItem: InteractItem,
    setDeleteItem: Dispatch<SetStateAction<InteractItem>>,
}

export const BuilderModalDelete: React.FC<BuilderModalDeleteProps> = watchDependencies(
    (props: BuilderModalDeleteProps) => {
        const breakpoint = useBreakpoint();
        const flush = useSelectStore(s => s.flush);
        const selectedItem = useSelectStore(s => s.item);

        const [ModalDelete, showModalDelete, hideModalDelete] = useModal();
        useEffect(() => {
            if (props.deleteItem.type === 'none') hideModalDelete();
            else showModalDelete();
        }, [props.deleteItem])

        const getModalContent = () => {
            if (props.deleteItem.type === 'sector') return "Êtes-vous sûr de vouloir supprimer le secteur (les blocs associés ne seront pas supprimés) ?"
            else if (props.deleteItem.type === 'boulder') return "Êtes-vous sûr de vouloir supprimer le bloc et toutes les voies associées ?"
            else if (props.deleteItem.type === 'parking') return "Êtes-vous sûr de vouloir supprimer le parking ?"
            else if (props.deleteItem.type === 'waypoint') return "Êtes-vous sûr de vouloir supprimer le point d'intérêt ?"
        }

        const deleteItem = useCallback(() => {
            const flushAction = breakpoint === 'mobile' ? flush.all : flush.item;
            if (props.deleteItem.type === 'sector') deleteSector(props.topo, props.deleteItem.value);
            else if (props.deleteItem.type === 'boulder') deleteBoulder(props.topo, props.deleteItem.value, flushAction, selectedItem.type === 'boulder' ? selectedItem : undefined);
            else if (props.deleteItem.type === 'parking') deleteParking(props.topo, props.deleteItem.value, flushAction, selectedItem.type === 'parking' ? selectedItem : undefined)
            else if (props.deleteItem.type === 'waypoint') deleteWaypoint(props.topo, props.deleteItem.value, flushAction, selectedItem.type === 'waypoint' ? selectedItem : undefined);
            props.setDeleteItem({ type: 'none', value: undefined })
        }, [props.deleteItem, props.topo, flush.all, flush.item]);
    
        return (
            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={deleteItem}
            >
                {getModalContent()}
            </ModalDelete>
        )
    }
)

BuilderModalDelete.displayName = "BuilderModalDelete";