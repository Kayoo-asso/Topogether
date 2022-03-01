import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';

interface UserActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = React.memo((props: UserActionDropdownProps) => {
    const router = useRouter();

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo]);

    const downloadTopo = useCallback(() => console.log('Downloading the topo...'), []);

    const sendTopoToValidation = useCallback(() => console.log('Sending to validation...'), []);

    const deleteTopo = useCallback(() => console.log('Deleting topo...'), []);

    return (
        <Dropdown
            className='w-64'
            position={props.position}
            options={[
                { value: 'Ouvrir', action: openTopo },
                { value: 'Télécharger', action: downloadTopo },
                ...(props.topo.status === TopoStatus.Draft
                    ? [{ value: 'Envoyer en validation', action: sendTopoToValidation }]
                    : []),
                { value: 'Supprimer', action: deleteTopo },
            ]}
        />
    );
}, equal);

UserActionDropdown.displayName = 'UserActionDropdown';
