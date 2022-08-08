import React, { useState } from "react";
import type { NextPage } from "next";
import { Button, TextInput } from "components";
import NextImage from "next/image";
import Link from "next/link";
import { Header } from "components/layouts/Header";
import { staticUrl } from "helpers/constants";

const ForgotPasswordPage: NextPage = () => {
	const [email, setEmail] = useState<string>();
	const [emailError, setEmailError] = useState<string>();

	const [loading, setLoading] = useState(false);

	const checkErrors = () => {
		if (!email) setEmailError("Email invalide");
		if (email) return true;
		else return false;
	};
	const send = async () => {
		if (checkErrors()) {
			setLoading(true);
			//TODO
			alert("Pour des raisons de sécurité, la réinitialisation de mot de passe a été temporairement désactivé. En attendant que tout rentre dans l'ordre, vous pouvez contacter un administrateur à l'adresse contact@topogether.com");
			setLoading(false);
		}
	};

	return (
		<>
			<Header backLink="/user/login" title="Mot de passe oublié" displayLogin />

			<div className="flex h-full w-full flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="mb-10 -mt-16 w-full bg-white p-10 md:mt-0 md:w-[500px] md:rounded-lg md:shadow">
					<div className="flex w-full flex-col items-center gap-8">
						<div className="ktext-section-title hidden self-start md:block">
							Se connecter
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
							id="email"
							label="Email"
							error={emailError}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<Button
							content="Réinitialiser le mot de passe"
							fullWidth
							onClick={send}
							loading={loading}
						/>

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

export default ForgotPasswordPage;
