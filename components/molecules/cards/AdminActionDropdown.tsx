import React, { useCallback, useMemo } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { DropdownOption } from '..';

interface AdminActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
    onValidateClick: () => void,
    onRejectClick: () => void,
    onDeleteClick: () => void;
}

export const AdminActionDropdown: React.FC<AdminActionDropdownProps> = React.memo((props: AdminActionDropdownProps) => {
    const router = useRouter();

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo.id]);
    const editTopo = useCallback(() => router.push(`/builder/${props.topo.id}`), [router, props.topo.id]);
    //TODO
    const contactCreator = useCallback(() => {
        alert("à venir");
        console.log('Contacting the creator...')
    }, []);
    
    const actions = useMemo<DropdownOption[]>(() => [
        { value: 'Ouvrir', action: openTopo },
        { value: 'Modifier', action: editTopo },
        ...(props.topo.status === TopoStatus.Submitted
            ? [
                { value: 'Valider', action: props.onValidateClick },
                { value: 'Refuser', action: props.onRejectClick }]
            : []),
        { value: 'Contacter le créateur', action: contactCreator },
        { value: 'Supprimer', action: props.onDeleteClick },
    ], [props.topo.status, openTopo, editTopo, props.onValidateClick, props.onRejectClick, contactCreator, props.onDeleteClick]);

    return (
        <Dropdown
            position={props.position}
            options={actions}
        />
    );
}, equal);

AdminActionDropdown.displayName = 'UserActionDropdown';
