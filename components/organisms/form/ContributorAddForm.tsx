import React, { useEffect, useState } from 'react';
import { TextInput } from 'components/molecules';
import { ContributorRole, Name, UUID } from 'types';
import { Button } from 'components/atoms';
import { SelectList } from 'components/molecules/form/SelectList';

interface ContributorAddFormProps {
    onClose: () => void,
}

let timer: NodeJS.Timeout;
export const ContributorAddForm: React.FC<ContributorAddFormProps> = (props: ContributorAddFormProps) => {
    const [email, setEmail] = useState<Name>('' as Name);
    const [id, setId] = useState<UUID>();
    const [role, setRole] = useState<ContributorRole>();

    const [resultsOpen, setResultsOpen] = useState(false);
    const [results, setResults] = useState<{pseudo: string, id: UUID}[]>([]);

    const searchUser = (pseudo: string) => {
        //TODO: Call API for searching for the user
        console.log("searching...");
    }
    useEffect(() => {
		if (email?.length > 2) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				searchUser(email);
			}, 300);
		}
	}, [email]);
    
    return (
        <>
            <div className="flex w-full ktext-subtitle mb-1">Ajouter un contributeur</div>

            <div>Fonctionnalité à venir</div>

            {/* <div className='w-full relative'>
                <TextInput 
                    id='mail'
                    type='email'
                    label='Email du contributeur'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value as Name);
                        if (e.target.value?.length > 2) {
                            setResultsOpen(true);
                            searchUser(e.target.value);
                        }
                        else setResultsOpen(false);
                    }}
                    onBlur={() => setResultsOpen(false)}
                    onFocus={(e) => {
                        if (e.currentTarget.value?.length > 2) setResultsOpen(true);
                        else setResultsOpen(false);
                    }}
                />
                {id && <div className="ktext-subtext">ID du contributeur : {id}</div>}
                {resultsOpen && (
                    <div className="absolute mt-1 z-50 rounded-lg bg-white px-7 py-3 shadow ml-1 w-[98%]">
                        {results.length < 1 && (
                            <div className="text-grey-medium pb-10">Aucun utilisateur trouvé</div>
                        )}
                        {results.length > 0 && results.map(res => (
                            <div
                                key={res.id}
                                className="ktext-base flex cursor-pointer flex-row items-center gap-4 py-3 text-dark"
                                onClick={() => {
                                    setEmail(res.pseudo as Name);
                                    setId(res.id);
                                    setResultsOpen(false);
                                }}
                            >
                                <div>{res.pseudo}</div>
                            </div>    
                        ))}
                    </div>
                )}
            </div>

            <SelectList<ContributorRole>
                options={[['ADMIN', 'Administrateur'], ["CONTRIBUTOR", 'Contributeur']]}
                value={role}
                justify={false}
                onChange={(val) => setRole(val)}
            />

            <Button 
                content='Ajouter le contributeur'
                activated={!!(id && role && email)}
                fullWidth
            /> */}

            <div className="py-6 w-full text-center ktext-label text-grey-medium cursor-pointer" onClick={props.onClose}>
                Retour
            </div>
        </>
    )
}

ContributorAddForm.displayName = 'ContributorAddForm';