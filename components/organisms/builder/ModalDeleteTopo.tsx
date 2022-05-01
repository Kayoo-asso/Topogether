import React from 'react';
import { ModalDelete } from 'components/atoms';

interface ModalDeleteTopoProps {
    onDelete: () => void,
    // onClose: () => void,
}

export const ModalDeleteTopo: React.FC<ModalDeleteTopoProps> = (props: ModalDeleteTopoProps) => {

    return (
        <ModalDelete 
            // onClose={props.onClose}
            onDelete={props.onDelete}
        >
            Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?
        </ModalDelete> 
    )
}