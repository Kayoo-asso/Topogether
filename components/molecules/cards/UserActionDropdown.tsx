import React, { useCallback, useState } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { ModalDeleteTopo, ModalSubmitTopo } from 'components/organisms';
import { api } from 'helpers/services';

interface UserActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = React.memo((props: UserActionDropdownProps) => {
    const router = useRouter();

    const [displayModalSubmit, setDisplayModalSubmit] = useState(false);
    const [displayModalDelete, setDisplayModalDelete] = useState(false);

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo]);
    //TODO
    const downloadTopo = useCallback(() => console.log('Downloading the topo...'), []);

    const sendTopoToValidation = useCallback(async () => await api.setTopoStatus(props.topo.id, TopoStatus.Submitted), []);
    //TODO
    const deleteTopo = useCallback(() => api.deleteTopo(props.topo), []);

    return (
        <>
            <Dropdown
                className='w-64'
                position={props.position}
                options={[
                    { value: 'Ouvrir', action: openTopo },
                    { value: 'Télécharger', action: downloadTopo },
                    ...(props.topo.status === TopoStatus.Draft
                        ? [{ value: 'Envoyer en validation', action: () => setDisplayModalSubmit(true) }]
                        : []),
                    { value: 'Supprimer', action: () => setDisplayModalDelete(true) },
                ]}
            />
            {displayModalSubmit &&
                <ModalSubmitTopo 
                    onSubmit={sendTopoToValidation} 
                    onClose={() => setDisplayModalSubmit(false)}    
                />
            }
            {displayModalDelete &&
                <ModalDeleteTopo 
                    onDelete={deleteTopo}
                    onClose={() => setDisplayModalDelete(false)}
                />
            }
        </>
    );
}, equal);

UserActionDropdown.displayName = 'UserActionDropdown';
