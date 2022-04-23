import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, TextInput } from 'components';
import Link from 'next/link';
import NextImage from 'next/image';
import { staticUrl } from 'helpers';
import { SignInRes, useAuth } from 'helpers/services';
import { Email } from 'types';
import { useRouter } from 'next/router';

interface LoginFormProps {
    onLogin?: () => void,
}

export const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
    const router = useRouter();
    const auth = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [emailError, setEmailError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();

    const [errorMessage, setErrorMessage] = useState<string>();

    const [loading, setLoading] = useState(false);

    const login = useCallback(async () => {
        let hasError = false;
        if (!email) { setEmailError("Email invalide"); hasError = true };
        if (!password) { setPasswordError("Mot de passe invalide"); hasError = true };

        if (!hasError) {
            setLoading(true);
            const res = await auth.signIn(email as Email, password!);
            if (res === SignInRes.ConfirmationRequired) setErrorMessage("Merci de confirmer votre compte en cliquant sur le lien dans le mail qui vous a été envoyé.");
            else if (res === SignInRes.Ok) {
                if (props.onLogin) props.onLogin();
                else router.push("/");
            }
            else setErrorMessage("Authentification incorrecte");
            setLoading(false);
        }
    }, [email, password]);

    const handleUserKeyPress = useCallback((e) => {
        if (e.key === 'Enter') login();
    }, [email, password]);
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return (
        <div className='flex flex-col gap-6 items-center w-full'>
            <div className="ktext-section-title self-start hidden md:block">Se connecter</div>
            <div className="h-[150px] w-[150px] relative mt-10 md:hidden">
                <NextImage
                    src={staticUrl.logo_color}
                    priority
                    alt="Logo Topogether"
                    layout="fill"
                    objectFit="contain"
                />
            </div>

            {router.query.redirectTo &&
                <div className="ktext-error text-error">Vous devez vous connecter pour accéder à cette page.</div>
            }

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

            <div className='flex flex-col w-full md:flex-row justify-start md:justify-between items-center md:mb-6'>
                <div className="w-full">
                    <Button 
                        content="Se connecter"
                        fullWidth
                        onClick={login}
                        loading={loading}
                    />
                    <div className='ktext-error text-error mt-3'>{errorMessage}</div>
                </div>
            </div>

            <div className='flex flex-col gap-16 w-full'>
                <div className='flex flex-row w-full justify-center md:justify-between items-center'>
                    <Link href="/user/signup">
                        <a className="ktext-base-little text-main cursor-pointer hidden md:block">Créer un compte</a>
                    </Link>
                    <Link href="/user/forgotPassword">
                        <a className="ktext-base-little text-main cursor-pointer">Mot de passe oublié ?</a>
                    </Link>
                </div>

                <div className='w-full md:hidden'>
                    <Button 
                        content="Créer un compte"
                        fullWidth
                        href='/user/signup'
                    />
                </div>
            </div>

        </div>
    )
}