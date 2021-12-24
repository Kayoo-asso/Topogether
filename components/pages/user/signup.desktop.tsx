import { HeaderDesktop } from 'components';
import React from 'react';

export const SignupDesktop:React.FC = () => {
    return (
        <>
            <HeaderDesktop
                backLink="/user/login"
                title="Créer son compte"
                displayLogin
            />

            <div className="flex flex-row h-full bg-main">

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}