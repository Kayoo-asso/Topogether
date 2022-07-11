import React, { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { Button, TextInput } from "components";
import Link from "next/link";
import NextImage from "next/image";
import { SignUpRes, useAuth } from "helpers/services";
import { Email, isEmail, isName, Name } from "types";
import { useRouter } from "next/router";
import { Header } from "components/layouts/Header";
import { staticUrl } from "helpers/constants";

const SignupPage: NextPage = () => {
	const router = useRouter();
	const auth = useAuth();

	const [pseudo, setPseudo] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [password, setPassword] = useState<string>();

	const [pseudoError, setPseudoError] = useState<string>();
	const [emailError, setEmailError] = useState<string>();
	const [passwordError, setPasswordError] = useState<string>();

	const [errorMessage, setErrorMessage] = useState<string>();
	const [validateEmailMessage, setValidateEmailMessage] = useState<string>();

	const [loading, setLoading] = useState(false);

	const signup = async () => {
		let hasError = false;
		if (!pseudo || !isName(pseudo)) {
			setPseudoError("Pseudo invalide");
			hasError = true;
		}
		if (!email || !isEmail(email)) {
			setEmailError("Email invalide");
			hasError = true;
		}
		if (!password) {
			setPasswordError("Mot de passe invalide");
			hasError = true;
		} else if (password.length < 8) {
			setPasswordError("Le mot de passe doit faire plus de 8 caractères");
			hasError = true;
		}

		if (!hasError) {
			setLoading(true);
			const res = await auth.signUp(email as Email, password!, pseudo as Name);
			if (res === SignUpRes.ConfirmationRequired)
				setValidateEmailMessage(
					"Pour valider votre compte, merci de cliquer sur le lien qui vous a été envoyé par email"
				);
			else if (res === SignUpRes.LoggedIn) router.push("/");
			else if (res === SignUpRes.AlreadyExists)
				setEmailError("Un utilisateur avec cet email existe déjà");
			else setErrorMessage("Une erreur est survenue. Merci de réessayer.");
			setLoading(false);
		}
	};

	const handleUserKeyPress = useCallback(
		(e) => {
			if (e.key === "Enter") signup();
		},
		[pseudo, email, password]
	);
	useEffect(() => {
		window.addEventListener("keydown", handleUserKeyPress);
		return () => {
			window.removeEventListener("keydown", handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

	return (
		<>
			<Header
				backLink="/user/login"
				title="Création de compte"
				displayLogin={true}
			/>

			<div className="flex h-full w-full flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="-mt-16 w-full bg-white p-10 md:mt-0 md:w-[500px] md:rounded-lg md:shadow">
					<div className="flex w-full flex-col items-center gap-6">
						<div className="ktext-section-title hidden self-start md:block">
							Créer un compte
						</div>

						<div className="relative h-[150px] w-[150px] md:hidden">
							<NextImage
								src={staticUrl.logo_color}
								priority
								alt="Logo Topogether"
								layout="fill"
								objectFit="contain"
							/>
						</div>

						<TextInput
							id="pseudo"
							label="Pseudo"
							error={pseudoError}
							value={pseudo}
							onChange={(e) => setPseudo(e.target.value)}
						/>
						<TextInput
							id="email"
							label="Email"
							error={emailError}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextInput
							id="password"
							label="Mot de passe"
							error={passwordError}
							value={password}
							type="password"
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Button
							content="Créer un compte"
							fullWidth
							onClick={signup}
							activated={!validateEmailMessage}
							loading={loading}
						/>
						{errorMessage && (
							<div className="ktext-error text-error">{errorMessage}</div>
						)}
						{validateEmailMessage && (
							<div className="ktext-error text-main">
								{validateEmailMessage}
							</div>
						)}

						<Link href="/user/login">
							<a className="ktext-base-little hidden cursor-pointer text-main md:block">
								Retour
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignupPage;
