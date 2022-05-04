import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { encodeUUID } from 'helpers';

interface UserActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
    onSendToValidationClick: () => void,
    onSendToDraftClick: () => void,
    onDeleteClick: () => void;
    onSelect?: () => void,
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = (props: UserActionDropdownProps) => {
    const router = useRouter();

    const openTopo = useCallback(() => router.push(`/topo/${encodeUUID(props.topo.id)}`), [router, props.topo]);
    //TODO
    const downloadTopo = useCallback(() => { alert("à venir"); console.log('Downloading the topo...'); }, []);

    return (
        <Dropdown
            className='w-64'
            position={props.position}
            options={[
                ...(props.topo.status !== TopoStatus.Submitted
                    ? [{ value: 'Ouvrir', action: openTopo }]
                    : []),
                ...(props.topo.status === TopoStatus.Validated
                    ? [{ value: 'Télécharger', action: downloadTopo }]
                    : []),
                ...(props.topo.status === TopoStatus.Draft
                    ? [{ value: 'Envoyer en validation', action: props.onSendToValidationClick }]
                    : []),
                ...(props.topo.status === TopoStatus.Submitted
                    ? [{ value: 'Retourner en brouillon', action: props.onSendToDraftClick }]
                    : []),
                { value: 'Supprimer', action: props.onDeleteClick },
            ]}
            onSelect={props.onSelect}
        />
    );
};

UserActionDropdown.displayName = 'UserActionDropdown';
