import React, { useState } from 'react';
import type { NextPage } from 'next';
import { Button, Header, TextInput } from 'components';
import Link from 'next/link';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';
import { api, AuthResult } from 'helpers/services/ApiService';
import { Email, isEmail, isName, Name } from 'types';
import { useRouter } from 'next/router';


const SignupPage: NextPage = () => {
  const router = useRouter();

  const [pseudo, setPseudo] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [pseudoError, setPseudoError] = useState<string>();
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();

  const [errorMessage, setErrorMessage] = useState<string>();

  const signup = async () => {
    let hasError = false;
    if (!pseudo || !isName(pseudo)) { setPseudoError("Pseudo invalide"); hasError = true; }
    if (!email || !isEmail(email)) { setEmailError("Email invalide"); hasError = true; }
    if (!password) { setPasswordError("Mot de passe invalide"); hasError = true; }
    else if (password.length < 8) { setPasswordError("Le mot de passe doit faire plus de 8 caractères"); hasError = true; }

    if (!hasError) {
      const res = await api.signup(email as Email, password!, pseudo as Name);
      if (res === AuthResult.ConfirmationRequired) setErrorMessage("Pour valider votre compte, merci de cliquer sur le lien qui vous a été envoyé par email");
      else if (res === AuthResult.Success) router.push("/");
      else setErrorMessage("Une erreur est survenue. Merci de réessayer.")
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
            <div className='ktext-error'>{errorMessage}</div>

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
