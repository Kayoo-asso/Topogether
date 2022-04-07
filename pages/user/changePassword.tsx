import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Button, TextInput } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import Link from 'next/link';
import { useAuth } from 'helpers/services';
import { Header } from 'components/layouts/header/Header';
import { User } from 'types';
import { withAuth } from 'helpers/auth';

type ChangePasswordProps = {
  user: User
}

export const getServerSideProps: GetServerSideProps<ChangePasswordProps> = withAuth(
  async () => ({ props: {} }),
  "/user/changePassword"
);

const ChangePasswordPage: NextPage = (props) => {
  const auth = useAuth();
  // console.log(props);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [secondNewPassword, setSecondNewPassword] = useState<string>('');

  const [oldPasswordError, setOldPasswordError] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [secondNewPasswordError, setSecondNewPasswordError] = useState<string>('');

  const [loading, setLoading] = useState(false);

  const checkErrors = () => {
    if (oldPassword.length === 0) setOldPasswordError("Merci de rentrer votre ancien mot de passe");
    if (newPassword.length === 0) setNewPasswordError("Mot de passe invalide");
    if (secondNewPassword.length === 0) setSecondNewPasswordError("Mot de passe invalide");
    if (newPassword !== secondNewPassword) setSecondNewPasswordError("Les deux mots de passe ne correspondent pas");

    if (oldPassword && newPassword && secondNewPassword && newPassword === secondNewPassword) return true;
    else return false;
  }
  const modifyPassword = async () => {
      if (checkErrors()) {
        setLoading(true);
        const res = await auth.changePassword(newPassword);
        console.log(res);
        setLoading(false);
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
              value={secondNewPassword}
              onChange={(e) => setSecondNewPassword(e.target.value)}
            />

            <Button 
                content="Changer le mot de passe"
                fullWidth
                onClick={modifyPassword}
                loading={loading}
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
