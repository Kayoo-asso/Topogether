import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button, Header, TextInput } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import Link from 'next/link';

const ChangePasswordPage: NextPage = () => {
  const [oldPassword, setOldPassword] = useState<string>();
  const [newPassword, setNewPassword] = useState<string>();
  const [secondNewPassword, setSecondNewPassword] = useState<string>();

  const [oldPasswordError, setOldPasswordError] = useState<string>();
  const [newPasswordError, setNewPasswordError] = useState<string>();
  const [secondNewPasswordError, setSecondNewPasswordError] = useState<string>();

  const checkErrors = () => {
    if (!oldPassword) setOldPasswordError("Merci de rentrer votre ancien mot de passe");
    if (!newPassword) setNewPasswordError("Mot de passe invalide");
    if (!secondNewPassword) setSecondNewPasswordError("Mot de passe invalide");
    if (newPassword !== secondNewPassword) setSecondNewPasswordError("Les deux mots de passe ne correspondent pas");

    if (oldPassword && newPassword && secondNewPassword && newPassword === secondNewPassword) return true;
    else return false;
  }
  const modifyPassword = () => {
      if (checkErrors()) {
          console.log("Change password"); //TODO
      }
  }

  return (
    <>
    <Header
        backLink="/user/profile"
        title="Modification de mot de passe"
        displayLogin
    />

      <div className="w-full h-full flex flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
        <div className="p-10 w-full bg-white mb-10 md:w-[500px] md:shadow md:rounded-lg -mt-16 md:mt-0">

          <div className='flex flex-col gap-8 items-center w-full'>
            <div className="ktext-section-title self-start hidden md:block">Modifier le mot de passe</div>
            <div className="h-[150px] w-[150px] relative md:hidden">
                <NextImage
                    src={staticUrl.logo_color}
                    priority
                    alt="Logo Topogether"
                    layout="fill"
                    objectFit="contain"
                />
            </div>

            <TextInput 
              id='oldPassword'
              label='Ancien mot de passe'
              error={oldPasswordError}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            /> 

            <TextInput 
              id='newPassword'
              label='Nouveau mot de passe'
              error={newPasswordError}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <TextInput 
              id='secondNewPassword'
              label='Retaper le nouveau mot de passe'
              error={secondNewPasswordError}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button 
                content="Changer le mot de passe"
                fullWidth
                onClick={modifyPassword}
            />

            <Link href="/user/profile">
                <a className="ktext-base-little text-main cursor-pointer hidden md:flex md:w-full">Retour</a>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
};

export default ChangePasswordPage;
