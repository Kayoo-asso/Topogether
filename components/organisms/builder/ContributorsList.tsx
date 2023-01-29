import React, { useState } from "react";
import { QuarkArray, watchDependencies } from "helpers/quarky";
import { Contributor, ContributorRole, UUID } from "types";
import { ContributorAddForm } from "../form/ContributorAddForm";
import { ContributorModifyForm } from "../form/ContributorModifyForm";

import UserInfoIcon from "assets/icons/user-info.svg";
import AddIcon from "assets/icons/add.svg";

interface ContributorsListProps {
	contributors: QuarkArray<Contributor>;
    topoCreatorId?: UUID;
	className?: string;
}

const formatRole = (role: ContributorRole) => {
    switch (role) {
        case 'ADMIN': return 'Administrateur';
        case 'CONTRIBUTOR': return 'Contributeur';
        default: return 'Aucun rôle';
    }
}

export const ContributorsList: React.FC<ContributorsListProps> = watchDependencies(
	(props: ContributorsListProps) => {
        const [displayAddForm, setDisplayAddForm] = useState(false);
        const [toModify, setToModify] = useState<Contributor>();

        const getContent = () => {
            if (displayAddForm) return <ContributorAddForm onClose={() => setDisplayAddForm(false)} />
            else if (props.contributors.length < 2) return ( //There is always at least 1 contributor : the admin of the topo
                <div 
                    className="flex flex-col md:flex-row mt-6 md:cursor-pointer border-main border-2 rounded-sm w-[90%] md:w-full py-6 md:py-12 px-6 shadow items-start md:items-center"
                    onClick={() => setDisplayAddForm(true)}
                >
                    <div className="w-[40%] flex md:justify-center">
                        <div className='rounded-full bg-main bg-opacity-10 h-20 w-20 flex justify-center items-center'>
                            <AddIcon className='w-9 h-9 stroke-main' />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className='font-semibold'>Ajouter un contributeur</div> 
                    </div>
                </div>
            );
            else if (toModify) return <ContributorModifyForm contributor={toModify} onClose={() => setToModify(undefined)} />           
            else return (  
                <>
                    <div className="flex w-full ktext-subtitle mb-1">Contributeurs du topo</div>      
                    <div className="flex flex-col gap-6">
                        {props.contributors.map(contributor => {
                            //We don't want the admin of the topo himself to be displayed
                            if (contributor.id === props.topoCreatorId) return;
                            return (
                                <div 
                                    key={contributor.id}
                                    className="flex flex-col md:flex-row md:cursor-pointer h-full gap-4 md:gap-0 border-main border-2 rounded-sm w-[90%] md:w-full py-6 md:py-12 px-6 shadow items-start md:items-center"
                                    onClick={() => setToModify(contributor)}
                                >
                                    <div className="w-[40%] flex md:justify-center">
                                        <div className='rounded-full bg-main bg-opacity-10 h-20 w-20 flex justify-center items-center'>
                                            <UserInfoIcon className='w-9 h-9 stroke-main stroke-2' />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        {/* To change id -> pseudo */}
                                        <div className='font-semibold'>{contributor.id}</div> 
                                        <div className='text-main'>{formatRole(contributor.role)}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="py-6 w-full text-center ktext-label text-grey-medium md:cursor-pointer" onClick={() => setDisplayAddForm(true)}>
                        Ajouter un contributeur
                    </div>
                </>
            );
        }

        return (
            <div
                className={
                    "flex flex-col h-full gap-6 overflow-scroll " +
                    (props.className ? props.className : "")
                }
            >
                {getContent()}
            </div>
        )
	}
);

ContributorsList.displayName = "ContributorsList";
