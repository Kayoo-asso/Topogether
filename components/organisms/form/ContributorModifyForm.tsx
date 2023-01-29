import { Button } from 'components/atoms/buttons/Button';
import { SelectList } from 'components/molecules/form/SelectList';
import { staticUrl } from 'helpers/constants';
import { useModal } from 'helpers/hooks/useModal';
import React, { useState } from 'react';
import { Contributor, ContributorRole } from 'types';

interface ContributorModifyFormProps {
    contributor: Contributor,
    onClose: () => void,
}

export const ContributorModifyForm: React.FC<ContributorModifyFormProps> = (props: ContributorModifyFormProps) => {
    const [contributor, setContributor] = useState<Contributor>(props.contributor);

    const [ModalModify, showModalModify] = useModal();
    const [ModalDelete, showModalDelete] = useModal();

    return (
        <>
            <div className="flex w-full ktext-subtitle mb-1">Modifier le contributeur</div>

            {/* TODO: Modifier pour mettre le pseudo au lieu de l'ID */}
            <div>Pseudo : {contributor.id}</div> 
            
            <SelectList<ContributorRole>
                options={[['ADMIN', 'Administrateur'], ["CONTRIBUTOR", 'Contributeur']]}
                value={contributor.role}
                justify={false}
                onChange={(val) => {
                    if (val !== contributor.role && val !== undefined) 
                        setContributor(c => ({
                            ...c,
                            role: val
                        }))
                }}
            />

            <Button
                content="Valider"
                onClick={showModalModify}
            />

            <div className="py-6 w-full text-center ktext-label text-error md:cursor-pointer" onClick={showModalDelete}>
                Supprimer le contributeur
            </div>

            <div className="py-6 w-full text-center ktext-label text-grey-medium md:cursor-pointer" onClick={props.onClose}>
                Retour
            </div>

            <ModalModify
				buttonText="Modifier"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={() => alert("à venir")} //TODO
			>
				Le rôle du contributeur sera modifié. Etes-vous sûr de vouloir continuer ?
			</ModalModify>

            <ModalDelete
				buttonText="Supprimer"
				imgUrl={staticUrl.deleteWarning}
				onConfirm={() => alert("à venir")} //TODO
			>
				L'utilisateur ne pourra plus contribuer au topo. Etes-vous sûr de vouloir continuer ?
			</ModalDelete>
            
        </>
    )
}

ContributorModifyForm.displayName = 'ContributorModifyForm';