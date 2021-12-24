import { HeaderMobile } from 'components';
import React from 'react';

export const ForgotPasswordMobile: React.FC = () => {
    return (
        <div className='h-full w-full flex flex-col'>
            <HeaderMobile
                title='Mot de passe oublié'
                backLink='/user/login'
            />

            {/* CONTENT GOES HERE */}
        </div>
    )
}