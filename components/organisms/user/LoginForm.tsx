import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { SignInRes, useAuth } from "helpers/services";
import { Email } from "types";
import { useRouter } from "next/router";
import { staticUrl } from "helpers/constants";
import { TextInput } from "components/molecules/form/TextInput";
import { Button } from "components/atoms/buttons/Button";

interface LoginFormProps {
	onLogin?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {
	const router = useRouter();
	const auth = useAuth();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [emailError, setEmailError] = useState<string>();
	const [passwordError, setPasswordError] = useState<string>();

	const [errorMessage, setErrorMessage] = useState<string>();

	const [loading, setLoading] = useState(false);

	const login = useCallback(async () => {
		let hasError = false;
		if (!email) {
			setEmailError("Email invalide");
			hasError = true;
		}
		if (!password) {
			setPasswordError("Mot de passe invalide");
			hasError = true;
		}

		if (!hasError) {
			setLoading(true);
			const res = await auth.signIn(email as Email, password!);
			if (res === SignInRes.ConfirmationRequired)
				setErrorMessage(
					"Merci de confirmer votre compte en cliquant sur le lien dans le mail qui vous a été envoyé."
				);
			else if (res === SignInRes.Ok) {
				if (props.onLogin) props.onLogin();
				else router.push("/");
			} else setErrorMessage("Authentification incorrecte");
			setLoading(false);
		}
	}, [email, password]);

	const handleUserKeyPress = useCallback(
		(e) => {
			if (e.key === "Enter") login();
		},
		[email, password]
	);
	useEffect(() => {
		window.addEventListener("keydown", handleUserKeyPress);
		return () => {
			window.removeEventListener("keydown", handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

	return (
		<div className="flex w-full flex-col items-center gap-6">
			<div className="ktext-section-title hidden self-start md:block">
				Se connecter
			</div>
			<div className="relative mt-10 h-[150px] w-[150px] md:hidden">
				<NextImage
					src={staticUrl.logo_color}
					priority
					alt="Logo Topogether"
					layout="fill"
					objectFit="contain"
				/>
			</div>

			{router.query.redirectTo && (
				<div className="ktext-error text-error">
					Vous devez vous connecter pour accéder à cette page.
				</div>
			)}

			<TextInput
				id="email"
				label="Email"
				error={emailError}
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				onKeyDown={handleUserKeyPress}
			/>

			<TextInput
				id="password"
				label="Mot de passe"
				error={passwordError}
				value={password}
				type="password"
				onChange={(e) => setPassword(e.target.value)}
				onKeyDown={handleUserKeyPress}
			/>

			<div className="flex w-full flex-col items-center justify-start md:mb-6 md:flex-row md:justify-between">
				<div className="w-full">
					<Button
						content="Se connecter"
						fullWidth
						onClick={login}
						loading={loading}
					/>
					<div className="ktext-error mt-3 text-error">{errorMessage}</div>
				</div>
			</div>

			<div className="flex w-full flex-col gap-16">
				<div className="flex w-full flex-row items-center justify-center md:justify-between">
					<Link href="/user/signup">
						<a className="ktext-base-little hidden md:cursor-pointer text-main md:block">
							Créer un compte
						</a>
					</Link>
					<Link href="/user/forgotPassword">
						<a className="ktext-base-little md:cursor-pointer text-main">
							Mot de passe oublié ?
						</a>
					</Link>
				</div>

				<div className="w-full md:hidden">
					<Button content="Créer un compte" fullWidth href="/user/signup" />
				</div>
			</div>
		</div>
	);
};
