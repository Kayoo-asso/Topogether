import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, TextInput } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Email, isEmail, Name, StringBetween, User } from "types";
import { useAuth } from "helpers/services";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ChangeMailModal } from "./ChangeMailModal";

interface ProfileFormProps {
	userQuark: Quark<User>;
	setDisplayModifyProfile: Dispatch<SetStateAction<boolean>>
}

export const ProfileForm: React.FC<ProfileFormProps> = watchDependencies(
	(props: ProfileFormProps) => {
		const auth = useAuth();
		const [user, setUser] = useState(props.userQuark());

		const [userNameError, setUserNameError] = useState<string>();
		const [phoneError, setPhoneError] = useState<string>();
		const [successMessageModify, setSuccessMessageModify] = useState<string>();
		const [errorMessageModify, setErrorMessageModify] = useState<string>();
		
		const [displayChangePassword, setDisplayChangePassword] = useState(false);
		const [displayChangeMail, setDisplayChangeMail] = useState(false);

		const [loadingModify, setLoadingModify] = useState(false);

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
				if (res) {
					setSuccessMessageModify("Profil modifié");
					props.userQuark.set(user);
					props.setDisplayModifyProfile(false);
				}
				else
					setErrorMessageModify("Une erreur est survenue. Merci de réessayer.");
				setLoadingModify(false);
			}
		};

		return (
			<>
				<div className="flex flex-col gap-6 px-6">
					<div className="flex flex-row items-center">
						<TextInput
							id="email"
							label='Email'
							value={user.email}
							readOnly
							inputClassName="cursor-pointer"
							onClick={() => setDisplayChangeMail(true)}
						/>
					</div>

					<div className="flex flex-row items-center gap-3">
						<TextInput
							id="pseudo"
							label="Pseudo"
							error={userNameError}
							value={user.userName}
							onChange={(e) =>
								setUser(u => ({
									...u,
									userName: e.target.value as Name,
								}))
							}
						/>

						<TextInput 
							id='password'
							label="Mot de passe"
							value="*********"
							readOnly
							inputClassName="cursor-pointer"
							onClick={() => setDisplayChangePassword(true)}
						/>
						{/* <Button
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
						)} */}

					</div>


					<div className="flex flex-row gap-3">
						<TextInput
							id="firstName"
							label="Prénom"
							value={user.firstName}
							onChange={(e) =>
								setUser(u => ({
									...u,
									firstName: e.target.value as Name,
								}))
							}
						/>
						<TextInput
							id="lastName"
							label="Nom"
							value={user.lastName}
							onChange={(e) =>
								setUser(u => ({
									...u,
									lastName: e.target.value as Name,
								}))
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
								setUser(u => ({
									...u,
									phone: e.target.value as StringBetween<1, 30>,
								}))
							}
						/>
					</div>

					<div className="flex w-full flex-row gap-3">
						<div className="hidden w-1/2 md:block">
							<TextInput
								id="phone-md"
								label="Téléphone"
								error={phoneError}
								value={user.phone}
								onChange={(e) =>
									setUser(u => ({
										...u,
										phone: e.target.value as StringBetween<1, 30>,
									}))
								}
							/>
						</div>
						<TextInput
							id="birthDate"
							label="Date de naissance"
							wrapperClassName="md:w-1/2"
							value={user.birthDate}
							onChange={(e) =>
								setUser(u => ({
									...u,
									birthDate: e.target.value,
								}))
							}
						/>
					</div>

					<div className="flex flex-row gap-2">
						<TextInput
							id="city"
							label="Ville"
							value={user.city}
							onChange={(e) =>
								setUser(u => ({
									...u,
									city: e.target.value as Name,
								}))
							}
						/>
						<TextInput
							id="citizenship"
							label="Pays"
							value={user.country}
							onChange={(e) =>
								setUser(u => ({
									...u,
									country: e.target.value as Name,
								}))
							}
						/>
					</div>

					<Button
						content="Valider les modifications"
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

					<div 
						className="text-grey-medium cursor-pointer mb-6 hidden md:flex"
						onClick={() => props.setDisplayModifyProfile(false)}
					>Retour</div>
				</div>

				<ChangePasswordModal 
					open={displayChangePassword}
					onClose={() => setDisplayChangePassword(false)}
				/>
				<ChangeMailModal 
					mail={user.email}
					open={displayChangeMail}
					onClose={() => setDisplayChangeMail(false)}
				/>
			</>
		);
	}
);

ProfileForm.displayName = "ProfileForm";
