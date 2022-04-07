import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button, TextInput } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import Link from 'next/link';
import { Header } from 'components/layouts/header/Header';

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState<string>();
  const [emailError, setEmailError] = useState<string>();

  const checkErrors = () => {
    if (!email) setEmailError("Email invalide");

    if (email) return true;
    else return false;
  }
  const send = () => {
      if (checkErrors()) {
          console.log("Reset password"); //TODO
      }
  }

  return (
    <>
    <Header
        backLink="/user/login"
        title="Mot de passe oublié"
        displayLogin
    />

      <div className="w-full h-full flex flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
        <div className="p-10 w-full bg-white mb-10 md:w-[500px] md:shadow md:rounded-lg -mt-16 md:mt-0">

          <div className='flex flex-col gap-8 items-center w-full'>
            <div className="ktext-section-title self-start hidden md:block">Se connecter</div>
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
              id='email'
              label='Email'
              error={emailError}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            /> 

            <Button 
                content="Réinitialiser le mot de passe"
                fullWidth
                onClick={send}
            />

            <Link href="/user/login">
                <a className="ktext-base-little text-main cursor-pointer hidden md:block">Retour</a>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
};

export default ForgotPasswordPage;
