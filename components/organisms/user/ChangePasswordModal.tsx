import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from "helpers/services";
import { User } from 'types';
import { TextInput } from 'components/molecules';
import { Button } from 'components/atoms';
import { Portal } from 'helpers/hooks';

interface ChangePasswordModalProps {
    open: boolean;
    onClose: () => void,
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (props: ChangePasswordModalProps) => {
    const auth = useAuth();

	const [oldPassword, setOldPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [secondNewPassword, setSecondNewPassword] = useState<string>("");

	const [oldPasswordError, setOldPasswordError] = useState<string>("");
	const [newPasswordError, setNewPasswordError] = useState<string>("");
	const [secondNewPasswordError, setSecondNewPasswordError] = useState<string>("");
    const [error, setError] = useState<string>("");

	const [loading, setLoading] = useState(false);

    const emptyInputs = () => {
        setOldPassword("");
        setNewPassword("");
        setSecondNewPassword("");
    }
    const emptyErrors = () => {
        setOldPasswordError("");
        setNewPasswordError("");
        setSecondNewPasswordError("");
        setError("");
    }
	const hasErrors = useCallback(() => {
        let hasError = false;
		if (oldPassword.length === 0) {
			setOldPasswordError("Merci de rentrer votre ancien mot de passe");
            hasError = true;
        }
		if (newPassword.length < 6) {
            setNewPasswordError("Le mot de passe doit faire au moins 6 caractères");
            hasError = true;
        }
		if (secondNewPassword.length < 6) {
			setSecondNewPasswordError("Le mot de passe doit faire au moins 6 caractères");
            hasError = true;
        }
		if (newPassword !== secondNewPassword) {
			setSecondNewPasswordError("Les deux mots de passe ne correspondent pas");
            hasError = true;
        }
		return hasError;
	}, [oldPassword, newPassword, secondNewPassword]);

	const modifyPassword = useCallback(async () => {
        setError("");
		if (!hasErrors()) {
			setLoading(true);
			const res = await auth.changePassword(newPassword); //TODO: it does not work !
            setLoading(false);
            if (res) {
                emptyErrors();
                emptyInputs();
                props.onClose();  
            }
            else {
                setError("Une erreur est survenue. Merci de réessayer.");
            }
		}
	}, [auth, newPassword, hasErrors]);

    const handleUserKeyPress = useCallback((e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => {
		e.stopPropagation();
		if (e.key === "Enter") modifyPassword();
		if (e.key === "Escape") props.onClose();
	}, [modifyPassword, props.onClose]);
	useEffect(() => {
		window.addEventListener("keydown", handleUserKeyPress);
		return () => {
			window.removeEventListener("keydown", handleUserKeyPress);
		};
	}, [handleUserKeyPress]);

    return (
        <Portal open={props.open}>
            <div 
                className="absolute top-0 left-0 h-full w-full z-full bg-black bg-opacity-80 flex items-center justify-center" 
                onClick={props.onClose}
            >

                <div 
                    className='flex flex-col w-[90%] md:w-[40%] bg-white rounded-sm shadow p-8 md:p-10 items-center gap-8'
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="ktext-section-title self-start">
                        Modifier le mot de passe
                    </div>

                    <TextInput
                        id="oldPassword"
                        label="Ancien mot de passe"
                        type='password'
                        error={oldPasswordError}
                        value={oldPassword}
                        onKeyDown={handleUserKeyPress}
                        onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(""); }}
                    />

                    <TextInput
                        id="newPassword"
                        label="Nouveau mot de passe"
                        type='password'
                        error={newPasswordError}
                        value={newPassword}
                        onKeyDown={handleUserKeyPress}
                        onChange={(e) => { setNewPassword(e.target.value); setNewPasswordError(""); }}
                    />

                    <TextInput
                        id="secondNewPassword"
                        label="Retaper le nouveau mot de passe"
                        type='password'
                        error={secondNewPasswordError}
                        value={secondNewPassword}
                        onKeyDown={handleUserKeyPress}
                        onChange={(e) => { setSecondNewPassword(e.target.value); setSecondNewPasswordError(""); }}
                    />

                    <Button
                        content="Changer le mot de passe"
                        fullWidth
                        onClick={modifyPassword}
                        loading={loading}
                    />
                    {error && <div className='ktext-error text-error'>{error}</div>}
                </div>

            </div>
        </Portal>
    )
}