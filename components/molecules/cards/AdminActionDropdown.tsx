import React, { useCallback, useMemo } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { DropdownOption } from '..';

interface AdminActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
}

export const AdminActionDropdown: React.FC<AdminActionDropdownProps> = React.memo((props: AdminActionDropdownProps) => {
    const router = useRouter();

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo.id]);

    const editTopo = useCallback(() => console.log('Editing topo...'), []);

    const validateTopo = useCallback(() => console.log('Validating topo...'), []);

    const rejectTopo = useCallback(() => console.log('Rejecting topo...'), []);

    const contactCreator = useCallback(() => console.log('Contacting the creator...'), []);

    const deleteTopo = useCallback(() => console.log('Deleting topo...'), []);

    const actions = useMemo<DropdownOption[]>(() => [
        { value: 'Ouvrir', action: openTopo },
        { value: 'Modifier', action: editTopo },
        ...(props.topo.status === TopoStatus.Submitted
            ? [
                { value: 'Valider', action: () => validateTopo() },
                { value: 'Refuser', action: () => rejectTopo() }]
            : []),
        { value: 'Contacter le créateur', action: contactCreator },
        { value: 'Supprimer', action: deleteTopo },
    ], [props.topo.status, openTopo, editTopo, validateTopo, rejectTopo, contactCreator, deleteTopo]);

    return (
        <Dropdown
            position={props.position}
            options={actions}
        />
    );
}, equal);

AdminActionDropdown.displayName = 'UserActionDropdown';
