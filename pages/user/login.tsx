import React from 'react';
import type { NextPage } from 'next';
import { HeaderDesktop, LoginForm } from 'components';

const LoginPage: NextPage = () => {
  
  return (
    <>
      <HeaderDesktop
          backLink="/"
          title="Connexion"
      />

      <div className="w-full h-contentPlusHeader md:h-full flex flex-col items-center justify-center bg-bottom bg-white md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
        <div className="p-10 w-full bg-white md:w-[500px] md:shadow md:rounded-lg">

         <LoginForm /> 

        </div>
      </div>
    </>
  )
};

export default LoginPage;
