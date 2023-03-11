import React, { useCallback, useEffect } from 'react';
import { useSelectStore } from 'components/store/selectStore';
import { deleteBoulder, deleteParking, deleteSector, deleteTrack, deleteWaypoint } from 'helpers/builder';
import { staticUrl } from 'helpers/constants';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Topo } from 'types';
import { useBreakpoint } from 'helpers/hooks/DeviceProvider';
import { useModal } from 'helpers/hooks/useModal';
import { useDeleteStore } from 'components/store/deleteStore';
import { useDrawerStore } from 'components/store/drawerStore';

interface BuilderModalDeleteProps {
    topo: Quark<Topo>,
}

export const BuilderModalDelete: React.FC<BuilderModalDeleteProps> = watchDependencies(
    (props: BuilderModalDeleteProps) => {
        const breakpoint = useBreakpoint();
        const selectedItem = useSelectStore(s => s.item);
        const select = useSelectStore(s => s.select);
        const flush = useSelectStore(s => s.flush);  

        const toDeleteItem = useDeleteStore(d => d.item);
        const flushDel = useDeleteStore(d => d.flush);

        const closeDrawer = useDrawerStore(d => d.closeDrawer);

        const [ModalDelete, showModalDelete, hideModalDelete] = useModal();
        useEffect(() => {
            if (toDeleteItem.type === 'none') hideModalDelete();
            else showModalDelete();
        }, [toDeleteItem]);

        const getModalContent = () => {
            switch (toDeleteItem.type) {
                case 'sector': return <>Êtes-vous sûr de vouloir supprimer le secteur (les blocs associés ne seront pas supprimés) ?</>;
                case 'boulder': return <>Êtes-vous sûr de vouloir supprimer le bloc <span className='font-semibold'>{toDeleteItem.value().name}</span> et toutes les voies associées ?</>;
                case 'track': return <>Êtes-vous sûr de vouloir supprimer la voie <span className='font-semibold'>{toDeleteItem.value().name}</span> ?</>;
                case 'parking': return <>Êtes-vous sûr de vouloir supprimer le parking <span className='font-semibold'>{toDeleteItem.value().name}</span> ?</>;
                case 'waypoint': return <>Êtes-vous sûr de vouloir supprimer le point d'intérêt <span className='font-semibold'>{toDeleteItem.value().name}</span> ?</>
            }
        }

        const deleteItem = useCallback(() => {
            const flushAction = toDeleteItem.type === 'track' ? flush.track
                : breakpoint === 'mobile' ? flush.all 
                : flush.item;
            switch (toDeleteItem.type) {
                case 'sector': deleteSector(props.topo, toDeleteItem.value, flushAction, selectedItem.type === 'sector' ? selectedItem : undefined); break;
                case 'boulder': deleteBoulder(props.topo, toDeleteItem.value, flushAction, selectedItem.type === 'boulder' ? selectedItem : undefined); break;
                case 'track': deleteTrack(toDeleteItem.boulder(), toDeleteItem.value, flushAction, toDeleteItem.selectedBoulder); break;
                case 'parking': deleteParking(props.topo, toDeleteItem.value, flushAction, selectedItem.type === 'parking' ? selectedItem : undefined); break;
                case 'waypoint': deleteWaypoint(props.topo, toDeleteItem.value, flushAction, selectedItem.type === 'waypoint' ? selectedItem : undefined); break;
            }
            flushDel.item();
            closeDrawer();
        }, [toDeleteItem, toDeleteItem.type === 'track' && toDeleteItem.boulder, selectedItem, props.topo]);
    
        return (
            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={deleteItem}
                onClose={() => toDeleteItem.type !== 'none' && flushDel.item()}
            >
                {getModalContent()}
            </ModalDelete>
        )
    }
)

BuilderModalDelete.displayName = "BuilderModalDelete";