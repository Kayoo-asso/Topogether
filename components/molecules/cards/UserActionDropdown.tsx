import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';

interface UserActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
    onSendToValidationClick: () => void,
    onDeleteClick: () => void;
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = React.memo((props: UserActionDropdownProps) => {
    const router = useRouter();

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo]);
    //TODO
    const downloadTopo = useCallback(() => console.log('Downloading the topo...'), []);

    return (
        <Dropdown
            className='w-64'
            position={props.position}
            options={[
                ...(props.topo.status !== TopoStatus.Submitted
                    ? [{ value: 'Ouvrir', action: openTopo }]
                    : []),
                { value: 'Télécharger', action: downloadTopo },
                ...(props.topo.status === TopoStatus.Draft
                    ? [{ value: 'Envoyer en validation', action: props.onSendToValidationClick }]
                    : []),
                { value: 'Supprimer', action: props.onDeleteClick },
            ]}
        />
    );
}, equal);

UserActionDropdown.displayName = 'UserActionDropdown';
