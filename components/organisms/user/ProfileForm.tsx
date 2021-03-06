import React, { useState } from "react";
import { Button, TextInput } from "components";
import Link from "next/link";
import { useCreateQuark, watchDependencies } from "helpers/quarky";
import { Email, isEmail, Name, StringBetween, User } from "types";
import { useAuth } from "helpers/services";
import { useRouter } from "next/router";
import { useLoader } from "helpers/hooks";

interface ProfileFormProps {
	user: User;
	onDeleteAccountClick: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = watchDependencies(
	(props: ProfileFormProps) => {
		const auth = useAuth();
		const router = useRouter();
		const userQuark = useCreateQuark(props.user);
		const user = userQuark();

		const showLoader = useLoader();

		const [emailError, setEmailError] = useState<string>();
		const [successMessageChangeMail, setSuccessMessageChangeMail] =
			useState<string>();
		const [errorMessageChangeMail, setErrorMessageChangeMail] =
			useState<string>();

		const [userNameError, setUserNameError] = useState<string>();
		const [phoneError, setPhoneError] = useState<string>();

		const [successMessageModify, setSuccessMessageModify] = useState<string>();
		const [errorMessageModify, setErrorMessageModify] = useState<string>();

		const [errorMessageSignout, setErrorMessageSignout] = useState<string>();

		const [loadingModify, setLoadingModify] = useState(false);
		const [loadingChangeMail, setLoadingChangeMail] = useState(false);

		const modifyProfile = async () => {
			let hasError = false;
			if (!user.userName) {
				setUserNameError("Pseudo invalide");
				hasError = true;
			}
			if (
				user.phone &&
				(!user.phone.match(/\d/g) ||
					user.phone.length < 6 ||
					user.phone.length > 30)
			) {
				setPhoneError("Numéro de téléphone invalide");
				hasError = true;
			}

			if (!hasError) {
				setLoadingModify(true);
				const res = await auth.updateUserInfo(user);
				if (res) setSuccessMessageModify("Profil modifié");
				else
					setErrorMessageModify("Une erreur est survenue. Merci de réessayer.");
				setLoadingModify(false);
			}
		};

		const changeMail = async () => {
			if (!user.email || (user.email && !isEmail(user.email)))
				setEmailError("Email invalide");
			else {
				setLoadingChangeMail(true);
				await auth.changeEmail(user.email);
				setLoadingChangeMail(false);
			}
		};

		return (
			<div className="flex flex-col gap-6 px-6">
				<div className="flex flex-col items-center gap-6 pb-4">
					<TextInput
						id="email"
						label="Email"
						error={emailError}
						value={user.email}
						onChange={(e) =>
							userQuark.set({
								...user,
								email: e.target.value as Email,
							})
						}
					/>
					<Button
						content="Modifier l'email"
						fullWidth
						onClick={changeMail}
						loading={loadingChangeMail}
					/>
					{successMessageChangeMail && (
						<div className="ktext-error text-center text-main">
							{successMessageChangeMail}
						</div>
					)}
					{errorMessageChangeMail && (
						<div className="ktext-error text-center text-error">
							{errorMessageChangeMail}
						</div>
					)}

					<Link href="/user/changePassword">
						<a className="ktext-base-little cursor-pointer text-main">
							Modifier le mot de passe
						</a>
					</Link>
				</div>

				<div className="md:hidden">
					<TextInput
						id="pseudo"
						label="Pseudo"
						error={userNameError}
						value={user.userName}
						onChange={(e) =>
							userQuark.set({
								...user,
								userName: e.target.value as Name,
							})
						}
					/>
				</div>

				<div className="flex flex-row gap-3">
					<TextInput
						id="firstName"
						label="Prénom"
						value={user.firstName}
						onChange={(e) =>
							userQuark.set({
								...user,
								firstName: e.target.value as Name,
							})
						}
					/>
					<TextInput
						id="lastName"
						label="Nom"
						value={user.lastName}
						onChange={(e) =>
							userQuark.set({
								...user,
								lastName: e.target.value as Name,
							})
						}
					/>
				</div>

				<div className="md:hidden">
					<TextInput
						id="phone"
						label="Téléphone"
						error={phoneError}
						value={user.phone}
						onChange={(e) =>
							userQuark.set({
								...user,
								phone: e.target.value as StringBetween<1, 30>,
							})
						}
					/>
				</div>

				<div className="flex w-full flex-row gap-3">
					<div className="hidden w-1/2 md:block">
						<TextInput
							id="phone"
							label="Téléphone"
							error={phoneError}
							value={user.phone}
							onChange={(e) =>
								userQuark.set({
									...user,
									phone: e.target.value as StringBetween<1, 30>,
								})
							}
						/>
					</div>
					<TextInput
						id="birthDate"
						label="Date de naissance"
						wrapperClassName="md:w-1/2"
						value={user.birthDate}
						onChange={(e) =>
							userQuark.set({
								...user,
								birthDate: e.target.value,
							})
						}
					/>
				</div>

				<div className="flex flex-row gap-2">
					<TextInput
						id="citizenship"
						label="Pays"
						value={user.country}
						onChange={(e) =>
							userQuark.set({
								...user,
								country: e.target.value as Name,
							})
						}
					/>
					<TextInput
						id="city"
						label="Ville"
						value={user.city}
						onChange={(e) =>
							userQuark.set({
								...user,
								city: e.target.value as Name,
							})
						}
					/>
				</div>

				<Button
					content="Modifier le profil"
					fullWidth
					onClick={modifyProfile}
					loading={loadingModify}
				/>
				{successMessageModify && (
					<div className="ktext-error text-center text-main">
						{successMessageModify}
					</div>
				)}
				{errorMessageModify && (
					<div className="ktext-error text-center text-error">
						{errorMessageModify}
					</div>
				)}

				<div className="mb-10 flex flex-col items-center gap-4 md:mb-4 md:pt-4">
					<div
						className="ktext-base-little cursor-pointer text-main"
						onClick={async () => {
							showLoader(true);
							const success = await auth.signOut();
							if (success) await router.push("/user/login");
							else {
								setErrorMessageSignout(
									"Une erreur est survenue. Merci de réessayer."
								);
								showLoader(false);
							}
						}}
					>
						Se déconnecter
						{errorMessageSignout && (
							<div className="ktext-error">{errorMessageSignout}</div>
						)}
					</div>

					<div
						className="ktext-base-little cursor-pointer text-main"
						onClick={props.onDeleteAccountClick}
					>
						Supprimer le compte
					</div>
				</div>
			</div>
		);
	}
);

ProfileForm.displayName = "ProfileForm";
