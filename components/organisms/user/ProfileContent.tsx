import React, { useState } from 'react';
import { Button } from 'components/atoms';
import { staticUrl } from 'helpers/constants';
import { useBreakpoint, useLoader, useModal } from 'helpers/hooks';
import { useAuth } from 'helpers/services';
import { useRouter } from 'next/router';
import { User } from 'types';

import UserInfoIcon from "assets/icons/user-info.svg";

interface ProfileContentProps {
    user: User,
    onModifyButtonClick: () => void,
}

export const ProfileContent: React.FC<ProfileContentProps> = (props: ProfileContentProps) => {
    const auth = useAuth();
	const router = useRouter();
    const breakpoint = useBreakpoint();
    const [errorMessageSignout, setErrorMessageSignout] = useState<string>();

    const showLoader = useLoader();

    const [ModalDelete, showModalDelete] = useModal();

    const deleteAccount = () => {
        alert("à venir"); //TODO
        console.log("delete account");
    };

    const getFrom = () => {
        let from = '';
        if (props.user.city || props.user.country) from += 'De ';
        if (props.user.city) from += props.user.city;
        if (props.user.city && props.user.country) from += ', ';
        if (props.user.country) from += props.user.country;
        return from;
    }

    return (
        <>
            <div className='flex flex-col gap-6'>
                
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-0 border-main border-2 rounded-sm w-[90%] md:w-full py-6 md:py-12 px-6 shadow items-start md:items-center">
                        <div className="w-[40%] flex md:justify-center">
                            <div className='rounded-full bg-main bg-opacity-10 h-20 w-20 flex justify-center items-center'>
                                <UserInfoIcon className='w-9 h-9 stroke-main stroke-2' />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className='font-semibold'>{props.user.firstName} {props.user.lastName}</div>
                            <div>{props.user.birthDate}</div>
                            <div>{getFrom()}</div>
                            {(!props.user.firstName || !props.user.lastName || !props.user.birthDate || !props.user.city) &&
                                <div 
                                    className='border-2 border-second bg-second bg-opacity-10 text-second rounded-full mt-2 py-2 px-4 ktext-error cursor-pointer'
                                    onClick={props.onModifyButtonClick}
                                >Votre profil est encore à compléter ;)</div>
                            }
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-0 border-main border-2 rounded-sm w-[90%] md:w-full py-6 md:py-12 px-6 shadow items-start md:items-center">
                        <div className="w-[40%] flex md:justify-center">
                            <div className='rounded-full bg-main bg-opacity-10 h-20 w-20 flex justify-center items-center'>
                                <div className="text-main text-4xl mb-2">@</div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div>{props.user.email}</div>
                            <div>{props.user.phone}</div>
                            <div>Mot de passe : ********</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
                    <Button 
                        content='Modifier mon profile'
                        className={breakpoint === 'mobile' ? 'w-[90%]' : ''}
                        onClick={props.onModifyButtonClick}
                    />
                    
                    <div className="flex flex-row w-full md:w-auto justify-around md:gap-6 py-6 md:pt-0">
                        <div
                            className="ktext-base-little cursor-pointer text-error"
                            onClick={async () => {
                                showLoader(true);
                                const success = await auth.signOut();
                                if (success) await router.push("/user/login");
                                else {
                                    setErrorMessageSignout(
                                        "Une erreur est survenue. Merci de réessayer."
                                    );
                                    showLoader(false);
                                }
                            }}
                        >
                            Se déconnecter
                            {errorMessageSignout && (
                                <div className="ktext-error">{errorMessageSignout}</div>
                            )}
                        </div>
                        <div
                            className="ktext-base-little cursor-pointer text-error"
                            onClick={showModalDelete}
                        >
                            Supprimer le compte
                        </div>
                    </div>
                </div>
            </div>

            <ModalDelete
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={deleteAccount}
            >
                Toutes les données du compte seront définitivement supprimées.
                Êtes-vous sûr.e de vouloir continuer ?
            </ModalDelete>
        </>
    )
}

ProfileContent.displayName = 'ProfileContent';