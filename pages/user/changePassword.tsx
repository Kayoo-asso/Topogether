import React, { useState } from "react";
import type { NextPage } from "next";
import { Button, TextInput } from "components";
import NextImage from "next/image";
import Link from "next/link";
import { useAuth } from "helpers/services";
import { User } from "types";
import { Header } from "components/layouts/Header";
import { staticUrl } from "helpers/constants";

type ChangePasswordProps = {
	user: User;
};

const ChangePasswordPage: NextPage<ChangePasswordProps> = () => {
	const auth = useAuth();

	const [oldPassword, setOldPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [secondNewPassword, setSecondNewPassword] = useState<string>("");

	const [oldPasswordError, setOldPasswordError] = useState<string>("");
	const [newPasswordError, setNewPasswordError] = useState<string>("");
	const [secondNewPasswordError, setSecondNewPasswordError] = useState<string>("");

	const [loading, setLoading] = useState(false);

	const checkErrors = () => {
		if (oldPassword.length === 0)
			setOldPasswordError("Merci de rentrer votre ancien mot de passe");
		if (newPassword.length === 0) setNewPasswordError("Mot de passe invalide");
		if (secondNewPassword.length === 0)
			setSecondNewPasswordError("Mot de passe invalide");
		if (newPassword !== secondNewPassword)
			setSecondNewPasswordError("Les deux mots de passe ne correspondent pas");

		if (
			oldPassword &&
			newPassword &&
			secondNewPassword &&
			newPassword === secondNewPassword
		)
			return true;
		else return false;
	};
	const modifyPassword = async () => {
		if (checkErrors()) {
			setLoading(true);
			const res = await auth.changePassword(newPassword); //TODO: test if it works
			setLoading(false);
		}
	};

	return (
		<>
			<Header
				backLink="/user/profile"
				title="Modification de mot de passe"
				displayLogin
			/>

			<div className="flex h-full w-full flex-col items-center justify-center bg-white bg-bottom md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
				<div className="mb-10 -mt-16 w-full bg-white p-10 md:mt-0 md:w-[500px] md:rounded-lg md:shadow">
					<div className="flex w-full flex-col items-center gap-8">
						<div className="ktext-section-title hidden self-start md:block">
							Modifier le mot de passe
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
							id="oldPassword"
							label="Ancien mot de passe"
							error={oldPasswordError}
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>

						<TextInput
							id="newPassword"
							label="Nouveau mot de passe"
							error={newPasswordError}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>

						<TextInput
							id="secondNewPassword"
							label="Retaper le nouveau mot de passe"
							error={secondNewPasswordError}
							value={secondNewPassword}
							onChange={(e) => setSecondNewPassword(e.target.value)}
						/>

						<Button
							content="Changer le mot de passe"
							fullWidth
							onClick={modifyPassword}
							loading={loading}
						/>

						<Link href="/user/profile">
							<a className="ktext-base-little hidden cursor-pointer text-main md:flex md:w-full">
								Retour
							</a>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChangePasswordPage;
