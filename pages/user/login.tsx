import React from 'react';
import type { NextPage } from 'next';
import { HeaderDesktop, LoginForm } from 'components';

const LoginPage: NextPage = () => {
  
  return (
    <>
      <HeaderDesktop
          backLink="/user/login"
          title="Nouveau topo"
          displayLogin
      />

      <div className="w-full h-full flex flex-col items-center justify-center bg-white md:bg-[url('/assets/img/login_background.png')] md:bg-cover">
        <div className="p-10 w-full md:w-[500px] md:h-[400px] md:shadow md:rounded-lg">

         <LoginForm /> 

        </div>
      </div>
    </>
  )
};

export default LoginPage;
