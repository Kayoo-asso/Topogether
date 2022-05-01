import React from 'react';
import { ModalDelete } from 'components/atoms';

interface ModalDeleteTopoProps {
    open: boolean,
    onDelete: () => void,
    // onClose: () => void,
}

export const ModalDeleteTopo: React.FC<ModalDeleteTopoProps> = (props: ModalDeleteTopoProps) => {

    return (
        <ModalDelete 
            // onClose={props.onClose}
            open={props.open}
            onDelete={props.onDelete}
        >
            Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?
        </ModalDelete> 
    )
}