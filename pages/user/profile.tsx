import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Button, ImageInput, ModalDelete, TextInput } from 'components';
import { LeftbarDesktop, Tabs } from 'components/layouts';
import Link from 'next/link';
import { useCreateQuark, watchDependencies } from 'helpers/quarky';
import { Email, isEmail, Name, StringBetween, User } from 'types';
import { useAuth } from "helpers/services";
import { withAuth } from 'helpers/auth';
import { Header } from 'components/layouts/header/Header';
import { useRouter } from 'next/router';

type ProfileProps = {
  user: User
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = withAuth(
  async () => ({ props: {} }),
  "/user/profile"
);

const ProfilePage: NextPage<ProfileProps> = watchDependencies((props) => {
  const auth = useAuth();
  const router = useRouter();
  const userQuark = useCreateQuark(props.user);
  const user = userQuark();

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  
  const [emailError, setEmailError] = useState<string>();
  const [successMessageChangeMail, setSuccessMessageChangeMail] = useState<string>();
  const [errorMessageChangeMail, setErrorMessageChangeMail] = useState<string>();

  const [userNameError, setUserNameError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();

  const [successMessageModify, setSuccessMessageModify] = useState<string>();
  const [errorMessageModify, setErrorMessageModify] = useState<string>();

  const [loadingModify, setLoadingModify] = useState(false);
  const [loadingChangeMail, setLoadingChangeMail] = useState(false);

  const modifyProfile = async () => {
    let hasError = false;
    if (!user.userName) { setUserNameError("Pseudo invalide"); hasError = true; }
    if (user.phone && (!user.phone.match(/\d/g) || user.phone.length < 6 || user.phone.length > 30)) { setPhoneError("Numéro de téléphone invalide"); hasError = true; }

    if (!hasError) {
      setLoadingModify(true);
      const res = await auth.updateUserInfo(user);
      if (res) setSuccessMessageModify('Profil modifié');
      else setErrorMessageModify('Une erreur est survenue. Merci de réessayer.');
      setLoadingModify(false);
    }
  }

  const changeMail = async () => {
    if (!user.email || (user.email && !isEmail(user.email))) setEmailError("Email invalide");
    else {
      setLoadingChangeMail(true)
      await auth.changeEmail(user.email);
      setLoadingChangeMail(false);
    }
  }

  const deleteAccount = () => {
    alert("à venir"); //TODO
    console.log("delete account");
  }

  return (
    <>
      <Header
          backLink="/"
          title="Profile"
      />
      <div className='h-content md:h-full w-full flex flex-row bg-white overflow-auto'>

        <LeftbarDesktop
          currentMenuItem="USER"
        />
        
        <div className='flex flex-col relative w-full h-full justify-start md:justify-center md:px-12'>
          <div className='flex flex-row justify-center md:justify-start rounded-lg px-6 pb-10 pt-12 md:pt-[16px]'>
            <div className='h-[100px] w-[100px] relative cursor-pointer'>
              <ImageInput 
                profileImageButton
                value={userQuark().image}
                onChange={async (images) => {
                  userQuark.set({
                    ...userQuark(),
                    image: images[0]
                  });
                  await auth.updateUserInfo(userQuark());
                }}
              />
            </div>
            
            <div className='hidden md:flex flex-col ml-6 w-1/2'>
              <div className='mb-6'>
                <div className='ktext-subtitle'>{user.userName}</div>
                {user.role === 'ADMIN' && <div className='text-main ktext-label'>Super-administrateur</div>}
              </div>
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={userNameError}
                  value={user.userName}
                  onChange={(e) => userQuark.set({
                    ...user,
                    userName: e.target.value as Name
                  })}
              />
            </div>

            {user.role === 'ADMIN' &&
              <div className='absolute right-[5%] top-[5%]'>
                <Button
                  content='Admin'
                  href='/admin'
                  white
                />
              </div>
            }
          </div>
          
          <div className='w-full md:hidden'>
            <Tabs 
              tabs={[]} //TODO
            />
          </div>

          <div className='flex flex-col gap-6 px-6'>
            <div className='flex flex-col gap-6 pb-8 items-center'>
              <TextInput 
                  id='email'
                  label='Email'
                  error={emailError}
                  value={user.email}
                  onChange={(e) => userQuark.set({
                    ...user,
                    email: e.target.value as Email
                  })}
              />
              <Button
                  content="Modifier l'email"
                  fullWidth
                  onClick={changeMail}
                  loading={loadingChangeMail}
              />
              {successMessageChangeMail && <div className='ktext-error text-main text-center'>{successMessageChangeMail}</div>}
              {errorMessageChangeMail && <div className='ktext-error text-error text-center'>{errorMessageChangeMail}</div>}
            
              <Link href="/user/changePassword">
                  <a className="ktext-base-little text-main cursor-pointer">Modifier le mot de passe</a>
              </Link>
            </div>

            <div className='md:hidden'>
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={userNameError}
                  value={user.userName}
                  onChange={(e) => userQuark.set({
                    ...user,
                    userName: e.target.value as Name
                  })}
              />
            </div>

            <div className='flex flex-row gap-3'>
              <TextInput 
                  id='firstName'
                  label='Prénom'
                  value={user.firstName}
                  onChange={(e) => userQuark.set({
                    ...user,
                    firstName: e.target.value as Name
                  })}
              />
              <TextInput 
                  id='lastName'
                  label='Nom'
                  value={user.lastName}
                  onChange={(e) => userQuark.set({
                    ...user,
                    lastName: e.target.value as Name
                  })}
              />
            </div>

            <div className='md:hidden'>
              <TextInput 
                  id='phone'
                  label='Téléphone'
                  error={phoneError}
                  value={user.phone}
                  onChange={(e) => userQuark.set({
                    ...user,
                    phone: e.target.value as StringBetween<1, 30>
                  })}
              />
            </div>

            <div className='flex flex-row gap-3 w-full'>
              <div className='hidden md:block w-1/2'>
                <TextInput 
                    id='phone'
                    label='Téléphone'
                    error={phoneError}
                    value={user.phone}
                    onChange={(e) => userQuark.set({
                      ...user,
                      phone: e.target.value as StringBetween<1, 30>
                    })}
                />
              </div>
              <TextInput 
                  id='birthDate'
                  label='Date de naissance'
                  wrapperClassName='md:w-1/2'
                  value={user.birthDate}
                  onChange={(e) => userQuark.set({
                    ...user,
                    birthDate: e.target.value
                  })}
              />
            </div>

            <div className='flex flex-row gap-2'>
              <TextInput 
                  id='citizenship'
                  label='Pays'
                  value={user.country}
                  onChange={(e) => userQuark.set({
                    ...user,
                    country: e.target.value as Name
                  })}
              />
              <TextInput 
                  id='city'
                  label='Ville'
                  value={user.city}
                  onChange={(e) => userQuark.set({
                    ...user,
                    city: e.target.value as Name
                  })}
              />
            </div>

            <Button
                content="Modifier le profil"
                fullWidth
                onClick={modifyProfile}
                loading={loadingModify}
            />
            {successMessageModify && <div className='ktext-error text-main text-center'>{successMessageModify}</div>}
            {errorMessageModify && <div className='ktext-error text-error text-center'>{errorMessageModify}</div>}

            <div className='flex flex-col items-center gap-4 mb-10 md:mb-0 md:pt-10'>

              <div 
                className="ktext-base-little text-main cursor-pointer"
                onClick={async () => {
                  const success = await auth.signOut();
                  if (success) await router.push('/user/login');
                }}
              >
                Se déconnecter
              </div>

              <div 
                className="ktext-base-little text-main cursor-pointer"
                onClick={() => setDisplayDeleteAccountModal(true)}
              >
                Supprimer le compte
              </div>
            </div>

          </div>
        </div>

      </div>

      {displayDeleteAccountModal &&
        <ModalDelete 
          onClose={() => setDisplayDeleteAccountModal(false)}
          onDelete={deleteAccount}
        >
          Toutes les données du compte seront définitivement supprimées. Êtes-vous sûr.e de vouloir continuer ?
        </ModalDelete>
      }
    </>
  );
});

export default ProfilePage;
