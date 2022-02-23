import React, { useContext, useState } from 'react';
import type { NextPage } from 'next';
import { staticUrl, UserContext } from 'helpers';
import NextImage from 'next/image';
import { Button, ModalDelete, Select, Tabs, TextInput } from 'components';
import { GenderName } from 'types/EnumNames';
import Link from 'next/link';

const ProfilePage: NextPage = () => {
  const { session, setSession } = useContext(UserContext);
  if (!session || !setSession) {
    return null;
  }

  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  
  const [email, setEmail] = useState<string>(session.email);
  const [emailError, setEmailError] = useState<string>();
  
  const [pseudo, setPseudo] = useState<string>(session.pseudo);
  const [firstName, setFirstName] = useState<string | undefined>(session.firstName);
  const [lastName, setLastName] = useState<string | undefined>(session.lastName);
  const [birthDate, setBirthDate] = useState<Date | undefined>(session.birthDate);
  const [country, setCountry] = useState<string | undefined>(session.country);
  const [city, setCity] = useState<string | undefined>(session.city);
  const [phone, setPhone] = useState<string | undefined>(session.phone);

  const [pseudoError, setPseudoError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();

  const checkErrors = () => {
    if (!pseudo) setPseudoError("Pseudo invalide");

    if (pseudo) return true;
    else return false;
  }
  const modifyProfil = () => {
    if (checkErrors()) {
      console.log("modify profil");
    }
  }

  const changeMail = () => {
    if (!email) setEmailError("Email invalide");
    else {
      console.log("change mail");
    }
  }

  const deleteAccount = () => {
    console.log("delete account");
  }

  return (
    <>
      <div className='h-contentPlusHeader w-full flex flex-col bg-white justify-center'>
        
        <div className='flex flex-row justify-center rounded-lg px-6 pb-10'>
          <div className='h-[100px] w-[100px] relative'>
            <NextImage
                src={session.imageUrl || staticUrl.defaultProfilePicture}
                priority
                alt="Image de profile"
                layout="fill"
                objectFit="contain"
            />
          </div>

          {session.role === 'ADMIN' &&
            <div className='absolute right-[5%]'>
              <Button
                content='Admin'
                href='/admin'
                white
              />
            </div>
          }
        </div>

        <Tabs 
          tabs={[]}
        />

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


          <TextInput 
              id='pseudo'
              label='Pseudo'
              error={pseudoError}
              value={session.pseudo}
              onChange={(e) => setPseudo(e.target.value)}
          />

          <div className='flex flex-row gap-2'>
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

          <div className='flex flex-row gap-2'>
            <TextInput 
                id='birthDate'
                label='Date de naissance'
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

          <TextInput 
              id='phone'
              label='Téléphone'
              error={phoneError}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
          />

          <Button
              content="Valider"
              fullWidth
              onClick={modifyProfil}
          />

          <div className='flex flex-row justify-between'>
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
};

export default ProfilePage;
