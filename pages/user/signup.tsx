import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button, Header, TextInput } from 'components';
import Link from 'next/link';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';

const SignupPage: NextPage = () => {
  const [pseudo, setPseudo] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [pseudoError, setPseudoError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const checkErrors = () => {
      if (!pseudo) setPseudoError("Pseudo invalide");
      if (!email) setEmailError("Email invalide");
      if (!password) setPasswordError("Password invalide");

      if (pseudo && email && password) return true;
      else return false;
  }
  const signup = () => {
      if (checkErrors()) {
          console.log("signup");
      }
  }

  return (
    <>
      <Header
          backLink="/user/login"
          title="Création de compte"
          displayLogin
      />

      <div className="w-full h-full flex flex-col items-center justify-center bg-bottom bg-white md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
        <div className="p-10 w-full bg-white md:w-[500px] md:shadow md:rounded-lg -mt-16 md:mt-0">

          <div className='flex flex-col gap-6 items-center w-full'>
            <div className="ktext-section-title self-start hidden md:block">Créer un compte</div>

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
                id='pseudo'
                label='Pseudo'
                error={pseudoError}
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
            />
            <TextInput 
                id='email'
                label='Email'
                error={emailError}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput 
                id='password'
                label='Mot de passe'
                error={passwordError}
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button 
                content="Créer un compte"
                fullWidth
                onClick={signup}
            />

            <Link href="/user/login">
                <div className="ktext-base-little text-main cursor-pointer hidden md:block">Retour</div>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
};

export default SignupPage;
