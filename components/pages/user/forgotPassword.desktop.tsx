import { HeaderDesktop } from 'components';
import React from 'react';

export const ForgotPasswordDesktop: React.FC = (props) => {
    return (
        <>
            <HeaderDesktop
                backLink="/user/login"
                title="Mot de passe oublié"
                displayLogin
            />

            <div className="flex flex-row h-full">

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}