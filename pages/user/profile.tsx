import React, { useRef, useState } from 'react';
import type { NextPage } from 'next';
import { staticUrl } from 'helpers';
import { Button, HeaderDesktop, ImageInput, LeftbarDesktop, ModalDelete, ProfilePicture, Tabs, TextInput } from 'components';
import Link from 'next/link';
import { watchDependencies } from 'helpers/quarky';
import { isEmail, Name, StringBetween } from 'types';
import { api, auth, AuthResult } from 'helpers/services';

const ProfilePage: NextPage = watchDependencies(() => {
  let session = auth.session()?.user;
  if (!session) return <></>;

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  
  const [email, setEmail] = useState<string>(session!.email);
  const [emailError, setEmailError] = useState<string>();
  
  const [userName, setUserName] = useState<string>(session.userName);
  const [firstName, setFirstName] = useState<string | undefined>(session.firstName);
  const [lastName, setLastName] = useState<string | undefined>(session.lastName);
  const [imageUrl, setImageUrl] = useState<string | undefined>(session.imagePath);
  const [birthDate, setBirthDate] = useState<string | undefined>(session.birthDate); //TODO convert into Date
  const [country, setCountry] = useState<string | undefined>(session.country);
  const [city, setCity] = useState<string | undefined>(session.city);
  const [phone, setPhone] = useState<string | undefined>(session.phone);

  const [userNameError, setUserNameError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const modifyProfil = async () => {
    let hasError = false;
    if (!userName) { setUserNameError("Pseudo invalide"); hasError = true; }
    if (phone && (!phone.match(/\d/g) || phone.length < 6 || phone.length > 30)) { setPhoneError("Numéro de téléphone invalide"); hasError = true; }

    if (!hasError) {
      // TODO: return indicator for offline modifications
      auth.updateUserInfo({
        ...session!,
        userName: userName as Name,
        firstName: firstName as Name,
        lastName: lastName as Name,
        imagePath: imageUrl,
        birthDate,
        country: country as Name,
        city: city as Name,
        phone: phone as StringBetween<1, 30>
      })
      // if (res === AuthResult.Success) setSuccessMessage('Profil modifié');
      // else setErrorMessage("Une erreur est survenue. Merci de réssayer.");
    }
  }

  const changeMail = () => {
    if (!email || (email && !isEmail(email))) setEmailError("Email invalide");
    else {
      console.log("change mail");
    }
  }

  const deleteAccount = () => {
    console.log("delete account");
  }

  return (
    <>
      <HeaderDesktop
          backLink="/"
          title="Profile"
      />
      <div className='h-contentPlusHeader md:h-full w-full flex flex-row bg-white overflow-auto'>

        <LeftbarDesktop
          currentMenuItem="USER"
        />
        
        <div className='flex flex-col w-full h-full justify-center md:px-12'>
          <div className='flex flex-row justify-center md:justify-start rounded-lg px-6 pb-10 pt-12 md:pt-[16px]'>
            <div className='h-[100px] w-[100px] relative cursor-pointer'>
              <ProfilePicture
                src={imageUrl || staticUrl.defaultProfilePicture}
                onClick={() => {
                  if (imageInputRef.current) imageInputRef.current.click();
                }}
              />
              <div className='hidden'>
                <ImageInput 
                  ref={imageInputRef}
                  onChange={(images) => {
                    // TODO
                  }}
                />
              </div>
            </div>
            
            <div className='hidden md:flex flex-col ml-6 w-1/2'>
              <div className='mb-6'>
                <div className='ktext-subtitle'>{userName}</div>
                {session!.role === 'ADMIN' && <div className='text-main ktext-label'>Super-administrateur</div>}
              </div>
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={userNameError}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            {session!.role === 'ADMIN' &&
              <div className='absolute right-[5%]'>
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
              tabs={[]}
            />
          </div>

          <div className='flex flex-col gap-6 px-6'>
            <div className='flex flex-col gap-6 pb-8'>
              <TextInput 
                  id='email'
                  label='Email'
                  error={emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                  content="Modifier l'email"
                  fullWidth
                  onClick={changeMail}
              />
            </div>

            <div className='md:hidden'>
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={userNameError}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className='flex flex-row gap-3'>
              <TextInput 
                  id='firstName'
                  label='Prénom'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
              />
              <TextInput 
                  id='lastName'
                  label='Nom'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className='md:hidden'>
              <TextInput 
                  id='phone'
                  label='Téléphone'
                  error={phoneError}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className='flex flex-row gap-3 w-full'>
              <div className='hidden md:block w-1/2'>
                <TextInput 
                    id='phone'
                    label='Téléphone'
                    error={phoneError}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <TextInput 
                  id='birthDate'
                  label='Date de naissance'
                  wrapperClassName='md:w-1/2'
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div className='flex flex-row gap-2'>
              <TextInput 
                  id='citizenship'
                  label='Pays'
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
              />
              <TextInput 
                  id='city'
                  label='Ville'
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <Button
                content="Valider"
                fullWidth
                onClick={modifyProfil}
            />
            {errorMessage && <div className='ktext-error'>{errorMessage}</div>}
            {successMessage && <div className='text-main'>{successMessage}</div>}

            <div className='flex flex-col items-center gap-4 mb-10 md:mb-0 md:pt-10'>
              <Link href="/user/changePassword">
                  <div className="ktext-base-little text-main cursor-pointer">Modifier le mot de passe</div>
              </Link>

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
          Toutes les données du compte seront définitivement supprimées. Etes-vous sûr de vouloir continuer ?
        </ModalDelete>
      }
    </>
  );
});

export default ProfilePage;
