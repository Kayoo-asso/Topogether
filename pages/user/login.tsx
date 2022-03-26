import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { HeaderDesktop, LoginForm } from 'components';
import { NextRouter, useRouter } from 'next/router';
import { auth, supabaseClient } from 'helpers/services';

export const returnTo = "returnTo;"

async function redirectIfLoggedIn(router: NextRouter) {
  const destination = router.query[returnTo];
  if (typeof destination !== "string") return;

  // TODO: Add indicator
  if (auth.session()) {
    await supabaseClient.auth.refreshSession();
    if (auth.session()) {
      await router.push(destination);
    }
  }
}

const LoginPage: NextPage = () => {
  const router = useRouter();

  // This is bugged now, dunno why
  useEffect(() => {
    redirectIfLoggedIn(router);
  }, [router])
  
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
