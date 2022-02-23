import React, { useState } from 'react';
import { Button, Checkbox, TextInput } from 'components';
import Link from 'next/link';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';
import { api, AuthResult } from 'helpers/services/ApiService';
import { Email } from 'types';
import { useRouter } from 'next/router';

export const LoginForm: React.FC = (props) => {
    const router = useRouter();

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [rememberChecked, setRememberChecked] = useState(false);

    const [emailError, setEmailError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();

    const [errorMessage, setErrorMessage] = useState<string>();

    const login = async () => {
        let hasError = false;
        if (!email) { setEmailError("Email invalide"); hasError = true };
        if (!password) { setPasswordError("Password invalide"); hasError = true };

        if (!hasError) {
            const res = await api.signIn(email as Email, password!);
            if (res === AuthResult.ConfirmationRequired) setErrorMessage("Merci de confirmer votre compte en cliquant sur le lien dans le mail qui vous a été envoyé.");
            else if (res === AuthResult.Success) router.push("/");
            else setErrorMessage("Authentification incorrecte");
        }
    }

    return (
        <div className='flex flex-col gap-6 items-center w-full'>
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

            <TextInput 
                id='password'
                label='Mot de passe'
                error={passwordError}
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <div className='flex flex-col w-full md:flex-row justify-start md:justify-between items-center mb-3 mt-3 md:mb-6'>
                <div className="hidden md:block">
                    <Checkbox 
                        checked={rememberChecked}
                        label="Se souvenir de moi"
                        onClick={() => setRememberChecked(!rememberChecked)}
                    />
               </div> 
                <div className="w-full md:w-auto">
                    <Button 
                        content="Se connecter"
                        fullWidth
                        onClick={login}
                    />
                    <div className='ktext-error'>{errorMessage}</div>
                </div>
            </div>

            <div className='flex flex-row w-full justify-center md:justify-between items-center'>
                <Link href="/user/signup">
                    <div className="ktext-base-little text-main cursor-pointer hidden md:block">Créer un compte</div>
                </Link>
                <Link href="/user/forgotPassword">
                    <div className="ktext-base-little text-main cursor-pointer">Mot de passe oublié ?</div>
                </Link>
            </div>

            <div className='w-full pt-20 -mb-4 md:hidden'>
                <Button 
                    content="Créer un compte"
                    fullWidth
                    href='/user/signup'
                />
            </div>

        </div>
    )
}