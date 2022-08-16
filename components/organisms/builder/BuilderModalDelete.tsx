import { deleteBoulder, deleteParking, deleteSector, deleteWaypoint } from 'helpers/builder';
import { staticUrl } from 'helpers/constants';
import { useModal } from 'helpers/hooks';
import { Quark, watchDependencies } from 'helpers/quarky';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { Topo } from 'types';
import { InteractItem, SelectedItem } from 'types/SelectedItems';

interface BuilderModalDeleteProps {
    topo: Quark<Topo>,
    deleteItem: InteractItem,
    setDeleteItem: Dispatch<SetStateAction<InteractItem>>,
    selectedItem: SelectedItem,
    setSelectedItem: Dispatch<SetStateAction<SelectedItem>>,
}

export const BuilderModalDelete: React.FC<BuilderModalDeleteProps> = watchDependencies(
    (props: BuilderModalDeleteProps) => {

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
        if (props.deleteItem.type === 'sector') deleteSector(props.topo, props.deleteItem.value);
        else if (props.deleteItem.type === 'boulder') deleteBoulder(props.topo, props.deleteItem.value, props.setSelectedItem, props.selectedItem);
        else if (props.deleteItem.type === 'parking') deleteParking(props.topo, props.deleteItem.value, props.setSelectedItem, props.selectedItem)
        else if (props.deleteItem.type === 'waypoint') deleteWaypoint(props.topo, props.deleteItem.value, props.setSelectedItem, props.selectedItem);
        props.setDeleteItem({ type: 'none' })
    }, [props.deleteItem, props.topo, props.setSelectedItem, props.selectedItem]);
   
    return (
        <ModalDelete
            buttonText="Confirmer"
            imgUrl={staticUrl.deleteWarning}
            onConfirm={deleteItem}
        >
            {getModalContent()}
        </ModalDelete>
    )
})

BuilderModalDelete.displayName = "BuilderModalDelete";