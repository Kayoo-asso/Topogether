import React, { useCallback, useMemo, useState } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { DropdownOption } from '..';
import { ModalRejectTopo } from 'components/organisms';

interface AdminActionDropdownProps {
    topo: LightTopo;
    position: { x: number, y: number };
}

export const AdminActionDropdown: React.FC<AdminActionDropdownProps> = React.memo((props: AdminActionDropdownProps) => {
    const router = useRouter();

    const [displayModalValidate, setDisplayModalValidate] = useState<boolean>();
    const [displayModalReject, setDisplayModalReject] = useState<boolean>();

    const openTopo = useCallback(() => router.push(`/topo/${props.topo.id}`), [router, props.topo.id]);

    const editTopo = useCallback(() => router.push(`/builder/${props.topo.id}`), [router, props.topo.id]);

    const validateTopo = useCallback(() => console.log('Validating topo...'), []);

    const rejectTopo = useCallback(() => console.log('Rejecting topo...'), []);

    const contactCreator = useCallback(() => console.log('Contacting the creator...'), []);

    const deleteTopo = useCallback(() => console.log('Deleting topo...'), []);

    const actions = useMemo<DropdownOption[]>(() => [
        { value: 'Ouvrir', action: openTopo },
        { value: 'Modifier', action: editTopo },
        ...(props.topo.status === TopoStatus.Submitted
            ? [
                { value: 'Valider', action: () => setDisplayModalValidate(true) },
                { value: 'Refuser', action: () => setDisplayModalReject(true) }]
            : []),
        { value: 'Contacter le créateur', action: contactCreator },
        { value: 'Supprimer', action: deleteTopo },
    ], [props.topo.status, openTopo, editTopo, validateTopo, rejectTopo, contactCreator, deleteTopo]);

    return (
        <>
            <Dropdown
                position={props.position}
                options={actions}
            />
            {displayModalReject &&
                <ModalRejectTopo topo={props.topo} onClose={() => setDisplayModalReject(false)}/>
            }
        </>
    );
}, equal);

AdminActionDropdown.displayName = 'UserActionDropdown';
