import React, { useState } from 'react';
import { useRouter } from 'next/router'
import type { NextPage } from 'next';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import { Button, HeaderDesktop, ImageInput, LeftbarDesktop, ModalDelete, Tabs, TextInput } from 'components';
import Link from 'next/link';
import { watchDependencies } from 'helpers/quarky';
import { isEmail, Name, StringBetween } from 'types';
import { api, AuthResult } from 'helpers/services/ApiService';

const ProfilePage: NextPage = watchDependencies(() => {
  const router = useRouter();
  const session = api.user();
  if (!session) router.push('/');

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  
  const [email, setEmail] = useState<string>(session!.email);
  const [emailError, setEmailError] = useState<string>();
  
  const [pseudo, setPseudo] = useState<string>(session!.pseudo);
  const [firstName, setFirstName] = useState<string | undefined>(session!.firstName);
  const [lastName, setLastName] = useState<string | undefined>(session!.lastName);
  const [imageUrl, setImageUrl] = useState<string | undefined>(session!.imageUrl);
  const [birthDate, setBirthDate] = useState<Date | undefined>(session!.birthDate);
  const [country, setCountry] = useState<string | undefined>(session!.country);
  const [city, setCity] = useState<string | undefined>(session!.city);
  const [phone, setPhone] = useState<string | undefined>(session!.phone);

  const [pseudoError, setPseudoError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();

  const [successMessage, setSuccessMessage] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const modifyProfil = async () => {
    let hasError = false;
    if (!pseudo) { setPseudoError("Pseudo invalide"); hasError = true; }
    if (phone && (!phone.match(/\d/g) || phone.length < 6 || phone.length > 30)) { setPhoneError("Numéro de téléphone invalide"); hasError = true; }

    if (!hasError) {
      const res = await api.updateUserInfo({
        ...session!,
        pseudo: pseudo as Name,
        firstName: firstName as Name,
        lastName: lastName as Name,
        imageUrl,
        birthDate,
        country: country as Name,
        city: city as Name,
        phone: phone as StringBetween<1, 30>
      })
      if (res === AuthResult.Success) setSuccessMessage('Profil modifié');
      else setErrorMessage("Une erreur est survenue. Merci de réssayer.");
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
      <div className='h-contentPlusHeader md:h-full w-full flex flex-row bg-white'>

        <LeftbarDesktop
          currentMenuItem="USER"
        />
        
        <div className='flex flex-col w-full justify-center md:px-12'>
          <div className='flex flex-row justify-center md:justify-start rounded-lg px-6 pb-10'>
            <div className='h-[100px] w-[100px] relative'>
              <NextImage
                  src={imageUrl || staticUrl.defaultProfilePicture}
                  priority
                  alt="Image de profile"
                  layout="fill"
                  objectFit="contain"
              />
              <div className='hidden'>
                <ImageInput 
                  onChange={(images) => {
                    // TODO
                  }}
                />
              </div>
            </div>
            
            <div className='hidden md:flex flex-col ml-6 w-1/2'>
              <div className='ktext-subtitle'>{session!.pseudo}</div>
              {session!.role === 'ADMIN' && <div className='text-main ktext-label mb-6'>Super-administrateur</div>}
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={pseudoError}
                  value={session!.pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
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
                  error={pseudoError}
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
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
            <div className='ktext-error'>{errorMessage}</div>
            <div className='text-main'>{successMessage}</div>

            <div className='flex flex-row justify-between md:pt-10'>
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
