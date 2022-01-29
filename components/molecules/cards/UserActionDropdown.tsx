import React, { useCallback } from 'react';
import { Dropdown } from 'components';
import equal from 'fast-deep-equal/es6';
import { UUID } from 'types';
import { useRouter } from 'next/router';

interface UserActionDropdownProps {
  topoId: UUID;
  dropdownPosition?: { x: number, y: number };
}

export const UserActionDropdown: React.FC<UserActionDropdownProps> = React.memo((props: UserActionDropdownProps) => {
  const router = useRouter();

  const openTopo = useCallback(() => router.push(`/topo/${props.topoId}`), [router, props.topoId]);

  const downloadTopo = useCallback(() => console.log('Downloading the topo...'), []);

  const sendTopoToValidation = useCallback(() => console.log('Sending to validation...'), []);

  const deleteTopo = useCallback(() => console.log('Deleting topo...'), []);

  return (
    <Dropdown
      style={{ left: `${props.dropdownPosition?.x}px`, top: `${props.dropdownPosition?.y}px` }}
      options={[
		{ value: 'Ouvrir', action: openTopo },
		{ value: 'Télécharger', action: downloadTopo },
		{ value: 'Envoyer en validation', action: sendTopoToValidation },
		{ value: 'Supprimer', action: deleteTopo },
		]}
    />
  );
}, equal);

UserActionDropdown.displayName = 'UserActionDropdown';
