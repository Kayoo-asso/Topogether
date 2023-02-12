import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from "helpers/services";
import { Email, isEmail } from 'types';
import { Portal } from 'helpers/hooks/useModal';
import { TextInput } from 'components/molecules/form/TextInput';
import { Button } from 'components/atoms/buttons/Button';

interface ChangeMailModalProps {
    mail: string,
    open: boolean;
    onClose: () => void,
}

export const ChangeMailModal: React.FC<ChangeMailModalProps> = (props: ChangeMailModalProps) => {
    const auth = useAuth();

    const [mail, setMail] = useState(props.mail);

    const [mailError, setMailError] = useState("");
    const [error, setError] = useState<string>("");

	const [loading, setLoading] = useState(false);

    const emptyErrors = () => {
        setMailError("");
        setError("");
    }
	const hasErrors = useCallback(() => {
        let hasError = false;
		if (mail.length === 0) {
			setMailError("Merci de rentrer votre ancien mot de passe");
            hasError = true;
        }
        if (!isEmail(mail)) {
            setMailError("Merci de rentrer un mail valide");
            hasError = true;
        }
		return hasError;
	}, [mail]);

	const modifyMail = useCallback(async () => {
        if (!hasErrors()) {
            setLoading(true);
            const res = await auth.changeEmail(mail as Email);
            setLoading(false);
            if (res) {
                emptyErrors();
                props.onClose();
            }
            else {
                setError("Une erreur est survenue. Merci de réessayer.");
            }
        }
    }, [hasErrors, mail]);

    const handleUserKeyPress = useCallback((e: KeyboardEvent | React.KeyboardEvent<HTMLElement>) => {
		e.stopPropagation();
		if (e.key === "Enter") modifyMail();
		if (e.key === "Escape") props.onClose();
	}, [modifyMail, props.onClose]);
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
                        Modifier l'adresse mail
                    </div>

                    <TextInput
                        id="mail"
                        label="Nouvelle adresse mail"
                        error={mailError}
                        value={mail}
                        onKeyDown={handleUserKeyPress}
                        onChange={(e) => { setMail(e.target.value); setMailError(""); }}
                    />

                    <Button
                        content="Changer l'adresse mail"
                        fullWidth
                        onClick={modifyMail}
                        loading={loading}
                    />
                    {error && <div className='ktext-error text-error'>{error}</div>}
                </div>

            </div>
        </Portal>
    )
}